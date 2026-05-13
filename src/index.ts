interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * gitignore MCP — github/gitignore templates.
 *
 * Auth: none. Uses GitHub raw + Contents API (unauthenticated, low rate).
 */


const REPO = 'github/gitignore';
const BRANCH = 'main';
const UA = 'pipeworx-mcp-gitignore/1.0 (+https://pipeworx.io)';

let LIST_CACHE: { at: number; names: string[] } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const tools: McpToolExport['tools'] = [
  {
    name: 'list_templates',
    description: 'List all available .gitignore template names from github/gitignore.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_template',
    description: 'Fetch the raw .gitignore content for the named template (case-sensitive, e.g. "Node", "Python", "macOS").',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Template name without the .gitignore suffix.' } },
      required: ['name'],
    },
  },
  {
    name: 'compose',
    description: 'Compose a combined .gitignore from multiple templates, separated by headers.',
    inputSchema: {
      type: 'object',
      properties: {
        names: {
          type: 'array',
          items: { type: 'string' },
          description: 'e.g. ["Node", "macOS", "VisualStudioCode"]',
        },
      },
      required: ['names'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_templates':
      return { templates: await listTemplates() };
    case 'get_template': {
      const tname = reqStr(args, 'name', '"Node"');
      const body = await fetchTemplate(tname);
      return { name: tname, body };
    }
    case 'compose': {
      const names = args.names;
      if (!Array.isArray(names) || names.length === 0) throw new Error('Required argument "names" must be a non-empty array of template names.');
      const parts: string[] = [];
      for (const raw of names) {
        if (typeof raw !== 'string') continue;
        const body = await fetchTemplate(raw);
        parts.push(`# === ${raw} ===\n${body.trim()}\n`);
      }
      return { names, body: parts.join('\n') };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function listTemplates(): Promise<string[]> {
  const now = Date.now();
  if (LIST_CACHE && now - LIST_CACHE.at < CACHE_TTL_MS) return LIST_CACHE.names;
  const out = new Set<string>();
  for (const path of ['', 'Global', 'community']) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
      { headers: { Accept: 'application/vnd.github+json', 'User-Agent': UA } },
    );
    if (!res.ok) continue;
    const items = (await res.json()) as { name: string; type: string }[];
    for (const it of items) {
      if (it.type === 'file' && it.name.endsWith('.gitignore')) {
        out.add((path ? `${path}/` : '') + it.name.replace(/\.gitignore$/, ''));
      }
    }
  }
  const names = [...out].sort((a, b) => a.localeCompare(b));
  LIST_CACHE = { at: now, names };
  return names;
}

async function fetchTemplate(name: string): Promise<string> {
  // Try several common locations.
  const candidates = [
    `${name}.gitignore`,
    `Global/${name}.gitignore`,
    `community/${name}.gitignore`,
  ];
  for (const path of candidates) {
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.text();
  }
  throw new Error(`gitignore: template "${name}" not found in github/gitignore (root, Global/, community/).`);
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;

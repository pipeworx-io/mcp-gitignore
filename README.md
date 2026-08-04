# @pipeworx/gitignore

`.gitignore` templates from the canonical [github/gitignore](https://github.com/github/gitignore) repo. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `list_templates()` — names of all available templates (Node, Python, etc.)
- `get_template(name)` — raw `.gitignore` text for the given template
- `compose(names[])` — concatenate multiple templates with headers (e.g. ["Node", "macOS", "VisualStudioCode"])

## Data source

Raw files from `https://raw.githubusercontent.com/github/gitignore/main/<Name>.gitignore` (and the `Global/` and `community/` subdirs).

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "gitignore": {
      "url": "https://gateway.pipeworx.io/gitignore/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Gitignore data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

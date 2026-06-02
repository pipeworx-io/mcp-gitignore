# mcp-gitignore

gitignore MCP — github/gitignore templates.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_templates` | List all available .gitignore template names from github/gitignore. |
| `get_template` | Fetch the raw .gitignore content for the named template (case-sensitive, e.g. "Node", "Python", "macOS"). |
| `compose` | Compose a combined .gitignore from multiple templates, separated by headers. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

# moneyflow MCP Server

Query money flows between state, citizens, and enterprises. Simulate policy changes, compare cohorts, check data confidence — directly from Claude, ChatGPT, Cursor, Windsurf, Copilot, or any MCP-compatible tool.

Powered by [money-flow.org](https://money-flow.org).

## Quick Start

### Option 1: Remote URL (no install needed)

For clients that support remote MCP servers — paste the URL, done.

**Claude Desktop:** Settings → Connectors → Add custom connector → `https://money-flow.org/mcp`

**ChatGPT:** Settings → MCP → Add server → `https://money-flow.org/mcp`

**Cline:** MCP Servers → Add → SSE URL → `https://money-flow.org/mcp`

### Option 2: npx (for stdio-based clients)

For Cursor, Windsurf, Claude Code, and other clients that use stdio transport.

**Claude Code:**
```bash
claude mcp add moneyflow -- npx -y moneyflow-mcp@latest
```

**Cursor:** Settings → MCP Servers → Add:
```json
{
  "moneyflow": {
    "command": "npx",
    "args": ["-y", "moneyflow-mcp@latest"]
  }
}
```

**Windsurf:** Settings → MCP → Add Server:
```json
{
  "moneyflow": {
    "command": "npx",
    "args": ["-y", "moneyflow-mcp@latest"]
  }
}
```

**Claude Desktop (via config file):** `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):
```json
{
  "mcpServers": {
    "moneyflow": {
      "command": "npx",
      "args": ["-y", "moneyflow-mcp@latest"]
    }
  }
}
```

### Option 3: Global install

```bash
npm install -g moneyflow-mcp
```

## Supported Clients

| Client | Method | Auth needed |
|--------|--------|-------------|
| Claude Desktop | Remote URL or npx | No |
| ChatGPT | Remote URL | No |
| Claude Code | npx | No |
| Cursor | npx | No |
| Windsurf | npx or Remote URL | No |
| Cline | Remote URL (SSE) | No |
| Copilot | npx or Remote URL | No |
| Amazon Q | npx | No |
| Gemini | Remote URL (rolling out) | No |

## Tools (8, all read-only)

| Tool | Description |
|------|-------------|
| `list_templates` | List available actor templates (households, enterprises, government) |
| `find_template` | Find best template by class, search, NACE code, size |
| `get_flow_path` | Trace money flow path between nodes |
| `get_splits` | Show outgoing flow distribution of a node |
| `simulate` | What-if simulation with macro factors |
| `compare_cohorts` | Compare two cohorts for differences |
| `get_confidence` | Get source quality and confidence data |
| `get_graph_stats` | Graph statistics (templates, sectors, sources) |

## How it works

**Remote URL (Option 1):** Your AI tool connects directly to `money-flow.org/mcp` via StreamableHTTP.

**npx (Option 2):** A thin proxy runs locally via stdio and forwards all requests to `money-flow.org/mcp`. No local database or Docker needed.

```
AI Tool (stdio) → moneyflow-mcp (local) → HTTPS → money-flow.org/mcp
```

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT

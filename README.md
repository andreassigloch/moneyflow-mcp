# moneyflow MCP Server

Query money flows between state, citizens, and enterprises. Simulate policy changes, compare cohorts, check data confidence — directly from Claude, Cursor, Windsurf, or any MCP-compatible tool.

Powered by [money-flow.org](https://money-flow.org).

## Installation

### Option 1: npx (recommended)

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "moneyflow": {
      "command": "npx",
      "args": ["-y", "moneyflow-mcp@latest"],
      "env": {
        "MONEYFLOW_API_KEY": "your-api-key (optional)"
      }
    }
  }
}
```

### Option 2: Global install

```bash
npm install -g moneyflow-mcp
```

Then add to Claude Desktop config:

```json
{
  "mcpServers": {
    "moneyflow": {
      "command": "moneyflow-mcp"
    }
  }
}
```

### Option 3: MCPB Bundle (Claude Desktop)

Download the `.mcpb` file from [GitHub Releases](https://github.com/andreassigloch/moneyflow-mcp/releases) and double-click to install.

## Tools

| Tool | Description |
|------|-------------|
| `moneyflow_list_templates` | List available actor templates (households, enterprises, government) |
| `moneyflow_find_template` | Find best template by class, search, NACE code, size |
| `moneyflow_get_flow_path` | Trace money flow path between nodes |
| `moneyflow_get_splits` | Show outgoing flow distribution of a node |
| `moneyflow_simulate` | What-if simulation with macro factors |
| `moneyflow_compare_cohorts` | Compare two cohorts for differences |
| `moneyflow_get_confidence` | Get source quality and confidence data |
| `moneyflow_get_graph_stats` | Graph statistics (templates, sectors, sources) |

## Configuration

| Environment Variable | Required | Description |
|---------------------|----------|-------------|
| `MONEYFLOW_API_URL` | No | API base URL (default: `https://money-flow.org`) |
| `MONEYFLOW_API_KEY` | No | API key for higher rate limits |

## How it works

This is a thin MCP client that runs locally via stdio and proxies all tool calls to the moneyflow API. No local database or Docker needed.

```
Claude Desktop (stdio) → moneyflow-mcp → HTTPS → money-flow.org
```

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT

#!/usr/bin/env node
/**
 * moneyflow MCP Proxy — stdio ↔ StreamableHTTP
 *
 * Runs locally as stdio server (for Claude Desktop / Cursor / Windsurf).
 * Proxies all MCP requests to the remote moneyflow server via StreamableHTTP.
 *
 * Architecture: Claude Desktop (stdio) → this proxy → HTTPS → money-flow.org/mcp
 *
 * @author andreas@siglochconsulting
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolResultSchema,
  ListToolsResultSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_URL = process.env.MONEYFLOW_API_URL || 'https://money-flow.org';
const API_KEY = process.env.MONEYFLOW_API_KEY || '';

// ---------- Remote MCP Client ----------

let remoteClient: Client | null = null;

async function getRemoteClient(): Promise<Client> {
  if (remoteClient) return remoteClient;

  const client = new Client(
    { name: 'moneyflow-proxy', version: '0.1.0' },
    { capabilities: {} }
  );

  const headers: Record<string, string> = {};
  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }

  const transport = new StreamableHTTPClientTransport(
    new URL(`${API_URL}/mcp`),
    { requestInit: { headers } }
  );

  await client.connect(transport);
  remoteClient = client;
  return client;
}

// ---------- Local stdio Server (proxy) ----------

const server = new Server(
  { name: 'moneyflow', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

// Proxy tools/list → remote server
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const client = await getRemoteClient();
    const result = await client.request(
      { method: 'tools/list', params: {} },
      ListToolsResultSchema
    );
    return { tools: result.tools };
  } catch (error) {
    console.error('Failed to list tools from remote:', error);
    // Fallback: return empty list so Claude sees the server is alive
    return { tools: [] };
  }
});

// Proxy tools/call → remote server
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const client = await getRemoteClient();
    const result = await client.request(
      {
        method: 'tools/call',
        params: {
          name: request.params.name,
          arguments: request.params.arguments,
        },
      },
      CallToolResultSchema
    );
    return result;
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// ---------- Start ----------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`moneyflow MCP proxy running on stdio (remote: ${API_URL}/mcp)`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

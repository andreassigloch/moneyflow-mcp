import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

describe('moneyflow-mcp package', () => {
  it('package.json has required fields for npm publish', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('moneyflow-mcp');
    expect(pkg.bin).toBeDefined();
    expect(pkg.bin['moneyflow-mcp']).toBe('dist/index.js');
    expect(pkg.files).toContain('dist');
    expect(pkg.files).toContain('server.json');
    expect(pkg.private).toBeUndefined();
    expect(pkg.license).toBe('MIT');
  });

  it('server.json is valid MCP registry definition', () => {
    const serverJson = JSON.parse(readFileSync(join(root, 'server.json'), 'utf-8'));
    expect(serverJson.name).toBe('moneyflow');
    expect(serverJson.package.registryType).toBe('npm');
    expect(serverJson.package.identifier).toBe('moneyflow-mcp');
    expect(serverJson.transport.type).toBe('stdio');
  });

  it('manifest.json has required fields for Claude Desktop', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf-8'));
    expect(manifest.name).toBe('moneyflow-mcp');
    expect(manifest.server.type).toBe('node');
    expect(manifest.server.entry_point).toBe('dist/index.js');
    expect(manifest.tools.length).toBe(8);
    expect(manifest.compatibility.runtimes.node).toBe('>=20.0.0');
  });

  it('dist/index.js has shebang', () => {
    const content = readFileSync(join(root, 'dist', 'index.js'), 'utf-8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('dist/index.js imports MCP SDK', () => {
    const content = readFileSync(join(root, 'dist', 'index.js'), 'utf-8');
    expect(content).toContain('@modelcontextprotocol/sdk');
    expect(content).toContain('StdioServerTransport');
    expect(content).toContain('StreamableHTTPClientTransport');
  });
});

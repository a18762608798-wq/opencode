# 常用 MCP Server

## GitHub

旧的 `@modelcontextprotocol/server-github` 已不建议继续使用，可使用 GitHub 官方维护的 MCP Server。

```json
{
  "mcp": {
    "servers": {
      "github": {
        "type": "local",
        "command": [
          "docker",
          "run",
          "-i",
          "--rm",
          "-e",
          "GITHUB_PERSONAL_ACCESS_TOKEN",
          "ghcr.io/github/github-mcp-server"
        ],
        "environment": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "{env:GITHUB_PAT}"
        }
      }
    }
  }
}
```

## Brave Search

```json
{
  "mcp": {
    "servers": {
      "brave-search": {
        "type": "local",
        "command": [
          "npx",
          "-y",
          "@brave/brave-search-mcp-server",
          "--transport",
          "stdio"
        ],
        "environment": {
          "BRAVE_API_KEY": "{env:BRAVE_API_KEY}"
        }
      }
    }
  }
}
```

## Playwright

浏览器自动化可使用 Playwright MCP：

```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "type": "local",
        "command": [
          "npx",
          "-y",
          "@playwright/mcp@latest"
        ]
      }
    }
  }
}
```

数据库类 MCP Server 建议使用只读账号，并限制可访问的数据库、表和 SQL 类型。

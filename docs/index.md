# OpenCode 使用手册（本地版，V2）

> 按 V2（`opencode v2.0.x`）整理。官方文档以 <https://opencode.ai/v2/docs/> 为准。

## 入门

- [安装](01-getting-started/install.md)
- [配置](01-getting-started/config.md)（模型、提供商、`opencode.jsonc`）
- [常用命令与快捷键](01-getting-started/command.md)（TUI 斜杠命令、按键绑定）
- [无头模式](01-getting-started/headless.md)（`run` / `serve` / API）

## Agent

- [Agent 系统](agents/01-agents.md)（内置 Agent、自定义 Agent、权限 action）
- [组织多个 Agent](agents/02-agents-organization.md)（primary / subagent 协作）

## MCP

- [MCP 协议与配置](mcps/01-mcp-definition.md)（`mcp.servers`、本地/远端、OAuth）
- [常用 MCP Server](mcps/02-mcps-office.md)
- [编写自定义 MCP Server](mcps/03-mcps-creator.md)

## Skill

- [Skill 定义](skills/skills-definition.md)（目录结构、frontmatter、加载与权限）
- [Skill 市场与安装](skills/skills_market.md)（`npx skills`）

## Web 访问

- [手机浏览器访问指南](../web/README.md)（`serve` + Tailscale；或 `opencode pair`）

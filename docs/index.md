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

## 仓库导航

- [README.md](../README.md) — 本仓库总览：目录结构、Skills 清单、关键配置
- [AGENTS.md](../AGENTS.md) — 全局工作规则（语言、修改原则、Spec Kit 返工门禁、SDD 目录、技能调用）
- `sdd/` — 规范文档：
  - [sdd/change-oriented-computing/](../sdd/change-oriented-computing/README.md) — 变更驱动计算（COC）理论总纲
  - [sdd/openspec/](../sdd/openspec/install.md) — OpenSpec CLI 安装、配置与轻量工作流
  - [sdd/specify/](../sdd/specify/usage/default.md) — GitHub Spec Kit 全套文档与自定义 Presets（`install.md`、`config.md`、`usage/`、`dev/scientific-computing`、`dev/scientific-paper`）

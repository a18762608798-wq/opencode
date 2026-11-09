# OpenCode 全局配置

`~/.config/opencode`，OpenCode V2（`v2.0.x`）。

## 结构

| 路径 | 说明 |
|------|------|
| `AGENTS.md` | 全局工作规则（语言、skill 调用） |
| `opencode.jsonc` | 主配置：默认模型、provider、权限、MCP、插件 |
| `cli.json` / `service.json` | TUI 显示配置 / `serve` 服务配置 |
| `skills/` | 已迁至 `~/.agents/skills`（与 Pi 双端共享，10 个），本仓不再保留 |
| `agents/` | 3 个异构子 Agent（`coder`/`env-ops`/`reviewer`），由主会话按需直接调用 |
| `plugins/` | 全局仅保留 `formula-style.ts`（LaTeX `$` / `$$` 公式格式注入）；Spec Kit 返工插件已迁到 `~/.agents/sdd/specify/plugins/speckit-rework/opencode/`，初始化项目后按需安装到项目 `.opencode/plugins/` |
| `~/.agents/sdd/` | 共享的规范驱动开发文档与 Presets |
| `docs/` | 本地手册，入口见 `docs/index.md` |
| `docs/web/README.md` | 手机浏览器访问（`serve` / `pair` + Tailscale） |

主配置要点（见 `opencode.jsonc`）：默认模型 `opencode-go/muse-spark-1.3-contributor#xhigh`，未设 `default_agent`（主会话默认直接处理，需要时直接调用子 Agent）；provider 白名单放行 `opencode-go` + `vankit-0.06` / `vankit-0.15` / `vankit-0.25` / `vankit-0.55`；MCP 为 `playwright`，`context7` 由 `@upstash/context7-opencode` 插件托管。

## 使用

1. 此目录放在 `~/.config/opencode`。
2. `npm install` 安装插件依赖（`@opencode/plugin`）。
3. 设置环境变量：`VANKIT_0_06_API_KEY`、`VANKIT_0_15_API_KEY`、`VANKIT_0_25_API_KEY`、`VANKIT_0_55_API_KEY`。
4. 运行 `opencode`。

## SDD：规范驱动开发

共享文档与 Presets 位于 `~/.agents/sdd/`。

## Skills

| Skill | 用途 |
|-------|------|
| `agent-browser` | 浏览器自动化 |
| `env-proxy` | 本地代理环境变量开关 |
| `find-skills` | 发现和安装 skills |
| `git-push-all` | 批量推送全部 git 仓库（明确指定才触发） |
| `problem-recorder` | 问题与原文存档为 Markdown（明确要求才触发） |
| `product-doc-writer` | 成套产品说明文档（安装+配置+使用，Linux Mint） |
| `skill-creator` | 创建和优化 skills |
| `gamma-book-hunter` | 找书/讲义并入库 Gamma |
| `gamma-paper-hunter` | 按任务找论文并入库 Gamma |

## 参考

* `docs/index.md` — 本地手册总目录
* `docs/agents/02-agents-organization.md` — primary/subagent 协作示例

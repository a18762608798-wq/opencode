# OpenCode 全局配置

`~/.config/opencode`，OpenCode V2（`v2.0.x`）。

## 结构

| 路径 | 说明 |
|------|------|
| `AGENTS.md` | 全局工作规则（语言、修改原则、Spec Kit 返工门禁、skill 调用） |
| `opencode.jsonc` | 主配置：默认模型、provider、权限、MCP、插件 |
| `cli.json` / `service.json` | TUI 显示配置 / `serve` 服务配置 |
| `skills/` | 自动加载，共 11 个 skill |
| `agents/speckit-guide.md` | Spec Kit 流程 Agent |
| `plugins/speckit-rework-gate.ts` | Spec Kit 返工门禁本地插件 |
| `launch-mode/` | 启动方式插件，当前 `mode: desktop` |
| `docs/` | 本地手册，入口见 `docs/index.md` |
| `web/README.md` | 手机浏览器访问（`serve` / `pair` + Tailscale） |

主配置要点（见 `opencode.jsonc`）：默认模型 `opencode-go/muse-spark-1.3-contributor`；provider 仅允许 `opencode-go` + `vankit-0.06`；MCP 为 `playwright`、`zotero`（本地 `zotero-mcp`），`context7` 由 `@upstash/context7-opencode` 插件托管。

## 使用

1. 此目录放在 `~/.config/opencode`。
2. `npm install` 安装插件依赖（`@opencode/plugin`）。
3. 设置环境变量：`VANKIT_0_06_API_KEY`、`VANKIT_0_15_API_KEY`、`VANKIT_0_25_API_KEY`、`VANKIT_0_55_API_KEY`、`ZOTERO_API_TOKEN`、`ZOTERO_USERID`。
4. 运行 `opencode`。

## Skills

| Skill | 用途 |
|-------|------|
| `agent-browser` | 浏览器自动化 |
| `book-mainline-grasper` | 抓书主线 + 落笔记 + Zotero 打标（三件套，明确指定才触发） |
| `env-proxy` | 本地代理环境变量开关 |
| `find-skills` | 发现和安装 skills |
| `git-push-all` | 批量推送全部 git 仓库（明确指定才触发） |
| `knowledge-organizer` | 对话知识点归档到知识库 |
| `problem-recorder` | 问题与原文存档为 Markdown（明确要求才触发） |
| `product-doc-writer` | 成套产品说明文档（安装+配置+使用，Linux Mint） |
| `skill-creator` | 创建和优化 skills |
| `zotero-book-hunter` | 找书/讲义并入库 Zotero |
| `zotero-paper-hunter` | 按任务找论文并入库 Zotero `paper/inbox` |

## 参考

* `docs/index.md` — 本地手册总目录
* `docs/agents/02-agents-organization.md` — primary/subagent 协作示例

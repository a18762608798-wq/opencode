# Handoff：插件清单梳理

## 任务目标
盘点 `/home/mintusr/.config/opencode` 下所有生效插件（`plugins/`、`launch-mode/`、`opencode.jsonc` 的 `plugins` 字段），说明名称与核心作用。仅文档，不改业务代码。

## 生效插件（共 4 个）

| 来源 | 名称 | 核心作用 |
| --- | --- | --- |
| `opencode.jsonc` → `plugins` | `@upstash/context7-opencode` | 运行时注入远程 MCP `context7`（有 `CONTEXT7_API_KEY` 用 Bearer，否则走 OAuth），并把包内 `skills/context7-mcp` 挂到 `skills.paths`；提供 `resolve-library-id` / `query-docs` 查最新库文档。 |
| `opencode.jsonc` → `plugins` | `launch-mode`（本地目录，`options.mode: "desktop"`） | 通过 `session` 的 `context` 钩子注入系统提示：声明当前启动端（web/desktop/tui），并强制数学公式用 LaTeX `$...$` / `$$...$$`，禁用 `\(...\)`、`\[...\]`。 |
| `plugins/` 自动发现 | `manager-gemini-guard` | 在 `context` / `compaction` / `generate` / `title` / `model.request` 五个钩子上拦截：除 `manager` 外的 agent 一旦使用 Gemini 4 系（正则 `/gemini.*4|argon/i`）直接抛错；`title` 请求无 agent，一律拦 Gemini。 |
| `plugins/` 自动发现 | `speckit-rework-gate` | Spec Kit 已实现 feature 的返工门禁状态机：`select_feature → assess_impact(含 scope glob) → 按 spec→plan→tasks→checklists 逐层 gate → implementation-open → close`；未过门时 `edit`/`shell` 写入被 deny，`tasks.md` 只允许 `speckit_rework_complete_task` 勾选；`/speckit.*` 命令完全旁路。 |

### 备注
- `speckit-rework-gate` 暴露 `speckit_rework_list_features`、`speckit_rework_select_feature`、`speckit_rework_assess_impact`、`speckit_rework_gate`、`speckit_rework_complete_task`、`speckit_rework_close`、`speckit_rework_reset` 七个工具，并以 `prompt` 钩子（`MODIFY_RE` 命中 + `.specify`/`specs` 项目检测 + 已实现 feature 指针）自动开启事务。
- `manager-gemini-guard` 仅靠模型 id 正则，若 Gemini 4 以别名（如 argon）出现亦可拦截；非 Gemini 4 模型不受影响。
- 两个本地插件都是单文件 TS，直接放在 `plugins/` 由 OpenCode 自动加载；`launch-mode` 是独立包目录，经 `plugins` 配置以路径形式加载。

## 验证
- `opencode plugin list`：实际加载 4 个——`context7`（@upstash/context7-opencode 0.2.0）、`launch-mode`（local）、`manager-gemini-guard`（local）、`speckit-rework-gate`（local），与清单一致。
- `node --experimental-strip-types --check plugins/*.ts launch-mode/*.ts`：4 个文件语法检查通过（无测试套件）。
- `git status`：业务代码无改动，工作区仅新增本 handoff 文档。

# OpenCode 全局配置

`~/.config/opencode`，OpenCode V2（`v2.0.x`）。

## 结构

| 路径 | 说明 |
|------|------|
| `AGENTS.md` | 全局工作规则（语言、修改原则、Spec Kit 返工门禁、skill 调用） |
| `opencode.jsonc` | 主配置：默认模型、provider、权限、MCP、插件 |
| `cli.json` / `service.json` | TUI 显示配置 / `serve` 服务配置 |
| `skills/` | 自动加载，共 12 个 skill |
| `agents/` | 7 个 Agent：主控 `commander` + 5 个专职子 Agent（`explorer`/`researcher`/`integrator`/`implementer`/`reviewer`）+ `speckit-guide` |
| `plugins/` | 2 个本地插件：`commander-model-guard.ts`（`gemini-4-argon-contributor` 仅限 `commander` 使用）、`speckit-rework-gate.ts`（Spec Kit 返工门禁） |
| `sdd/` | 规范驱动开发文档：COC 理论、OpenSpec、GitHub Spec Kit 全套文档与 Presets（见下节） |
| `launch-mode/` | 启动方式插件，当前 `mode: desktop` |
| `docs/` | 本地手册，入口见 `docs/index.md` |
| `docs/web/README.md` | 手机浏览器访问（`serve` / `pair` + Tailscale） |

主配置要点（见 `opencode.jsonc`）：默认 Agent 为 `commander`，默认模型 `opencode-go/muse-spark-1.3-contributor#xhigh`；provider 白名单放行 `opencode-go` + `vankit-0.06` / `vankit-0.15` / `vankit-0.25` / `vankit-0.55`；MCP 为 `playwright`、`zotero`（本地 `zotero-mcp`），`context7` 由 `@upstash/context7-opencode` 插件托管。

## 使用

1. 此目录放在 `~/.config/opencode`。
2. `npm install` 安装插件依赖（`@opencode/plugin`）。
3. 设置环境变量：`VANKIT_0_06_API_KEY`、`VANKIT_0_15_API_KEY`、`VANKIT_0_25_API_KEY`、`VANKIT_0_55_API_KEY`、`ZOTERO_API_TOKEN`、`ZOTERO_USERID`。
4. 运行 `opencode`。

## SDD：规范驱动开发（Spec-Driven Development）与 GitHub Spec Kit（`sdd/`）

`sdd/` 是规范驱动开发（Spec-Driven Development, SDD）的文档集，包含三个子目录：

1. **`sdd/change-oriented-computing/`** — 底层计算哲学：面向变更的计算（Change-Oriented Computing, COC）理论总纲（`README.md`），演化流程为一等对象链路：`State -> Change -> Artifact Graph -> Approval -> Actions -> Evidence -> State'`；配套 `cognitive-loop.md`（人机认知协作闭环）：区分「结果可信度」与「个人理解深度 L1–L3」，以**选择性理解**（重要性/脆弱性/延展性）代替平均分配注意力，形成「AI 扩展探索范围 -> 人类理解整体结构 -> 选择性深入重建 -> 提出更好的问题」的认知正反馈循环。
2. **`sdd/openspec/`** — OpenSpec CLI 的安装、配置与轻量工作流文档（`install.md`、`config.md`、`usage.md`）。
3. **`sdd/specify/`（核心）** — GitHub Spec Kit（`specify-cli`）全套文档与自定义预设（Presets）：
   - 基础文档：`install.md`、`config.md`、`usage/default.md`（标准 9 步流程：`constitution -> specify -> clarify -> plan -> checklist -> tasks -> analyze -> implement -> converge`）、`usage/self-define/README.md`（Preset/Template/Command 定制指南）、`GOAL_DRIVEN_LOOP_PLAN.md`（目标驱动闭环规划）。
   - `dev/scientific-computing/`（v0.4.0，priority 3）：科学计算与数值实验 Preset，含 4 个模板、7 个定制命令与 6 个 `scientific-*` 领域 skills；理论、实验契约与代码实现分离。挂载到具体科研项目：

     ```bash
     specify preset add --dev ~/.config/opencode/sdd/specify/dev/scientific-computing --priority 3
     ```

   - `dev/scientific-paper/`（v0.3.1，priority 4）：科学论文写作 Preset，含 PRA 模板、7 个定制命令与 8 个 `paper-*` 写作/自审/修订 skills；论文主张绑定上游实验数据 `D##`。挂载：

     ```bash
     specify preset add --dev ~/.config/opencode/sdd/specify/dev/scientific-paper --priority 4
     ```

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
| `structured-proof` | 数学物理链式结构化证明 |
| `zotero-book-hunter` | 找书/讲义并入库 Zotero |
| `zotero-paper-hunter` | 按任务找论文并入库 Zotero `paper/inbox` |

## 参考

* `docs/index.md` — 本地手册总目录
* `docs/agents/02-agents-organization.md` — primary/subagent 协作示例

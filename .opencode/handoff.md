# Handoff：插件清单梳理

## 任务目标
盘点 `/home/mintusr/.config/opencode` 下所有生效插件（`plugins/`、~~`launch-mode/`、~~`opencode.jsonc` 的 `plugins` 字段），说明名称与核心作用。仅文档，不改业务代码。（2026-10-25 注：`launch-mode/` 经核查不存在，见下文更正。）

## 生效插件（共 4 个；2026-10-25 更正：原表误列 `launch-mode`——经核查 `~/.config/opencode/launch-mode/` 不存在，`opencode.jsonc` 的 `plugins` 仅含 `@upstash/context7-opencode`，docs/ 全仓 grep 亦无引用；实际第 4 个是遗漏的 `formula-style`。下表已更正；2026-10-25 用户又删除 `manager-gemini-guard`，当前生效 3 个，见下文删除记录。）

| 来源 | 名称 | 核心作用 |
| --- | --- | --- |
| `opencode.jsonc` → `plugins` | `@upstash/context7-opencode` | 运行时注入远程 MCP `context7`（有 `CONTEXT7_API_KEY` 用 Bearer，否则走 OAuth），并把包内 `skills/context7-mcp` 挂到 `skills.paths`；提供 `resolve-library-id` / `query-docs` 查最新库文档。 |
| `plugins/` 自动发现 | `formula-style` | 通过 `session` 的 `context` 钩子注入数学公式排版规则：强制 LaTeX `$...$` / `$$...$$`，禁用 `\(...\)`、`\[...\]`（对应 Pi 侧 `APPEND_SYSTEM.md`/`AGENTS.md` 中的公式规范，已迁 Pi 为同名扩展）。 |
| `plugins/` 自动发现 | `manager-gemini-guard`**【已删除】** | 在 `context` / `compaction` / `generate` / `title` / `model.request` 五个钩子上拦截：除 `manager` 外的 agent 一旦使用 Gemini 4 系（正则 `/gemini.*4|argon/i`）直接抛错；`title` 请求无 agent，一律拦 Gemini。 |
| `plugins/` 自动发现 | `speckit-rework-gate` | Spec Kit 已实现 feature 的返工门禁状态机：`select_feature → assess_impact(含 scope glob) → 按 spec→plan→tasks→checklists 逐层 gate → implementation-open → close`；未过门时 `edit`/`shell` 写入被 deny，`tasks.md` 只允许 `speckit_rework_complete_task` 勾选；`/speckit.*` 命令完全旁路。 |

### 备注
- `speckit-rework-gate` 暴露 `speckit_rework_list_features`、`speckit_rework_select_feature`、`speckit_rework_assess_impact`、`speckit_rework_gate`、`speckit_rework_complete_task`、`speckit_rework_close`、`speckit_rework_reset` 七个工具，并以 `prompt` 钩子（`MODIFY_RE` 命中 + `.specify`/`specs` 项目检测 + 已实现 feature 指针）自动开启事务。
- `manager-gemini-guard`**【已删除】**仅靠模型 id 正则，若 Gemini 4 以别名（如 argon）出现亦可拦截；非 Gemini 4 模型不受影响。
- 三个本地插件都是单文件 TS，直接放在 `plugins/` 由 OpenCode 自动加载（2026-10-25 更正：原“两个本地插件…`launch-mode` 是独立包目录”一句有误，本仓从无 `launch-mode` 目录；本地插件当时共三个单文件）；用户删除 `manager-gemini-guard.ts` 后，本地插件现剩两个单文件。
- Pi 移植加固差异（2026-10-25 起，本仓原插件未动）：Pi 侧 `speckit-rework-gate` 对仓库外写入默认拒绝（原插件 `outside → continue` 全放行）；后续 reviewer 轮次继续收紧（shell 词法分析 + fail-closed、包装器透视、写删命令建模、白名单 + symlink + 目录 join，见 Pi handoff）；**Pi Bash 门禁不是完整沙箱**，本仓原插件未动、语义不变。

## 验证
- `opencode plugin list`（2026-10-25 更正：原“实际加载 4 个——`context7`、`launch-mode`、`manager-gemini-guard`、`speckit-rework-gate`”有误，无 `launch-mode`；应为 `context7`（@upstash/context7-opencode 0.2.0）+ 三个本地单文件插件 `formula-style`、`manager-gemini-guard`、`speckit-rework-gate`，与更正后的清单一致；此为删除前验证。删除后当前清单为 `context7` + `formula-style` + `speckit-rework-gate`。）
- `node --experimental-strip-types --check plugins/*.ts launch-mode/*.ts`：~~4 个文件语法检查通过~~ → 更正为 `plugins/*.ts` 3 个文件（无 `launch-mode/*.ts`；无测试套件）；此为删除前验证，删除后剩余两个本地插件文件仍可通过类型检查。
- `git status`：业务代码无改动，工作区仅新增本 handoff 文档。

## 用户删除 manager 相关配置（当前状态，2026-10-25）
- 已删除 `agents/manager.md`、`plugins/manager-gemini-guard.ts`；`agents/` 现剩 `coder.md`、`env-ops.md`、`reviewer.md`，`plugins/` 现剩 `formula-style.ts`、`speckit-rework-gate.ts`。
- `README.md`、`docs/agents/01-agents.md`、`docs/agents/02-agents-organization.md`、`docs/01-getting-started/config.md`、`opencode.jsonc` 注释已同步更新，主会话默认直接处理、按需直接调用子 Agent。
- 当前验证：`opencode plugin list` 为 `context7`、`formula-style`、`speckit-rework-gate`；`opencode run --model opencode-go/glm-5.3-flash "只回复两个字：好的"` → “好的”；剩余插件类型检查通过。
- Pi 侧同步删除见 `~/.pi/.opencode/handoff.md`。

---

# 追加：OpenCode → Pi 迁移（env-ops，2026-10-24）

## 状态：ENV_READY

## 关键变更
1. **Skills 共享**：实体保留 `~/.config/opencode/skills`（git 管理）；`~/.pi/agent/skills -> /home/mintusr/.config/opencode/skills`（软链接）。验证：`pi -p` 列出 10 个 skills 全部生效。
2. **规则迁移**：新建 `~/.pi/agent/APPEND_SYSTEM.md` = OpenCode 全局工作规则（中文/技能调用）+ Tool Selection Priority（read/edit/write 优先于 bash 六条）；pi 自动附加系统提示（resource-loader 已确认机制）；`~/.pi/agent/AGENTS.md` 保留并行生效。
3. **插件**：`pi install npm:pi-lsp-adapter`（0.1.3）+ `pi install npm:pi-web-access`（0.28.0）——当时 `pi list` 3 packages（+原 pi-web-ui）；第五轮卸载 pi-web-access 后当时为 2 项，第八轮卸载 pi-web-ui 后现为 1 项。
4. **MCP 对齐**：pi `mcp.json` zotero 补 `ZOTERO_LOCAL=true` + toolsets=libraries,search-admin,pdf-geometry,discovery；新增 playwright（chromium headless, direct）。`pi mcp list`：zotero 43 tools / playwright 25 tools connected。
5. **Pi Agent Desktop v0.4.3**（DLYZZT/pi-desktop）：AppImage 装到 `~/Applications/Pi-Agent-Desktop-0.4.3-x86_64.AppImage`（190,872,400 bytes ≈ 190.9 MB / 182 MiB, chmod+x）；desktop 条目 + 图标就绪（desktop-file-validate OK，fusermount3 3.14.0 可用）；GUI 实测 DISPLAY=:0 窗口 1280x840 创建成功；内置 pi-coding-agent **1.4.0**（app.asar 实测，非官网旧描述的 0.87.1），与系统 pi 共用 `~/.pi/agent`。

## Reviewer 修复（第二轮，2026-10-24）
1. **pi-lsp-adapter 语言服务器**：经扩展 managed installer（RPC `/lsp install`）装 `vtsls`（0.3.0，后卸载）与 `pyright`（1.1.410，保留）。
2. **桌面端 PATH 兜底**（nvm 仅在 ~/.bashrc，GUI 无 node）：新建 `~/.pi/agent/lsp.json` 用绝对 node 解释器覆盖 server command；`mcp.json` 的 playwright 由 `npx` 改为绝对 node + 全局安装的 `@playwright/mcp@0.0.83` cli.js。`pi mcp list` 重新验证 connected。
3. **handoff 更正**：体积（190.9 MB）、Desktop 内置 pi 版本（1.4.0）、mcp.json 备份位置（持久化到 `~/.pi/.opencode/mcp.json.pre-migration.json`）。

## Reviewer 修复（第七轮，2026-10-25）：删除 speckit-guide agent（用户确认）
- **用户确认删除**（非迁移遗留）：`~/.config/opencode/agents/speckit-guide.md` 已删除；agents/ 剩 4 个（manager/coder/env-ops/reviewer）。
- 引用清理（配置与文档共 6 处，均为明确引用）：`docs/agents/01-agents.md`（架构句 + 表格行）、`docs/agents/02-agents-organization.md`（架构注 + 流程句）、`docs/01-getting-started/config.md`（目录树行，5→4 个）、`README.md`（目录表行，5→4 个）；全仓 grep 零残留。
- **加载验证**：`opencode run --model opencode-go/glm-5.3-flash "只回复两个字：好的"` → "好的"（退出码 0，配置加载正常）；未提交的 `D` 删除记录与 skills 迁移一并留给主控固化。
- opencode.jsonc、其他 agents、插件、Pi 配置均未改动。

## Reviewer 修复（第六轮，2026-10-25）：skills 迁 ~/.agents/skills + Context7 官方远程 MCP
1. **核实**：两端均原生支持 `~/.agents/skills`（OpenCode 文档明列全局路径；Pi 源码 `package-manager.js` 原生发现用户级目录且免 trust）。
2. **迁移**：10 个 skill 实体 `mv` 至 `~/.agents/skills/`；删除 opencode 仓内 `skills/`（36 个 `D` 删除记录，历史可 `git log --follow` 回溯，未提交）；删除 pi 端软链接；两端无任何软链接/路径配置，纯原生发现。git 固化建议（未自动执行）：opencode 仓 `git add -A skills/ && git commit`；home 仓（`.gitignore` 已放行 `!/.agents/`）`git add .agents/skills && git commit`。
3. **双端验证**：OpenCode `opencode run` 列出 **13 个** skills（10 迁移实体 + context7-mcp + opencode/report 内置）；Pi `pi -p` 列出恰好 10 个 ✓。
4. **Context7 MCP（pi 端）**：`mcp.json` 新增官方远程 `https://mcp.context7.com/mcp`（匿名限速，无 PATH 依赖），`pi mcp list --json` state=connected；**实际调用** `resolve-library-id` 查 'react' 返回 `/reactjs/react.dev` ✓。OpenCode 端仍用 @upstash/context7-opencode 插件未动。
5. **回归**：pyright 诊断命中（total=2）、Desktop AppImage 在位、zotero 43 / playwright 25 tools connected、10 skills 双端发现——均未破坏。

## Reviewer 修复（第五轮，2026-10-25）：卸载 pi-web-access
- `pi remove npm:pi-web-access`（退出码 0）：settings.packages 当时为 `["../custom/pi-web-ui", "npm:pi-lsp-adapter"]`；`pi list` 一致。
- 残留清理：`~/.pi/agent/npm/node_modules/pi-web-access` 及 hoisted 依赖随 remove 自动删除；运行时缓存空目录 `~/.pi/web-search-cache/` 已 `rmdir`（其内 `mvf49it0tvq14d.json` 早已删除，git `D` 记录未提交）。
- 冒烟复验：`pi -p "只回复两个字：好的"` → "好的"，stderr 仅剩 pi-lsp-adapter 一条 peerDependencies Warning（退出码 0）。
- Pi Agent Desktop、pi-lsp-adapter、MCP（zotero/playwright）、skills 当时均未改动；`pi-web-ui` 当时仍在，第八轮已卸载；详情见 `~/.pi/.opencode/handoff.md`。

## Reviewer 修复（第八轮，2026-10-25）：卸载 pi-web-ui
- `pi remove ../custom/pi-web-ui`（退出码 0）：settings.packages 现为 `["npm:pi-lsp-adapter"]`；`pi list` 一致。
- 源码清理：`rm -rf ~/.pi/custom/pi-web-ui`（删除前约 763M，该路径现已不存在）。
- 冒烟复验：`pi --no-session --model opencode-go/glm-5.3-flash -p "只回复两个字：好的"` → “好的”，stderr 仅剩 pi-lsp-adapter 一条 peerDependencies Warning（退出码 0）。

## Reviewer 修复（第三轮，2026-10-25）
1. **350ms 首次诊断空 → 轮询 patch**：`pi-lsp-adapter/src/lsp/runtimeManager.ts` `diagnostics()` 由固定 delay(350) 改为轮询（100ms 步长、默认上限 2000ms）。实测 pyright 冷启动真实命中（RPC 捕获工具原始返回 total=2：reportReturnType + hint；durationMs ~2500）。
2. **tsserver 型 server（vtsls/tsls）深层不兼容 Node v24.20**（strace：parent 写 ipc 5 条、child 回写、parent 端不读；stdio 模式 child 秒退）——vtsls 已卸载（52MB 释放）；tsls 安装保留但 `filetypes: []` 禁用；**TS/JS 类型检查 fallback：bash + 全局 `tsc --noEmit`（typescript@6.0.3，实测命中 TS2322）**。
3. **同步膨胀防护**：`~/.pi/agent/lsp/.gitignore`（`*`+豁免 `.gitignore`/`lsp.lock.json`）——63MB 运行时不进 git 同步，`git check-ignore` 验证生效；仓库内 `~/.pi/web-search-cache/` 中 `mvf49it0tvq14d.json` 已删除（未提交），目录保留为空（说明见 handoff）。
4. **handoff 补全**：完整版本清单、启动 stderr 警告原文（peerDependencies 两条，无害）、三轮缓存/临时文件删除说明（含持久备份位置）。详见 `~/.pi/.opencode/handoff.md`。

## 未迁移（有意）
- opencode `agents/`（subagent 机制）、`plugins/`（speckit-rework-gate / manager-gemini-guard / formula-style，opencode TS API）、permissions V2（pi 端已有 permission-gate/protected-paths extensions 等价）、experimental.policies。
- 备选未装：`npm:pi-lsp-extension`(1.4.0)（对话推荐的全功能 LSP，与 pi-lsp-adapter 重叠）、`npm:pi-subagents`(0.81.0)。

## 详情
完整记录：`~/.pi/.opencode/handoff.md`

---

# 追加：插件迁 Pi（coder，2026-10-25）

## 状态：历史 DONE；`manager-gemini-guard` 已按用户要求删除，当前剩余 `formula-style`、`speckit-rework-gate`（部分不等价声明仅为删除前记录）。

## 变更
1. **本仓当时改动**：`plugins/formula-style.ts`、`manager-gemini-guard.ts`、`speckit-rework-gate.ts` 未动；`agents/`、配置文档均未动（`launch-mode` 本就不存在，无从改动，见顶部更正）。此后用户已删除 `agents/manager.md`、`plugins/manager-gemini-guard.ts`，当前本地插件仅剩 `formula-style.ts`、`speckit-rework-gate.ts`。
2. **Pi 侧当时新增**（`~/.pi/agent/extensions/`）：`formula-style.ts`（等价）、`manager-gemini-guard.ts`（尽力改写）、`speckit-rework-gate.ts`（等价，保留 Speckit 流程，未恢复 speckit-guide agent）。`manager-gemini-guard.ts` 及其测试此后已删除。
3. 上文“未迁移（有意）”条目更新：`plugins/` 当时三项已迁 Pi（`manager-gemini-guard` 的 manager 例外与抛错中断语义在 Pi 无对应物，降级为回滚+吞输入+取消 compaction，`PI_MANAGER_GEMINI_ALLOW=1` 转义；以上均为删除前记录）；`agents/`、`permissions V2`、`experimental.policies` 仍按原结论不迁。

## 自测（1 句话）
三套针对性测试 6/6、19/19、76/76 通过（其中 19/19 为已删除的 `manager-gemini-guard` 测试；Pi 侧后续加固至 413/413，见 `~/.pi/.opencode/handoff.md` Q 组：env 选项白名单 + 字面 `$` 区分；本仓其余插件与测试未动），真机 Pi 加载零错误且 7 工具可被模型调用、Gemini 4 被零花费拦截；命令与行为映射详情见 `~/.pi/.opencode/handoff.md`。

## 安全边界（Pi 侧最新，2026-10-25 L 组；本仓未动）
- Pi 侧 Bash 为显式白名单门禁（只读命令严格选项形态 + 已建模写命令放行，未知命令/选项（含 env 未知选项与缩写）、`find` 写动作、全参数位动态词（字面 `$` 除外）、非白名单环境赋值 fail-closed；sed/xargs/ln/cp 链接模式直接拒绝不建模；`sort -o`/`uniq` 输出/`less -o` 计入，`-` 仅无输出时允许，`test`/`[` 自由形）+ realpath/lstat symlink 双检 + cp/install 目录 join；**不声称为完整沙箱**，残留缺口（Copy-Item、`awk w`、sourced 脚本、未知包装器、`env -S` 等）见 Pi handoff；模型应优先用 edit/write 工具。
- 本仓 `plugins/` 三文件零改动（`git status -- plugins/` 无记录），加固仅在 Pi 移植侧。

# 配置指南

## models

可以使用第三方api或者opencode提供的官方模型套餐。

## OpenCode go

官方提供折扣套餐, 需要在官网购买plan后复制api; 在 TUI 中输入 `/connect` 命令，选择提供商。

## OpenCode Zen

同上, 但是奢侈模型.

## 第三方提供商

### 默认provider

`/model` 找到改模型提供商输入api即可.

### 自定义provider

比如 tencent tokenplan, 先在 jsonc 文件中配置好, 然后再 `/connect` 写入 api key.

### 本地模型 (Ollama)

```bash
# 确保 Ollama 已安装并运行
ollama serve

# 拉取模型
ollama pull qwen2.5-coder:7b

# 在 OpenCode TUI 中 /connect 选择 ollama
```

## 配置文件

### opencode 原生

Ref to [instructions](https://opencode.ai/v2/docs/instructions)

`opencode.jsonc` 和 `package.json` 是主要需要修改的文件。

```text
~/.config/opencode/
├── opencode.jsonc       # 全局运行配置（模型、权限、MCP、插件…）
├── AGENTS.md            # 全局自然语言规则
├── agents/              # 自定义 Agent（本仓库 7 个）
│   ├── commander.md     # 主控 Agent（默认）
│   ├── explorer.md / researcher.md / integrator.md / implementer.md / reviewer.md
│   │                    # 5 个专职子 Agent
│   └── speckit-guide.md # Spec Kit 流程 Agent
├── plugins/             # 本地插件
│   ├── commander-model-guard.ts   # gemini-4-argon-contributor 仅限 commander
│   └── speckit-rework-gate.ts     # Spec Kit 返工门禁
├── skills/              # 自定义 skill（SKILL.md + supporting files，本仓库 12 个）
├── sdd/                 # 规范驱动开发文档（COC / OpenSpec / GitHub Spec Kit）
├── launch-mode/         # 启动方式插件
└── docs/                # 本地手册（含 web/ 手机浏览器访问指南）
```

在项目中使用：

同上，但是在项目下.

### 兼容

Opencode 对于其他CIL产品的skills路径有兼容，包括:

```text
~/.agents/skills/
~/.claude/skills/
```

## 切换模型

在 TUI 中：

- 按 `Ctrl+T` 切换模型变体（要有才行，deepseek 这种需要手动配置 variant）。
- 使用 `/models` 命令查看和切换可用模型
- 单次运行时指定模型：`opencode run -m openai/gpt-4o "解释这个项目"`（顶层 `opencode` 启动 TUI 不带 `--model` 参数）

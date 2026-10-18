# Agent 系统

## 什么是 Agent？

Agent 是 OpenCode 中最核心的概念。一个 Agent 定义了：

- 🎭 **角色身份**：AI 扮演什么角色（架构师、代码审查员、测试工程师...）
- 📋 **行为规则**：AI 应该遵循的规范和约束
- 🛠️ **可用工具**：AI 可以使用的技能（Skills）和 MCP 工具
- 📝 **系统提示词**：定制化的初始指令

## 内置 Agent

OpenCode 自带几个预设 Agent：

### Build Agent（默认）

通用开发 Agent，能处理大多数编程任务。

```
Agent: Build
描述: 通用开发助手，可以创建、修改、删除文件
```

### Plan Agent

只读规划 Agent，用于分析和设计。

```
Agent: Plan
描述: 只读分析模式，不会修改任何文件
```

## 创建自定义 Agent

创建 `.opencode/agents/code-reviewer.md`：(推荐)

```markdown
---
description: Read-only project analyst for understanding project architecture and implementation
mode: subagent
model: deepseek/deepseek-v4-flash
request:
  body:
    temperature: 0.1
permissions:
  - action: edit
    resource: "*"
    effect: deny
---

You are a read-only project analyst.

Your purpose is to help the primary agent understand the current project before making changes.

Investigate:

- Project structure and purpose
- Important entry points
- Module responsibilities
- Control flow and data flow
- Configuration and dependencies
- Relevant tests and conventions
- Files related to the requested task
- Potential risks and uncertainties

Use repository evidence rather than assumptions.

Do not modify, create, delete, rename, or overwrite files.

Return:

1. Summary
2. Relevant files
3. Architecture and execution flow
4. Constraints and conventions
5. Risks and uncertainties
6. Recommended next steps
```

其中:

- **Mode: primary（新 Agent 默认）, subagent, all**

## 调用

### 手动调用

```text
@code-reviewer 审查当前未提交的代码改动
```

### 主 agent 自动调用

`opencode`：用 `Shift+Tab`（agent.cycle）切换主 Agent，或 `/agents` 查看列表。

## Agent 配置选项

| 配置项 | 类型 | 说明 |
| -------- | ------ | ------ |
| `description` | string | Agent 描述（Subagent 必写，主 Agent 靠它选人） |
| `mode` | string | `primary` / `subagent` / `all` |
| `model` | string | 指定模型（格式：provider/model，可加 `#variant`） |
| `permissions` | array | 有序权限规则 `{action, resource, effect}`，后匹配覆盖前匹配 |
| `steps` | number | 最大模型步数 |
| `color` | string | UI 颜色（6 位 hex） |
| `hidden` | boolean | 从列表中隐藏 |
| `disabled` | boolean | 禁用该 Agent |
| `request` | object | 按 Agent 覆盖请求头/JSON body（如 `request.body.temperature`） |

### 权限 action 列表

| action | 覆盖范围 |
| -------- | ------ |
| `shell` | shell 命令（V1 叫 `bash`） |
| `edit` | edit / write / patch 工具 |
| `subagent` | 子 Agent 调用（V1 叫 `task`） |
| `read`、`glob`、`grep` | 本地检索工具 |
| `webfetch`、`websearch` | 联网工具 |
| `skill` | skill 加载 |

## Agent vs Subagent

| 特性 | Agent | Subagent |
| ------ | ------- | ---------- |
| 定义位置 | `.opencode/agents/` 或全局 `agents/` | 同左（`mode: subagent`） |
| 触发方式 | 用户手动切换 | 主 Agent 自动调用，或用户 `@名称` 调用 |
| 使用场景 | 切换工作模式 | 分解复杂任务 |
| 独立性 | 独立会话上下文 | 独立子会话，全新上下文 |

## 最佳实践

1. 🎯 **一个 Agent 一个职责**：不要让一个 Agent 做太多事情
2. 📝 **写清楚正文（即 system prompt）**：越具体，AI 表现越好
3. 🔧 **合理限制工具**：只给 Agent 需要的工具，减少误操作风险
4. 🧪 **多 Agent 协作**：用 Subagent 拆分复杂任务
5. 📊 **迭代优化**：根据实际使用效果不断调整 prompt

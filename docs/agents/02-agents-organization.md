# 组织多个 Agent 的团队

单个 Agent 可以完成多数任务，但复杂项目可以使用多个专业 Agent 分工。

> **本仓库实际架构**：全局配置 `~/.config/opencode` 当前采用 **Manager 包工头小队（`manager`、`coder`、`env-ops`、`reviewer`）+ `speckit-guide`** 架构（详见 [Agent 系统](01-agents.md) 与 `~/.config/opencode/agents/`）。下文的 `tech-lead` / `frontend-specialist` 等示例均为**通用语法教学**，用于说明 primary / subagent 的组织方式，不代表本仓库现存文件。

OpenCode 的 Agent 分为两类：

* **Primary Agent**：用户主要交互的 Agent，可以分析需求、修改代码并调用 Subagent。
* **Subagent**：负责特定任务的专业 Agent，例如前端开发、后端开发、代码审查或测试。

```text
用户：“给项目添加用户认证系统”

          ┌──────────────┐
          │  Tech Lead   │  Primary Agent
          └──────┬───────┘
                 │ Task
       ┌─────────┼─────────┐
       ▼         ▼         ▼
  Frontend    Backend     Tests
  Subagent    Subagent   Subagent
```

## Primary Agent 与 Subagent

| 特性 | Primary Agent | Subagent |
| ------ | ------------- | ----------------------------- |
| `mode` | `primary` | `subagent` |
| 使用方式 | 用户直接选择和对话 | 主 Agent 自动调用，或用户通过 `@名称` 调用 |
| 主要用途 | 处理主任务、协调工作 | 完成专业子任务 |
| 上下文 | 主会话 | 独立的子会话 |
| 切换方式 | 使用 `Shift+Tab`（agent.cycle）切换 | 使用 `@agent-name` 或由主 Agent 调用 |

OpenCode 会根据 Subagent 的 `description` 判断什么时候适合调用它，不需要配置正则表达式形式的 `trigger`。

---

## 使用 Markdown 定义 Agent

项目级 Agent 放在：

```text
.opencode/agents/
```

全局 Agent 放在：

```text
~/.config/opencode/agents/
```

文件名就是 Agent 名称。例如：

```text
.opencode/agents/frontend-specialist.md
```

会创建名为 `frontend-specialist` 的 Agent。

### 主 Agent

创建：

```text
.opencode/agents/tech-lead.md
```

```markdown
---
description: 负责分析全栈需求、拆分任务并协调专业 Subagent
mode: primary
permissions:
  - action: edit
    resource: "*"
    effect: allow
  - action: shell
    resource: "*"
    effect: ask
  - action: subagent
    resource: "*"
    effect: deny
  - action: subagent
    resource: "frontend-specialist"
    effect: allow
  - action: subagent
    resource: "backend-specialist"
    effect: allow
  - action: subagent
    resource: "test-specialist"
    effect: allow
---

你是项目的技术负责人。

收到复杂开发需求后：

1. 分析需求和现有项目结构。
2. 将适合的工作委派给专业 Subagent。
3. 汇总各 Subagent 的结果。
4. 检查前后端接口和测试是否一致。
5. 最终向用户说明完成内容和遗留问题。

不要为了分工而分工。简单任务直接完成。
```

其中 `permissions` 里对 `subagent` action 的 allow 列表，用于限制这个主 Agent 可以调用哪些 Subagent。

### 前端 Subagent

创建：

```text
.opencode/agents/frontend-specialist.md
```

```markdown
---
description: 负责页面、组件、交互、样式和前端状态管理
mode: subagent
permissions:
  - action: edit
    resource: "*"
    effect: allow
  - action: shell
    resource: "*"
    effect: ask
  - action: subagent
    resource: "*"
    effect: deny
---

你是一名前端开发工程师。

使用项目已有的框架、组件库和样式规范完成前端任务。

修改前先检查现有目录结构和相似组件，不要重复实现已有功能。
```

### 后端 Subagent

创建：

```text
.opencode/agents/backend-specialist.md
```

```markdown
---
description: 负责 API、业务逻辑、认证、数据库访问和服务端代码
mode: subagent
permissions:
  - action: edit
    resource: "*"
    effect: allow
  - action: shell
    resource: "*"
    effect: ask
  - action: subagent
    resource: "*"
    effect: deny
---

你是一名后端开发工程师。

遵循项目已有的架构、接口规范和错误处理方式实现服务端功能。

注意参数校验、权限控制、异常处理和数据安全。
```

### 测试 Subagent

创建：

```text
.opencode/agents/test-specialist.md
```

```markdown
---
description: 负责单元测试、集成测试、边界条件和回归验证
mode: subagent
permissions:
  - action: edit
    resource: "*"
    effect: allow
  - action: shell
    resource: "*"
    effect: ask
  - action: subagent
    resource: "*"
    effect: deny
---

你是一名测试工程师。

分析新增或修改的功能，并编写必要的单元测试和集成测试。

重点检查正常流程、异常流程、边界条件和权限问题。
```

---

## 调用方式

主 Agent 可以根据各 Subagent 的 `description` 自动选择合适的 Agent。

用户也可以手动调用：

```text
@frontend-specialist 检查登录页面的表单和交互
```

```text
@backend-specialist 检查认证接口是否存在安全问题
```

Subagent 会在独立子会话中运行，避免将大量中间过程全部放进主会话。

---

## 协作流程

1. 用户向 Primary Agent 提出需求。
2. Primary Agent 分析任务。
3. Primary Agent 通过 `subagent` 工具调用合适的 Subagent。
4. Subagent 在独立子会话中完成工作并返回结果。
5. Primary Agent 检查和整合结果。
6. Primary Agent 向用户汇报最终结果。

本仓库中该流程对应为：用户向主会话提出需求，主会话直接处理或切到 `manager` 主控；由 `manager` 按偏科派单（环境→`env-ops`，编码→`coder`），完成后必经 `reviewer` 预审（PASS/FAIL），`manager` 只做 YES/NO 拍板，Spec Kit 相关流程由 `speckit-guide` 辅助。

---

## 最佳实践

* 使用清晰、具体的 `description`，帮助主 Agent正确选择 Subagent。
* 每个 Subagent 只负责一类相对明确的任务。
* 使用 `permissions` 限制文件修改、命令执行和 Subagent 调用权限。
* 不要创建职责高度重叠的 Agent。
* 简单任务由 Primary Agent 直接完成，不必强制拆分。
* 先配置一两个真正需要的 Subagent，再逐步扩展。

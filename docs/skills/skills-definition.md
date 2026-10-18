# Skills 技能

## 什么是 Skill？

Skill（技能）是 OpenCode 中的**可复用能力模块**。它像是给 Agent 装载的专业工具包，让 Agent 在需要时获得特定领域的知识和操作能力。

### Skill vs Agent

| 维度 | Agent | Skill |
| ------ | ------- | ------- |
| 定位 | 定义「谁来做」 | 定义「会做什么」 |
| 复用 | Agent 内使用 | 跨 Agent 复用 |
| 触发 | 用户手动选择 | Agent 按需加载 |
| 粒度 | 粗粒度（角色级） | 细粒度（能力级） |

## Skill 的结构

一个 Skill 是一个文件夹（推荐，可带 scripts/references 等 supporting files），或源根目录下的单个 `.md` 文件：

```
.opencode/skills/
└── git-release/
    ├── SKILL.md
    ├── scripts/
    └── references/
```

> OpenCode 也兼容脱离 `.opencode` 的路径：全局 `~/.claude/skills`、`~/.agents/skills`，项目级 `.claude/skills`、`.agents/skills`，以及 `opencode.jsonc` 里 `skills` 数组显式声明的目录/URL。

## 内置 Skills

Skill 全部来自已发现的来源（全局、项目、兼容路径、显式配置），没有写死的功能表。用 `/skills` 查看当前会话可见的列表。

## Skill 文件格式

### 文件名与 ID

Skill 的 ID 由**文件路径**决定，而不是 frontmatter 的 `name`：

| 文件 | ID |
| ------ | ------ |
| `<source>/git-release.md` | `git-release` |
| `<source>/git-release/SKILL.md` | `git-release` |

根目录单个 `.md` 必须直接放在源根目录；`SKILL.md` 必须精确叫这个名字，可在任意深度。目录名建议用小写 kebab-case 并与 ID 保持一致。

### 有效字段（frontmatter）

```text
name                          # 展示名，默认取路径 ID
description                   # 模型靠它决定是否加载；没有则不主动推荐
metadata.opencode/autoinvoke  # 设为 false 则不对模型列出（仍可显式加载）
disable-model-invocation      # 设为 true 同上（与前者冲突时前者赢）
license / compatibility       # V2 接受但不解读，仅为可携带
```

`description` 是触发的关键：每步模型只能看到 ID + name + description，再调 `skill` 工具加载全文。

### case

````markdown
---
name: git_workflow
description: 规范化 Git 工作流程。用于提交代码、创建或切换分支、生成 Conventional Commit、执行 merge 或 rebase，以及准备推送和 Pull Request。
---

# Git Workflow Skill

## 分支命名规范

- `feat/` — 新功能
- `fix/` — Bug 修复
- `refactor/` — 重构
- `docs/` — 文档

## Commit 规范

使用 Conventional Commits 格式：

```
<type>(<scope>): <description>

[optional body]
```

类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档
- `style`: 格式调整
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

## 操作流程

### 开始新功能
1. 从 main 创建分支：`git checkout -b feat/xxx`
2. 开发完成后运行测试
3. 提交代码
4. 推送并创建 PR

### 提交代码
1. `git add <files>`
2. `git commit -m "feat(scope): description"`
3. `git push origin feat/xxx`
````

## Skill 的触发机制

Agent 靠以下条件判断是否加载 Skill（V2 没有 `triggers` 字段）：

1. **描述相关性**：`description` 写清用户意图、任务边界和易混淆的相邻任务，模型按此决定
2. **显式调用**：用户在输入中 `@skill-id` 提及，或明确要求使用某个 Skill
3. **权限放行**：所选 Agent 的 `skill` action 规则允许（`allow` 直接加载，`ask` 先确认，`deny` 直接隐藏）

```
# 显式调用 Skill
使用 API Design skill 帮我设计用户管理接口
```

## 管理 Skills

### 查看可用 Skills

```
/skills
```

### 手动加载

在输入框 `@skill-id` 提及即可；模型侧通过 `skill` 工具按精确 ID 加载。

### 按 Agent 控制

```jsonc
{
  "permissions": [
    { "action": "skill", "resource": "*", "effect": "allow" },
    { "action": "skill", "resource": "experimental-*", "effect": "ask" }
  ]
}
```

同规则可放在 `agents.<id>.permissions` 下只约束单个 Agent。

## 最佳实践

1. 📦 **保持 Skill 单一职责**：一个 Skill 只做一件事
2. 🏷️ **写好 description**：讲清用户意图、任务边界和易混淆但不应触发的相邻任务，这是唯一的"触发器"
3. 📚 **提供示例**：好的示例比长篇说明更有效
4. 🔄 **持续迭代**：根据使用反馈优化 Skill 内容
5. 🗂️ **版本管理**：将 Skills 纳入 Git，团队共享

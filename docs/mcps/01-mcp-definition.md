# MCP 协议

## 什么是 MCP？

**MCP（Model Context Protocol）** 是一种开放协议，用于统一 AI 应用与外部工具、数据源和服务之间的交互方式。

它解决的是“AI 如何发现和调用外部能力”的问题。具体功能仍然由 MCP Server 对接真实的数据库、文件系统或第三方 API。

```text
┌──────────────┐       MCP        ┌──────────────┐
│ OpenCode     │ ◄──────────────► │ MCP Server   │
│ MCP Host     │                  │ 工具适配服务   │
└──────────────┘                  └──────┬───────┘
                                        ▼
                              API / 数据库 / 文件系统
```

---

## 核心概念

### Host

用户实际使用的 AI 应用，例如 OpenCode、IDE 或 Agent 平台。

Host 负责：

* 管理模型会话
* 连接 MCP Server
* 控制工具权限
* 将工具结果提供给模型

### Client

Host 内部用于连接某个 MCP Server 的协议组件。

它负责：

* 初始化连接
* 获取工具列表
* 发送调用请求
* 接收执行结果

### Server

实现 MCP 协议并提供具体能力的程序，例如：

* 文件操作
* 数据库查询
* GitHub 操作
* 浏览器自动化
* 第三方 API 调用

---

## MCP 的主要能力

### Tools

模型可以调用的工具，例如：

* `read_file`
* `create_issue`
* `query_database`
* `navigate_page`

### Resources

提供给模型读取的上下文数据，例如文件、日志、数据库结构。

### Prompts

Server 提供的可复用提示模板，例如代码审查或故障排查模板。

---

## 在 OpenCode 中配置 MCP

OpenCode 的全局配置文件：

```text
~/.config/opencode/opencode.jsonc
```

项目级配置文件（V2 依次合并直接配置文件与 `.opencode/` 内配置文件）：

```text
项目根目录/opencode.jsonc
项目根目录/.opencode/opencode.jsonc
```

### 本地 MCP Server

例如opencode原生就有的编辑和读取功能.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "filesystem": {
        "type": "local",
        "command": [
          "npx",
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/home/user/projects"
        ]
      }
    }
  }
}
```

注意（V2）：

* Server 名一律放在 `mcp.servers` 下面，不直接挂在 `mcp` 下
* `command` 使用数组
* 没有 `enabled` 字段：配好即自动连接；想配而不连用 `"disabled": true`
* 当前官方包名通常是 `@modelcontextprotocol/*`，不是旧的 `@anthropic/mcp-server-*`

### 远程 MCP Server

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "company-api": {
        "type": "remote",
        "url": "https://mcp.example.com/mcp",
        "oauth": false,
        "headers": {
          "Authorization": "Bearer {env:MCP_TOKEN}"
        }
      }
    }
  }
}
```

远端默认走 OAuth；只有纯 API key / header 鉴权时才设 `"oauth": false`。密钥一律用 `{env:NAME}` 引用环境变量，不要写进文件。

常用命令：

```bash
opencode mcp list                 # 看连接状态
opencode mcp auth server-name     # OAuth 登录（远端需鉴权时）
opencode mcp logout server-name   # 清掉存的 OAuth 凭证
```

### 在 Agent 中控制 MCP 权限

OpenCode Agent 建议使用 Markdown 文件：

```text
.opencode/agents/fullstack-dev.md
```

示例：

```markdown
---
description: 全栈开发 Agent
mode: primary
permissions:
  - action: edit
    resource: "*"
    effect: allow
  - action: shell
    resource: "*"
    effect: ask
  - action: filesystem_*
    resource: "*"
    effect: allow
  - action: github_*
    resource: "*"
    effect: ask
---

你是一名全栈开发 Agent。

修改代码前先阅读相关文件。
涉及远程仓库修改、命令执行或其他有副作用的操作时，先请求确认。
```

权限可设置为：

* `allow`
* `ask`
* `deny`

---

### 在对话中使用 MCP

可以让 Agent 自动选择工具：

```text
帮我查看 users 表的结构。
```

也可以明确指定：

```text
使用 GitHub MCP，列出当前仓库未合并的 Pull Request。
只读取，不要修改仓库。
```

```text
使用 filesystem MCP，读取当前项目的 package.json，
分析依赖是否存在明显问题。
```

## 最佳实践

1. 只开放必要的工具和目录。
2. 默认使用只读权限。
3. 写文件、发送消息、修改仓库等操作应要求确认。
4. Token 使用环境变量，不要直接写入配置。
5. 对输入参数、文件路径和 SQL 做严格校验。
6. 不要同时启用过多 MCP Server，以免占用上下文。
7. 本地 Server 使用 stdio，远程 Server 使用 Streamable HTTP。
8. MCP Server 只负责提供工具，真正的权限控制仍需由 Host 和服务端共同完成。

# usage

## 斜杠命令

| 命令 | 功能 |
| ------ | ------ |
| `/help` | 显示帮助 |
| `/connect` | 配置 LLM 提供商 |
| `/models` | 查看/切换模型（含变体） |
| `/agents` | 查看/切换 Agent |
| `/sessions` | 查看/切换会话 |
| `/new` | 新建会话 |
| `/timeline` | 查看会话时间线 |
| `/compact` | 压缩会话上下文 |
| `/undo` | 撤销上一个操作 |
| `/redo` | 重做被撤销的操作 |
| `/fork` | 从当前会话分叉 |
| `/clear` | 清空对话历史（同 `/new`） |
| `/stats` | 查看使用统计/花费 |
| `/export` | 导出对话记录 |
| `/exit` | 退出 OpenCode |

## @命令

@file 引用文件
@agent-name 指定 Subagent（如 `@frontend-specialist`），在独立子会话中执行

## 快捷键

重复的就不写了, 不需要那么多.

| 快捷键 | 功能 |
| -------- | ------ |
| `Shift+Tab` | 切换主 Agent（agent.cycle） |
| `Ctrl+T` | 切换模型变体（variant.cycle） |
| `Esc` | 取消 / 返回 |
| `Ctrl + D` | 退出 |

## 其他功能

### Fork 会话

从当前会话的某个节点分叉出一个新会话（保留历史上下文，独立发展）。TUI 里直接用 `/fork`；要绑快捷键则写全局 `cli.json`（V2 按键绑定只认 `cli.json`，未知 ID 会被拒绝）：

```json
{
  "keybinds": {
    "session.fork": "<leader>f"
  }
}
```

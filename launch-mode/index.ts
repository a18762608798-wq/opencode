import type { Plugin } from "@opencode/plugin"

export default {
  id: "launch-mode",
  async setup(ctx) {
    // V2 插件运行在共享后台服务进程中，无法按 argv 区分 TUI / 桌面端 / 浏览器会话
    // 数学公式规则对所有模式统一注入（回复用 LaTeX 原生格式，写入 Markdown 文件用 $ 格式）；
    // mode 仅用于标注会话界面，可在 opencode.jsonc 中以对象形式传参：
    // { "package": ..., "options": { "mode": "web" | "desktop" } }。
    const raw = ctx.options.mode
    const mode = raw === "web" || raw === "desktop" ? raw : "tui"

    const label =
      mode === "web"
        ? "opencode web（浏览器界面）"
        : mode === "desktop"
          ? "opencode desktop（桌面端）"
          : "opencode TUI/ACP（终端或编辑器）"

    // 数学公式规则对所有模式统一：回复用 LaTeX 原生格式，写入 Markdown 文件用 $ 格式。
    const rule =
      "对话回复中数学公式必须使用 LaTeX 原生格式：行内 \\(...\\)；独立成段时 $$ 单独成行、公式内容单独成行、$$ 单独成行（三者各占一行，勿写成一行）。不要使用单个 $ 行内格式。写入 Markdown 文件时，数学公式必须使用行内 $...$（两端有空格），独立成段 $$...$$（$$ 单独成行）。"

    const text = `对话启动方式（launch-mode 插件注入，权威）：${label}。${rule}`

    // V2 session "context" hook（SystemPart 对象数组）。
    await ctx.session.hook("context", (event) => {
      event.system.push({ type: "text", text })
    })
  },
} satisfies Plugin.Plugin

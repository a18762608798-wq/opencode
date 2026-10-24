import type { Plugin } from "@opencode/plugin"

export default {
  id: "launch-mode",
  async setup(ctx) {
    // V2 插件运行在共享后台服务进程中，无法按 argv 区分 TUI / 桌面端 / 浏览器会话
    // 数学公式规则对所有模式统一注入（含对话回复与写入 Markdown 文件，统一使用 $ / $$ 格式）；
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

    // 数学公式规则对所有模式统一：含对话回复与写入 Markdown 文件，统一使用 $ / $$ 格式。
    const rule =
      "数学公式（含对话回复与写入 Markdown 文件）必须统一使用 LaTeX $ 格式，禁止用纯文本或 Unicode 字符代替公式：行内公式使用 $...$，正确如这是 $E=mc^2$ 公式（$与外侧文字间保留空格、与内侧公式内容间不加空格，$ E=mc^2 $ 为错误写法）；独立成段公式使用 $$...$$（开头 $$、公式内容、结尾 $$ 各自单独成行）。禁止使用 \\(...\\) 或 \\[...\\] 格式。"

    const text = `对话启动方式（launch-mode 插件注入，权威）：${label}。${rule}`

    // V2 session "context" hook（SystemPart 对象数组）。
    await ctx.session.hook("context", (event) => {
      event.system.push({ type: "text", text })
    })
  },
} satisfies Plugin.Plugin

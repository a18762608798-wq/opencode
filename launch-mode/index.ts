import type { Plugin } from "@opencode/plugin"

export default {
  id: "launch-mode",
  async setup(ctx) {
    // 数学公式规则统一注入（含对话回复与写入 Markdown 文件，统一使用 $ / $$ 格式）。
    const text =
      "数学公式（含对话回复与写入 Markdown 文件）必须统一使用 LaTeX $ 格式，禁止用纯文本或 Unicode 字符代替公式：行内公式使用 $...$，正确如这是 $E=mc^2$ 公式（$与外侧文字间保留空格、与内侧公式内容间不加空格，$ E=mc^2 $ 为错误写法）；独立成段公式使用 $$...$$（开头 $$、公式内容、结尾 $$ 各自单独成行）。禁止使用 \\(...\\) 或 \\[...\\] 格式。"

    // V2 session "context" hook（SystemPart 对象数组）。
    await ctx.session.hook("context", (event) => {
      event.system.push({ type: "text", text })
    })
  },
} satisfies Plugin.Plugin

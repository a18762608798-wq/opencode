import { Plugin } from "@opencode/plugin"

// manager-gemini-guard：只有 manager agent 能用 Gemini 4 系模型。
// 非 manager 会话（coder / env-ops / reviewer / build / plan 等）
// 一旦走 Gemini 4（gemini-4 / argon）直接抛错中断本次模型调用。
const GEMINI4_RE = /gemini.*4|argon/i

function isGemini4(model: { id?: string } | undefined): boolean {
  if (!model?.id) return false
  return GEMINI4_RE.test(model.id)
}

function guard(agent: string | undefined, model: { id?: string } | undefined): void {
  if (agent === "manager") return
  if (isGemini4(model)) {
    throw new Error(
      `[manager-gemini-guard] agent '${agent ?? "unknown"}' 禁止使用 Gemini 4 模型 '${model?.id}'. Gemini 4 只允许 manager 主控使用，请切回本 agent 的专用模型。`,
    )
  }
}

export default Plugin.define({
  id: "manager-gemini-guard",
  async setup(ctx) {
    // 主循环与辅助请求：context / compaction / generate 都带 agent，可直接判。
    await ctx.session.hook("context", (event) => {
      guard(event.agent, event.model)
    })
    await ctx.session.hook("compaction", (event) => {
      guard(event.agent, event.model)
    })
    await ctx.session.hook("generate", (event) => {
      guard(event.agent, event.model)
    })
    // title 请求无 agent 字段：title 本就该用便宜模型，Gemini 一律拦。
    await ctx.session.hook("title", (event) => {
      if (isGemini4(event.model)) {
        throw new Error(
          `[manager-gemini-guard] title 生成禁止使用 Gemini 4 模型 '${event.model.id}'.`,
        )
      }
    })
    // 兜底：覆盖所有 kind（primary / compaction / title / generate）的实际发包点。
    await ctx.session.hook("model.request", (event) => {
      guard(event.agent, event.model)
    })
  },
})

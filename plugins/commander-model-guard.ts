import type { Plugin } from "@opencode/plugin"

// commander-model-guard：gemini-4-argon-contributor 仅允许 commander agent 使用。
// 多层拦截：subagent 工具派生子会话前置检查 + session 各请求钩子，命中即抛错；
// retry 钩子关闭重试，防止被拦截后无意义重试。

const ALLOWED_AGENT = "commander"
const GUARDED_MODEL_FRAGMENT = "gemini-4-argon-contributor"

function isGuardedModel(modelID: string | undefined): boolean {
  return typeof modelID === "string" && modelID.toLowerCase().includes(GUARDED_MODEL_FRAGMENT)
}

function createGuardError(agent: string | undefined, modelRef: string): Error {
  return new Error(
    `[commander-model-guard] 已阻拦模型调用：模型 "${modelRef}" 仅允许在 "${ALLOWED_AGENT}" agent 下使用（当前 agent: "${agent ?? "unknown"}"）。请切换到 commander agent，或改用其他模型（如 muse-spark-1.3-contributor#xhigh / mimo-v2.6-pro）。`
  )
}

export default {
  id: "commander-model-guard",
  async setup(ctx) {
    // 第一层：subagent 工具调用前拦截，避免创建注定被拦的子会话
    await ctx.tool.hook("execute.before", (event) => {
      if (event.tool !== "subagent") return
      const input = event.input as Record<string, unknown> | undefined
      const model = input?.model
      if (typeof model !== "string" || !isGuardedModel(model)) return
      const targetAgent = typeof input?.agent === "string" ? input.agent : undefined
      if (targetAgent === ALLOWED_AGENT) return
      throw createGuardError(targetAgent, model)
    })

    // 第二层：会话上下文组装时拦截
    await ctx.session.hook("context", (event) => {
      if (!isGuardedModel(event.model.id) || event.agent === ALLOWED_AGENT) return
      throw createGuardError(event.agent, `${event.model.providerID}/${event.model.id}`)
    })

    // 第三层：生成前拦截
    await ctx.session.hook("generate", (event) => {
      if (!isGuardedModel(event.model.id) || event.agent === ALLOWED_AGENT) return
      throw createGuardError(event.agent, `${event.model.providerID}/${event.model.id}`)
    })

    // 第四层：模型请求构造时拦截
    await ctx.session.hook("model.request", (event) => {
      if (!isGuardedModel(event.model.id) || event.agent === ALLOWED_AGENT) return
      throw createGuardError(event.agent, `${event.model.providerID}/${event.model.id}`)
    })

    // 第五层：HTTP 请求发出前拦截
    await ctx.session.hook("http.request", (event) => {
      if (!isGuardedModel(event.model.id) || event.agent === ALLOWED_AGENT) return
      throw createGuardError(event.agent, `${event.model.providerID}/${event.model.id}`)
    })

    // 被拦截后禁止无意义重试
    await ctx.session.hook("retry", (event) => {
      if (isGuardedModel(event.model.id) && event.agent !== ALLOWED_AGENT) {
        event.decision = { retry: false }
      }
    })
  },
} satisfies Plugin.Plugin

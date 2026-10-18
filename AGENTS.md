# 全局工作规则

## 语言

* 默认使用中文进行分析、说明和回答。
* 代码、命令、变量名、函数名、库名和专业术语可保留英文。
* 除非用户明确要求，不要切换为其他语言。
* 表达应准确、直接、有条理，避免空泛描述和不必要的重复。

## 修改原则

* 修改前先理解现有代码和上下文。
* 只修改完成当前任务所必需的内容。
* 不进行未经请求的大范围重构。
* 不随意改变已有接口、行为、文件结构或代码风格。
* 尽量保持修改规模小、边界清晰、便于审查。
* 不要用整文件覆盖代替小范围修改，除非确有必要。
* 修改后检查实际 diff，确认没有意外改动。
* 不要声称修改、测试或验证已经完成，除非实际执行过相应操作。

## Spec Kit 返工门禁

* 普通修改已有 Spec Kit feature 时，先使用 `speckit_rework_list_features` 确认目标 feature；插件事务要求选择 feature 时再调用 `speckit_rework_select_feature`。
* 在修改实现代码前，必须调用 `speckit_rework_assess_impact` 检查 `spec`、`plan`、`tasks`、`checklists` 的影响，并解释未受影响层级的理由。
* 只 gate 实际受影响层级及其下游依赖，按 `spec -> plan -> tasks -> checklists` 顺序处理；若上游未受影响，完成影响评估后可直接实现，不要为形式跑完整流程。
* 实现过程中若发现遗漏的上游影响，先停下代码修改，重新进行影响评估并通过相应 gate。

## SDD 与 GitHub Spec Kit 目录 (`sdd/`)

`~/.config/opencode/sdd/` 存放规范驱动开发（Spec-Driven Development, SDD）文档：`change-oriented-computing/`（COC 理论总纲 `README.md` 与人机认知协作闭环 `cognitive-loop.md`）、`openspec/`（OpenSpec CLI 文档）和 `specify/`（GitHub Spec Kit）。

* `sdd/specify/` 是本地 GitHub Spec Kit 工作流文档与自定义 Preset 的权威源（Canonical Source），配合全局 `agents/speckit-guide.md` 与 `plugins/speckit-rework-gate.ts` 使用。
* 关键构成：
  * 基础用法文档：`install.md`、`config.md`、`usage/`（标准流程与 Preset/Template/Command 定制）。
  * 两个核心开发 Preset：
    * `sdd/specify/dev/scientific-computing`（priority 3）：科学计算实验工作流 Preset，分离理论、实验契约与代码实现。
    * `sdd/specify/dev/scientific-paper`（priority 4）：学术论文写作与审稿闭环 Preset，绑定实验数据 `D##`，含 `paper-*` 系列 skills。
* 在目标项目中挂载或更新 Preset 时，统一使用路径 `~/.config/opencode/sdd/specify/dev/<preset-id>`；原 `~/sync/computer/code/agent/...` 路径已废弃。

## 技能调用

* 需要找论文、补参考文献、给任务配文献时，使用 `zotero-paper-hunter` skill（websearch 发现候选，arXiv/出版商页核实元数据，全经 Zotero MCP 去重入库到主题 `paper/inbox`；`arxiv-search` 已因直调 arXiv API 不可用而删除，不再使用）。
* 需要找书、教材、讲义入库时，使用 `zotero-book-hunter` skill（先查 ISBN 再入库）。
* 只在库内检索已有文献时，用 Zotero 语义搜索，不走 hunter。

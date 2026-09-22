# 资料时效与课程版本

课程 v1，资料核对日期 2026-09-22。具体页面可能继续更新；“核对过文档”不等于“已运行其所有 API”。

## 教学重心

现代模型驱动的 Agent 循环，以及支撑它运行的上下文、工具、记忆、权限、评估和持久状态。固定 workflow 只用于讨论确定性程序与模型决策的边界，不作为课程主线；基础知识按其工程价值保留。

## 新资料与适用边界

| 资料/机制 | 本次证据 | 怎么使用 |
| --- | --- | --- |
| [OpenAI Harness engineering](https://openai.com/index/harness-engineering/) | 2026-02-11 官方工程案例 | 学环境可读性、约束与反馈；单个团队案例不等于普遍效率保证 |
| [Anthropic Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps) | 2026-03-24 官方工程案例 | 学分工、外部验收、长期任务；不机械复制角色数量 |
| [Anthropic Managed Agents](https://www.anthropic.com/engineering/managed-agents) | 2026-04-08 架构文章 | 学 session、harness、sandbox 职责分离；供应商实现不是协议 |
| [OpenAI Agents API](https://openai.com/index/introducing-the-agents-api/) | 2026-09-10 发布，public beta | 仅作托管运行时现状对照，代码接入以实际账号/SDK/地区可用性另行验证 |
| [MCP 官方架构](https://modelcontextprotocol.io/docs/learn/architecture) | 本次重定向到 2026-07-28 文档 | 版本敏感；新旧会话/发现机制不可混用，按服务端与客户端支持版本检查 |
| [Agent Skills 规范](https://agentskills.io/specification) | 本次读取当前开放规范 | 学元数据、按需加载和资源包；执行权限仍由宿主控制 |
| [AI SDK 当前文档](https://ai-sdk.dev/docs/agents/overview) | 读取 .md 正文并核对相关课文 API | SDK 抽象是版本敏感的；运行时上下文与模型可见上下文要分开 |

## 证据分层

- 已运行：`labs/` 的离线参考实现、相应行为测试与类型检查；具体结果见 VALIDATION.md。
- 已查阅：课文引用的官方文档、工程文章和开放规范。
- 尚未运行：真实模型 API、远程 MCP、托管运行时、浏览器操作 Agent、综合项目部署。课文明确将这些代码标作片段/示意或待学习者实作。
- 实验设计：课内故障场景、迁移题和综合项目评分标准是教师设计，不是供应商性能承诺。

## 之后如何更新

在真正运行某个 SDK 练习前，核对该版本的官方文档、锁定包版本并保留最小示例。只在有新证据时修改技术结论，记录变更原因；不以“更新”或“更多 Agent”本身作为改进依据。

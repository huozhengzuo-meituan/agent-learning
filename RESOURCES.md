# Agent 应用工程 Resources

检索核对日期：2026-09-22。按需阅读，不需要先通读全部资料。框架 API 与版本在对应代码练习前重新核对；不同作者对 Agent 的定义可能不同，课程会明确采用的工作定义。

## Knowledge

- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
  用于第一课的工作流/Agent 区分及架构取舍。文章首发于 2024-12-19，页面也提醒工具生态已变化；使用其概念讨论，不将旧工具列表视为当前选型结论。
- [Vercel AI SDK — Agents overview](https://ai-sdk.dev/docs/agents/overview)
  用于 TypeScript 的模型、工具、循环与运行时职责；后续比较手写循环和框架实现。已读取官方 [Markdown 版本](https://ai-sdk.dev/docs/agents/overview.md)；进入实作时再核对安装版本。
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  用于消息历史、工具返回内容、动态检索与上下文选择。不把上下文长度等同于有效信息量。
- [LangChain — Retrieval（TypeScript）](https://docs.langchain.com/oss/javascript/deepagents/retrieval)
  用于理解检索与生成的组合，并比较固定检索流程与 Agent 自主检索。先学习检索问题本身，再选择具体存储与框架。
- [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
  用于任务、试验、评分器、执行轨迹与最终结果的区分，以及建立回归评估。首个可运行练习即保留小样本，之后逐步扩展。
- [LangGraph — Overview（TypeScript）](https://docs.langchain.com/oss/javascript/langgraph/overview)
  用于后期的状态编排、持久执行与人工介入。完成基础工具循环之后再按项目需要引入。
- [Model Context Protocol — Architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)
  用于区分 Host、Client、Server 与协议职责。协议负责上下文交换，应用仍需负责控制流程与使用策略；具体协议版本在实作时核对。

### 前沿工程与开放规范

- [OpenAI — Harness engineering](https://openai.com/index/harness-engineering/)
  2026-02-11 的一手工程案例。用于讨论环境可读性、可执行约束和反馈闭环；不将个案效率估计外推到所有项目。
- [Anthropic — Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
  2026-03-24 的长任务与外部验收案例。用于第 0031–0033 课，重点是任务边界和验证机制。
- [Anthropic — Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents)
  2026-04-08 的系统架构文章。用于 session、harness、sandbox 分离与故障恢复。
- [Anthropic — Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
  用于按需发现工具、在执行环境处理数据及代码式工具组合；收益需在自身任务上测量。
- [Agent Skills — Specification](https://agentskills.io/specification)
  开放格式的一手规范。用于 Skill 元数据、渐进加载与资源组织，区分格式和宿主权限。
- [Node.js — TypeScript](https://nodejs.org/api/typescript.html)
  用于离线实验的运行条件：原生类型擦除与编译检查的区别，不依赖旧教程的运行标志。

### 产品状态核对（不是性能或通用架构依据）

- [OpenAI — Introducing the Agents API](https://openai.com/index/introducing-the-agents-api/)
  2026-09-10 的发布信息，仅用于确认托管 Codex Harness API 的 public beta 状态。教学原理主要来自工程文档；不采用客户宣传数字作为结论。

## Wisdom (Communities)

- [LangChain 官方论坛](https://forum.langchain.com/)
  用于查找真实的框架问题、最小复现和设计讨论。等有具体实践问题后再尝试交流；帖子是经验线索，技术结论需结合版本、源码和实验验证。是否参与社区由学习者选择。

## Gaps

- 课程给出了具体调用示例和官方阅读入口；学习者实际可用的提供商、账号与预算仍需在真实调用时确定，不默认拥有访问权限。
- 高级课已引用安全与运行资料；具体生产部署平台仍未选择，实施时需核对该平台的权限、密钥管理和保留策略。
- 后续如需要岗位能力对照，再结合学习者目标岗位的实际描述调整；当前不假设具体岗位要求。

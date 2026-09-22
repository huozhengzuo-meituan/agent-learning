import { parseSearchArgs, retrieve, runAgent, type Doc, type Model } from './reference.ts';
const docs: Doc[] = [{ id: 'button-v2', tenantId: 'demo', text: 'Button: disabled blocks activation; loading indicates a pending action.' }];
// Scripted stand-in: this is NOT an LLM or evidence of real model quality.
const scriptedModel: Model = async events => events.at(-1)?.type === 'result'
  ? { kind: 'final', text: `模拟模型收到工具结果：${JSON.stringify(events.at(-1))}` }
  : { kind: 'tool', name: 'searchDocs', input: { query: 'button disabled', limit: 2 } };
const result = await runAgent('Button disabled 有什么作用？', scriptedModel, {
  searchDocs: async raw => { const args = parseSearchArgs(raw); return retrieve(docs, args.query, 'demo', args.limit); },
}, { maxSteps: 4, maxToolCalls: 2 });
console.log(JSON.stringify(result, null, 2));

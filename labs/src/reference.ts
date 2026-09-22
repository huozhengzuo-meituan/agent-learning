// Teaching code: no network, model API, file writes or provider SDK.
export function parseSearchArgs(raw: unknown): { query: string; limit: number } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) throw new Error('invalid_arguments');
  const x = raw as Record<string, unknown>;
  if (Object.keys(x).some(k => !['query', 'limit'].includes(k))) throw new Error('unknown_field');
  if (typeof x.query !== 'string' || !x.query.trim() || x.query.trim().length > 100) throw new Error('invalid_query');
  const limit = x.limit === undefined ? 3 : x.limit;
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > 5) throw new Error('invalid_limit');
  return { query: x.query.trim(), limit };
}
export type Decision = { kind: 'final'; text: string } | { kind: 'tool'; name: string; input: unknown };
export type Event = { type: 'user'; text: string } | { type: 'decision'; value: Decision } | { type: 'result'; name: string; value: unknown };
export type Model = (events: readonly Event[], signal?: AbortSignal) => Promise<unknown>;
export type Tool = (input: unknown, signal?: AbortSignal) => Promise<unknown>;
export type RunOptions = { maxSteps: number; maxToolCalls: number; signal?: AbortSignal };
export type Outcome = { status: 'final' | 'step_limit' | 'tool_limit'; text?: string; modelCalls: number; toolCalls: number; events: Event[] };
function parseDecision(raw: unknown): Decision {
  if (typeof raw !== 'object' || raw === null) throw new Error('invalid_decision');
  const x = raw as Record<string, unknown>;
  if (x.kind === 'final' && typeof x.text === 'string' && x.text.trim()) return { kind: 'final', text: x.text };
  if (x.kind === 'tool' && typeof x.name === 'string' && x.name.trim() && 'input' in x) return { kind: 'tool', name: x.name, input: x.input };
  throw new Error('invalid_decision');
}
// One call per step for teaching. Real adapters preserve provider call IDs,
// all content blocks and multi-call semantics. Abortion is cooperative.
export async function runAgent(prompt: string, model: Model, tools: Record<string, Tool>, options: RunOptions): Promise<Outcome> {
  if (!Number.isInteger(options.maxSteps) || options.maxSteps < 1 || !Number.isInteger(options.maxToolCalls) || options.maxToolCalls < 0) throw new Error('invalid_budget');
  const events: Event[] = [{ type: 'user', text: prompt }];
  let modelCalls = 0, toolCalls = 0;
  const outcome = (status: Outcome['status'], text?: string): Outcome => ({ status, ...(text === undefined ? {} : { text }), modelCalls, toolCalls, events });
  for (let step = 0; step < options.maxSteps; step++) {
    options.signal?.throwIfAborted();
    modelCalls++;
    const next = parseDecision(await model(structuredClone(events), options.signal));
    options.signal?.throwIfAborted();
    events.push({ type: 'decision', value: next });
    if (next.kind === 'final') return outcome('final', next.text);
    if (toolCalls >= options.maxToolCalls) return outcome('tool_limit');
    toolCalls++; // Count invalid-name attempts too, to bound probing.
    let value: unknown;
    if (!Object.hasOwn(tools, next.name)) value = { error: 'unknown_tool' };
    else {
      try { value = await tools[next.name](next.input, options.signal); }
      catch { options.signal?.throwIfAborted(); value = { error: 'tool_failed' }; }
    }
    options.signal?.throwIfAborted();
    events.push({ type: 'result', name: next.name, value });
  }
  return outcome('step_limit');
}
export type Doc = { id: string; tenantId: string; text: string };
export function retrieve(docs: readonly Doc[], query: string, tenantId: string, k = 3): Doc[] {
  if (!Number.isInteger(k) || k < 1) throw new Error('invalid_k');
  const terms = [...new Set(query.toLowerCase().trim().split(/\s+/u).filter(Boolean))];
  if (!terms.length) return [];
  return docs.filter(d => d.tenantId === tenantId)
    .map(doc => ({ doc, score: terms.filter(t => doc.text.toLowerCase().includes(t)).length }))
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.doc.id.localeCompare(b.doc.id))
    .slice(0, k).map(x => ({ ...x.doc }));
}
export type Ticket = { id: string; tenantId: string; title: string };
export type Operation = { actorId: string; tenantId: string; title: string; approved: boolean; receipt?: Ticket };
// Trusted server-owned store and authenticated identity; model cannot set them.
// Synchronous, in-memory example, not a distributed idempotency implementation.
export function executeApprovedWrite(store: Map<string, Operation>, id: string, actor: string, tenant: string): Ticket {
  const op = store.get(id);
  if (!op || op.actorId !== actor || op.tenantId !== tenant) throw new Error('forbidden');
  if (!op.approved) throw new Error('approval_required');
  if (op.receipt) return { ...op.receipt };
  const receipt = { id: `ticket:${id}`, tenantId: tenant, title: op.title };
  store.set(id, { ...op, receipt });
  return { ...receipt };
}
export type UIState = { runId: string; sequence: number; status: 'running' | 'done' | 'cancelled' | 'failed'; text: string };
export type UIEvent = { runId: string; sequence: number; type: 'delta' | 'done' | 'cancelled' | 'failed'; text?: string };
// Ordered stream only: a gap must be surfaced for resync, not silently ignored.
export function reduceUI(state: UIState, event: UIEvent): UIState {
  if (state.runId !== event.runId || state.status !== 'running' || event.sequence <= state.sequence) return state;
  if (!Number.isInteger(event.sequence) || event.sequence !== state.sequence + 1) throw new Error('sequence_gap');
  if (event.type === 'delta') {
    if (typeof event.text !== 'string') throw new Error('invalid_delta');
    return { ...state, sequence: event.sequence, text: state.text + event.text };
  }
  return { ...state, sequence: event.sequence, status: event.type };
}
export type Evaluation = { requiredDocIds: string[]; forbiddenTools: string[]; actual: { status: string; citedDocIds: string[]; calledTools: string[] } };
// Structural checks do not establish semantic truth or citation support.
export function grade(x: Evaluation): { pass: boolean; failures: string[] } {
  const failures: string[] = [];
  if (x.actual.status !== 'final') failures.push('not_completed');
  if (!x.requiredDocIds.every(id => x.actual.citedDocIds.includes(id))) failures.push('missing_citation');
  if (x.forbiddenTools.some(tool => x.actual.calledTools.includes(tool))) failures.push('forbidden_tool');
  return { pass: failures.length === 0, failures };
}

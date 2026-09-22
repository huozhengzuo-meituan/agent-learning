// Fill each function without importing a reference implementation.
import type { Doc, Evaluation, Model, Operation, Outcome, RunOptions, Ticket, Tool, UIEvent, UIState } from './reference.ts';
export function parseSearchArgs(_raw: unknown): { query: string; limit: number } { throw new Error('TODO Lab01'); }
export async function runAgent(_prompt: string, _model: Model, _tools: Record<string, Tool>, _options: RunOptions): Promise<Outcome> { throw new Error('TODO Lab02'); }
export function retrieve(_docs: readonly Doc[], _query: string, _tenant: string, _k = 3): Doc[] { throw new Error('TODO Lab03'); }
export function executeApprovedWrite(_store: Map<string, Operation>, _id: string, _actor: string, _tenant: string): Ticket { throw new Error('TODO Lab04'); }
export function reduceUI(_state: UIState, _event: UIEvent): UIState { throw new Error('TODO Lab05'); }
export function grade(_x: Evaluation): { pass: boolean; failures: string[] } { throw new Error('TODO Lab06'); }

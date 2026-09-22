import test from 'node:test';
import assert from 'node:assert/strict';
const {parseSearchArgs,runAgent,retrieve,executeApprovedWrite,reduceUI,grade}=await import(process.env.LAB_TARGET==='exercises'?'./src/exercises.ts':'./src/reference.ts');
const budget={maxSteps:3,maxToolCalls:2};
test('Lab01 normalize and default',()=>assert.deepEqual(parseSearchArgs({query:' button '}),{query:'button',limit:3}));
test('Lab01 reject malformed arguments and identity',()=>{
 for(const x of [null,[],{}, {query:''},{query:'x',limit:0},{query:'x',limit:1.5},{query:'x',limit:'3'},{query:'x',tenantId:'other'}]) assert.throws(()=>parseSearchArgs(x));
});
test('Lab02 feed actual tool result into next decision',async()=>{
 const model=async e=>e.at(-1).type==='result'?{kind:'final',text:e.at(-1).value.text}:{kind:'tool',name:'search',input:{}};
 const r=await runAgent('x',model,{search:async()=>({text:'evidence'})},budget);
 assert.equal(r.text,'evidence'); assert.equal(r.modelCalls,2); assert.equal(r.toolCalls,1); assert.equal(r.status,'final');
});
test('Lab02 bound tool attempts',async()=>{
 let n=0; const r=await runAgent('x',async()=>({kind:'tool',name:'s',input:{}}),{s:async()=>{n++;}},{maxSteps:5,maxToolCalls:2});
 assert.equal(r.status,'tool_limit');assert.equal(n,2);
});
test('Lab02 bound model steps',async()=>{
 const r=await runAgent('x',async()=>({kind:'tool',name:'s',input:{}}),{s:async()=>[]},{maxSteps:1,maxToolCalls:5});
 assert.equal(r.status,'step_limit');assert.equal(r.modelCalls,1);
});
test('Lab02 do not resolve inherited tool names',async()=>{
 const r=await runAgent('x',async e=>e.at(-1).type==='result'?{kind:'final',text:e.at(-1).value.error}:{kind:'tool',name:'constructor',input:{}},{},budget);
 assert.equal(r.text,'unknown_tool');
});
test('Lab02 reject invalid decisions',async()=>assert.rejects(runAgent('x',async()=>({kind:'tool',name:1}),{},budget),/invalid_decision/));
test('Lab02 sanitize tool failure',async()=>{
 const r=await runAgent('x',async e=>e.at(-1).type==='result'?{kind:'final',text:e.at(-1).value.error}:{kind:'tool',name:'s',input:{}},{s:async()=>{throw new Error('secret');}},budget);
 assert.equal(r.text,'tool_failed');assert.equal(JSON.stringify(r).includes('secret'),false);
});
test('Lab02 cancellation before model call',async()=>{
 let n=0; const c=new AbortController();c.abort();
 await assert.rejects(runAgent('x',async()=>{n++;return {kind:'final',text:'x'};},{},{...budget,signal:c.signal}));assert.equal(n,0);
});
test('Lab02 cancellation before tool side effect',async()=>{
 let n=0;const c=new AbortController();
 await assert.rejects(runAgent('x',async()=>{c.abort();return {kind:'tool',name:'w',input:{}};},{w:async()=>{n++;}},{...budget,signal:c.signal}));assert.equal(n,0);
});
const docs=[{id:'a',tenantId:'one',text:'button disabled'},{id:'b',tenantId:'one',text:'button'},{id:'secret',tenantId:'two',text:'button disabled loading'}];
test('Lab03 filter before rank and limit',()=>{assert.deepEqual(retrieve(docs,'button disabled loading','one',1).map(d=>d.id),['a']);assert.deepEqual(retrieve(docs,'unknown','one'),[]);assert.deepEqual(retrieve(docs,'','one'),[]);});
test('Lab03 deduplicate query terms',()=>assert.deepEqual(retrieve([{id:'a',tenantId:'one',text:'disabled'},{id:'z',tenantId:'one',text:'button'}],'button button disabled','one').map(d=>d.id),['a','z']));
const store=()=>new Map([['op1',{actorId:'alice',tenantId:'one',title:'Inspect Button',approved:true}]]);
test('Lab04 same operation returns same receipt without sharing mutation',()=>{const s=store();executeApprovedWrite(s,'op1','alice','one').title='bad';assert.deepEqual(executeApprovedWrite(s,'op1','alice','one'),{id:'ticket:op1',tenantId:'one',title:'Inspect Button'});});
test('Lab04 deny wrong actor, tenant and unapproved operation',()=>{const s=store();executeApprovedWrite(s,'op1','alice','one');assert.throws(()=>executeApprovedWrite(s,'op1','bob','one'),/forbidden/);assert.throws(()=>executeApprovedWrite(s,'op1','alice','two'),/forbidden/);s.set('op2',{actorId:'alice',tenantId:'one',title:'No',approved:false});assert.throws(()=>executeApprovedWrite(s,'op2','alice','one'),/approval_required/);});
const ui={runId:'r2',sequence:0,status:'running',text:''};
test('Lab05 ignore old run and duplicate delta',()=>{assert.deepEqual(reduceUI(ui,{runId:'r1',sequence:1,type:'delta',text:'old'}),ui);const n=reduceUI(ui,{runId:'r2',sequence:1,type:'delta',text:'ok'});assert.equal(reduceUI(n,{runId:'r2',sequence:1,type:'delta',text:'again'}).text,'ok');});
test('Lab05 preserve cancelled state and surface sequence gaps',()=>{const c=reduceUI(ui,{runId:'r2',sequence:1,type:'cancelled'});assert.equal(reduceUI(c,{runId:'r2',sequence:2,type:'done'}).status,'cancelled');assert.throws(()=>reduceUI(ui,{runId:'r2',sequence:3,type:'delta',text:'lost'}),/sequence_gap/);});
test('Lab06 expose all structural failures',()=>assert.deepEqual(grade({requiredDocIds:['a'],forbiddenTools:['write'],actual:{status:'step_limit',citedDocIds:[],calledTools:['write']}}),{pass:false,failures:['not_completed','missing_citation','forbidden_tool']}));
test('Lab06 structural success does not imply semantic success',()=>assert.deepEqual(grade({requiredDocIds:['a'],forbiddenTools:['write'],actual:{status:'final',citedDocIds:['a'],calledTools:['read']}}),{pass:true,failures:[]}));

test('Lab02 cancellation during a tool never starts a new model call',async()=>{
 let n=0;const c=new AbortController();
 await assert.rejects(runAgent('x',async()=>{n++;return {kind:'tool',name:'s',input:{}};},{s:async()=>{c.abort();return []; }},{...budget,signal:c.signal}));assert.equal(n,1);
});
test('Lab02 zero tool budget still permits a direct final answer',async()=>{
 const r=await runAgent('x',async()=>({kind:'final',text:'answer'}),{},{maxSteps:1,maxToolCalls:0});assert.equal(r.status,'final');assert.equal(r.toolCalls,0);
});
test('Lab02 zero tool budget prevents execution',async()=>{
 let n=0;const r=await runAgent('x',async()=>({kind:'tool',name:'s',input:{}}),{s:async()=>{n++;}},{maxSteps:1,maxToolCalls:0});assert.equal(r.status,'tool_limit');assert.equal(n,0);
});
test('Lab04 returns the stored external receipt rather than reconstructing it',()=>{
 const s=store();s.get('op1').receipt={id:'external-987',tenantId:'one',title:'Stored title'};assert.equal(executeApprovedWrite(s,'op1','alice','one').id,'external-987');
});
for(const [label,actual,expected] of [
 ['status',{status:'step_limit',citedDocIds:['a'],calledTools:['read']},'not_completed'],
 ['citation',{status:'final',citedDocIds:[],calledTools:['read']},'missing_citation'],
 ['tool',{status:'final',citedDocIds:['a'],calledTools:['write']},'forbidden_tool']
]) test(`Lab06 isolate ${label} failure`,()=>assert.deepEqual(grade({requiredDocIds:['a'],forbiddenTools:['write'],actual}),{pass:false,failures:[expected]}));

'use client';

import { useEffect, useRef, useState } from 'react';

type Finding = {
  title: string;
  sevTag: string;
  sevTagClass: string;
  loc: string;
  sevIcon: string;
  sevIconClass: string;
  msg1: string;
  userPrompt: string;
  msg2: string;
  msg3?: string;
  isPass: boolean;
  file: string;
  sbLoc: string;
  diff: string;
};

const PILLARS: { label: string; items: number[] }[] = [
  { label: 'Input validation', items: [0, 1] },
  { label: 'Retry logic', items: [2, 3] },
  { label: 'Observability', items: [4, 5] },
  { label: 'Guardrails', items: [6, 7] },
];

const FINDINGS: Finding[] = [
  {
    title: 'Unsanitized input → shell',
    sevTag: 'High severity', sevTagClass: 'bg-red-500/10 text-red-400',
    loc: 'tool_executor.py:42',
    sevIcon: '!', sevIconClass: 'bg-red-500/10 text-red-400',
    msg1: 'Your agent passes <code>user_input</code> straight into <code>run_command()</code>. A malicious prompt can make the agent execute arbitrary shell commands at runtime. The fix adds <code>sanitize()</code> with an explicit <code>SAFE_CMDS</code> allowlist.',
    userPrompt: 'Will the allowlist break my existing tool calls?',
    msg2: 'No — I traced every call site. All 6 callers only invoke <code>ls</code>, <code>cat</code>, or <code>git status</code>, which are in <code>SAFE_CMDS</code>. <strong class="text-white">No behavior change for current usage.</strong>',
    isPass: false, file: 'tool_executor.py', sbLoc: 'Ln 42, Col 1',
    diff: `<div class="ctx">38   <span class="kw">import</span> shlex, subprocess</div>
<div class="ctx">39   <span class="kw">from</span> trustabl.guards <span class="kw">import</span> sanitize</div>
<div class="ctx">40</div>
<div class="ctx">41   <span class="kw">def</span> <span class="fn">run_command</span>(user_input: <span class="kw">str</span>):</div>
<div class="removed">42 -     cmd = user_input</div>
<div class="added">42 +     cmd = <span class="fn">sanitize</span>(user_input, allow=SAFE_CMDS)</div>
<div class="ctx">43       args = shlex.<span class="fn">split</span>(cmd)</div>
<div class="ctx">44       <span class="kw">return</span> subprocess.<span class="fn">run</span>(args, capture_output=<span class="kw">True</span>)</div>
<div class="ctx">45</div>
<div class="ctx">46   SAFE_CMDS = [<span class="str">"ls"</span>, <span class="str">"cat"</span>, <span class="str">"git status"</span>]</div>`,
  },
  {
    title: 'No schema on tool params',
    sevTag: 'High severity', sevTagClass: 'bg-red-500/10 text-red-400',
    loc: 'agent_core.py:66',
    sevIcon: '!', sevIconClass: 'bg-red-500/10 text-red-400',
    msg1: '<code>call_tool()</code> accepts any params dict without checking required fields or types. Malformed inputs cause silent failures that are hard to debug in production. The fix validates against the tool\'s schema before execution.',
    userPrompt: 'What happens when validation fails at runtime?',
    msg2: '<code>validate()</code> raises <code>ToolParamError</code> with the missing field name, so the agent gets a structured error it can recover from instead of a silent <code>None</code>.',
    isPass: false, file: 'agent_core.py', sbLoc: 'Ln 66, Col 1',
    diff: `<div class="ctx">63   <span class="kw">async def</span> <span class="fn">call_tool</span>(name: <span class="kw">str</span>, params: <span class="kw">dict</span>):</div>
<div class="ctx">64       tool = REGISTRY[name]</div>
<div class="removed">65 -     return <span class="kw">await</span> tool.<span class="fn">run</span>(params)</div>
<div class="added">65 +     <span class="fn">validate</span>(params, tool.schema)  <span class="cm"># raises ToolParamError</span></div>
<div class="added">66 +     <span class="kw">return</span> <span class="kw">await</span> tool.<span class="fn">run</span>(params)</div>
<div class="ctx">67</div>
<div class="ctx">68   REGISTRY = <span class="fn">load_tools</span>(<span class="str">"tools.yaml"</span>)</div>`,
  },
  {
    title: 'No retry on timeout',
    sevTag: 'High severity', sevTagClass: 'bg-red-500/10 text-red-400',
    loc: 'skills/web_search.py:76',
    sevIcon: '!', sevIconClass: 'bg-red-500/10 text-red-400',
    msg1: '<code>web_search()</code> makes a single attempt with no retry. On a network blip the agent gives up, then loops trying to recover — burning tokens. Observed in your traces: <strong class="text-white">47× loops, $2.40 wasted per run</strong>.',
    userPrompt: 'Why 3 attempts instead of more?',
    msg2: '3 attempts with exponential backoff covers 99.7% of transient failures in your trace history. More attempts past that mostly delays surfacing real outages. You can tune it in <code>RETRY_CONFIG</code>.',
    isPass: false, file: 'skills/web_search.py', sbLoc: 'Ln 76, Col 1',
    diff: `<div class="ctx">73   <span class="kw">async def</span> <span class="fn">web_search</span>(query: <span class="kw">str</span>):</div>
<div class="ctx">74       client = <span class="fn">SearchClient</span>(api_key=settings.SEARCH_KEY)</div>
<div class="removed">75 -     return <span class="kw">await</span> client.<span class="fn">search</span>(query, top_k=5)</div>
<div class="added">75 +     <span class="kw">return</span> <span class="kw">await</span> <span class="fn">retry</span>(</div>
<div class="added">76 +         client.search, query, top_k=5,</div>
<div class="added">77 +         attempts=3, backoff=<span class="kw">True</span>,</div>
<div class="added">78 +     )</div>`,
  },
  {
    title: 'No backoff strategy',
    sevTag: 'Medium severity', sevTagClass: 'bg-amber-500/10 text-amber-400',
    loc: 'skills/web_search.py:90',
    sevIcon: '~', sevIconClass: 'bg-amber-500/10 text-amber-400',
    msg1: 'Retries fire immediately with no delay. Under load this hammers the downstream API, raises error rates, and burns token budget fast. The fix doubles the delay on each attempt: 1s → 2s → 4s.',
    userPrompt: 'How much latency does this add per request?',
    msg2: 'Zero on the happy path — backoff only applies after a failure. Worst case (2 failures then success) adds 3s total, versus the current behavior of failing outright.',
    isPass: false, file: 'skills/web_search.py', sbLoc: 'Ln 90, Col 1',
    diff: `<div class="ctx">88   RETRY_CONFIG = {</div>
<div class="ctx">89       <span class="str">"attempts"</span>: 3,</div>
<div class="added">90 +     <span class="str">"backoff"</span>: <span class="kw">True</span>,</div>
<div class="added">91 +     <span class="str">"base_delay"</span>: 1.0,  <span class="cm"># 1s → 2s → 4s</span></div>
<div class="ctx">92   }</div>`,
  },
  {
    title: 'Missing trace hooks',
    sevTag: 'Medium severity', sevTagClass: 'bg-amber-500/10 text-amber-400',
    loc: 'artifacts/report_gen.py:31',
    sevIcon: '~', sevIconClass: 'bg-amber-500/10 text-amber-400',
    msg1: '<code>generate_report()</code> writes artifacts with no logging or tracing. When something goes wrong in production you have no signal — no timing, no output size, no errors. The fix adds an <code>@observe</code> decorator.',
    userPrompt: 'Does the decorator add latency to report generation?',
    msg2: 'Negligible — it records a timestamp before and after the call and logs asynchronously. Measured overhead is under 1ms per invocation. Read-only instrumentation, no behavior change.',
    isPass: false, file: 'artifacts/report_gen.py', sbLoc: 'Ln 31, Col 1',
    diff: `<div class="ctx">29   <span class="kw">from</span> trustabl <span class="kw">import</span> observe</div>
<div class="ctx">30</div>
<div class="added">31 + @<span class="fn">observe</span>(log_timing=<span class="kw">True</span>, log_output=<span class="kw">True</span>)</div>
<div class="ctx">32   <span class="kw">async def</span> <span class="fn">generate_report</span>(data: <span class="kw">dict</span>):</div>
<div class="ctx">33       html = <span class="fn">render_template</span>(<span class="str">"report.html"</span>, data)</div>
<div class="ctx">34       <span class="kw">return</span> <span class="kw">await</span> artifacts.<span class="fn">write</span>(<span class="str">"report.html"</span>, html)</div>`,
  },
  {
    title: 'No cost tracking',
    sevTag: 'Medium severity', sevTagClass: 'bg-amber-500/10 text-amber-400',
    loc: 'agent_core.py:116',
    sevIcon: '~', sevIconClass: 'bg-amber-500/10 text-amber-400',
    msg1: 'Token usage isn\'t tracked per tool call, so there\'s no visibility into which tools burn budget. Your agent looped 47× with no way to detect it. The fix wraps each call with <code>track_cost()</code>.',
    userPrompt: 'Where do the cost logs end up?',
    msg2: 'They go through your existing logger (<code>log.info</code>) with structured fields — <code>tool</code>, <code>tokens</code>, <code>usd</code>, <code>duration_ms</code> — so they land wherever your logs already ship. Zero behavior change.',
    isPass: false, file: 'agent_core.py', sbLoc: 'Ln 116, Col 1',
    diff: `<div class="ctx">114  <span class="kw">async def</span> <span class="fn">run_tool</span>(name: <span class="kw">str</span>, params: <span class="kw">dict</span>):</div>
<div class="removed">115 -    result = <span class="kw">await</span> tools[name].<span class="fn">call</span>(params)</div>
<div class="added">115 +    <span class="kw">async with</span> <span class="fn">track_cost</span>(name) <span class="kw">as</span> meter:</div>
<div class="added">116 +        result = <span class="kw">await</span> tools[name].<span class="fn">call</span>(params)</div>
<div class="added">117 +    log.<span class="fn">info</span>(<span class="str">"tool=%s tokens=%d"</span>, name, meter.tokens)</div>
<div class="ctx">118      <span class="kw">return</span> result</div>`,
  },
  {
    title: 'Skill output unguarded',
    sevTag: 'Medium severity', sevTagClass: 'bg-amber-500/10 text-amber-400',
    loc: 'agent_core.py:202',
    sevIcon: '~', sevIconClass: 'bg-amber-500/10 text-amber-400',
    msg1: 'Skill output goes straight back to the agent with no guardrail check. If a skill is compromised or returns unexpected content, the agent acts on it with no safety filter in between.',
    userPrompt: 'What exactly does POLICY block?',
    msg2: '<code>POLICY</code> blocks prompt-injection patterns, PII leakage, and instructions that target other tools. Violations raise <code>GuardrailViolation</code> with the matched rule, so nothing is silently dropped.',
    isPass: false, file: 'agent_core.py', sbLoc: 'Ln 202, Col 1',
    diff: `<div class="ctx">199  <span class="kw">async def</span> <span class="fn">run_skill</span>(skill, input: <span class="kw">str</span>):</div>
<div class="ctx">200      output = <span class="kw">await</span> skill.<span class="fn">execute</span>(input)</div>
<div class="removed">201 -    return output</div>
<div class="added">201 +    <span class="kw">return</span> <span class="fn">apply_guardrails</span>(output, POLICY)</div>
<div class="ctx">202</div>
<div class="ctx">203  POLICY = <span class="fn">load_policy</span>(<span class="str">"guardrails.yaml"</span>)</div>`,
  },
  {
    title: 'Context window safe',
    sevTag: 'Passing', sevTagClass: 'bg-[#2DD4BF]/10 text-[#5EEAD4]',
    loc: 'agent_core.py · pass',
    sevIcon: '✓', sevIconClass: 'bg-[#2DD4BF]/10 text-[#5EEAD4]',
    msg1: 'Context window usage is within safe limits across all tested runs. The agent correctly truncates history before hitting the model\'s maximum context length.',
    userPrompt: 'How often does this get re-checked?',
    msg2: 'On every scan — each push to <code>main</code> re-runs the check against your latest traces. If usage trends toward the limit, this flips to a warning before it ever fails.',
    msg3: 'Confirmed — the truncation guard is in place and verified against your latest traces. Context window usage is holding at 14,200 / 128,000 tokens, well inside the safe range.',
    isPass: true, file: 'agent_core.py', sbLoc: 'Ln 1, Col 1',
    diff: `<div class="ctx"><span class="cm"># ✓ context_window · no issues found</span></div>
<div class="ctx"><span class="cm">#   max observed: 14,200 / 128,000 tokens</span></div>
<div class="ctx"><span class="cm">#   truncation logic: present ✓</span></div>`,
  },
];

export default function IdeWindow() {
  const [active, setActive] = useState(0);
  const [decisions, setDecisions] = useState<Record<number, 'accepted' | 'rejected'>>({});
  const f = FINDINGS[active];
  const threadRef = useRef<HTMLDivElement>(null);

  const selectFinding = (idx: number) => {
    setActive(idx);
  };

  useEffect(() => {
    const iv = setInterval(() => {
      setActive((a) => (a + 1) % FINDINGS.length);
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [active]);

  return (
    <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0c14]/70 shadow-[0_40px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
        </div>
        <div className="w-11" />
      </div>

      {/* Three columns */}
      <div className="grid min-h-[620px] grid-cols-1 lg:h-[620px] lg:grid-cols-[27%_43%_30%]">
        {/* Findings */}
        <div className="hidden border-white/5 bg-white/[0.02] lg:block lg:border-r">
          <div className="border-b border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gray-500">
            Findings · {FINDINGS.length}
          </div>
          <div className="p-2">
            {PILLARS.map((group) => (
              <div key={group.label} className="mb-2.5">
                <div className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                  {group.label}
                </div>
                {group.items.map((idx) => {
                  const item = FINDINGS[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => selectFinding(idx)}
                      className={`mb-0.5 flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-2 transition-colors ${
                        active === idx
                          ? 'border-[#2DD4BF]/25 bg-[#2DD4BF]/[0.07]'
                          : 'border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded font-mono text-[9.5px] font-bold ${item.sevIconClass}`}>
                        {item.sevIcon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] font-medium text-white">{item.title}</div>
                        <div className="mt-0.5 font-mono text-[10px] text-gray-500">{item.loc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Diff */}
        <div className="flex min-h-0 flex-col border-white/5 bg-black/20 lg:border-r">
          <div className="min-h-0 flex-1 overflow-y-auto bg-black/30 py-2">
            <div
              className="diff-code px-3.5 py-2 font-mono text-[12px] leading-[1.9]"
              dangerouslySetInnerHTML={{ __html: f.diff }}
            />
          </div>
        </div>

        {/* Chat — one continuous review thread */}
        <div className="flex min-h-0 flex-col bg-white/[0.015]">
          <div className="border-b border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gray-500">
            Review session
          </div>
          <div ref={threadRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
            <div className="px-3 py-3">
              <div className="space-y-4">
                <ChatMsg html={f.msg1} />
                <UserMsg text={f.userPrompt} />
                <ChatMsg html={f.msg2} />
                {f.msg3 && <ChatMsg html={f.msg3} />}
                {!f.isPass && (
                  decisions[active] ? (
                    <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${decisions[active] === 'accepted' ? 'text-[#5EEAD4]' : 'text-gray-500'}`}>
                      {decisions[active] === 'accepted' ? '✓ Fix accepted' : '✕ Fix rejected'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDecisions((d) => ({ ...d, [active]: 'accepted' }))}
                        className="rounded-lg border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-3 py-1.5 text-[12px] font-semibold text-[#5EEAD4] transition-colors hover:bg-[#2DD4BF]/20"
                      >
                        Accept fix
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecisions((d) => ({ ...d, [active]: 'rejected' }))}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-gray-400 transition-colors hover:bg-white/10"
                      >
                        Reject
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="flex-1 text-[12px] text-gray-500">Reply to Trustabl...</span>
              <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">⏎</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .diff-code .ctx { color: rgba(240,242,248,0.28); white-space: pre-wrap; padding: 0 0.75rem; }
        .diff-code .removed { background: rgba(239,68,68,0.07); color: #FCA5A5; opacity: 0.65; text-decoration: line-through; white-space: pre-wrap; padding: 0 0.75rem; }
        .diff-code .added { background: rgba(0,229,204,0.06); color: #5EEAD4; white-space: pre-wrap; padding: 0 0.75rem; }
        .diff-code .kw { color: #C792EA; }
        .diff-code .fn { color: #82AAFF; }
        .diff-code .str { color: #C3E88D; }
        .diff-code .cm { color: rgba(240,242,248,0.28); font-style: italic; }
      `}</style>
    </div>
  );
}

function ChatMsg({ html }: { html: string }) {
  return (
    <div
      className="chat-msg-text text-[13px] leading-[1.78] text-gray-300 [&_code]:rounded [&_code]:border [&_code]:border-white/10 [&_code]:bg-white/[0.08] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11.5px] [&_code]:text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function UserMsg({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="inline-block rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[13px] leading-[1.6] text-gray-200">
        {text}
      </div>
    </div>
  );
}

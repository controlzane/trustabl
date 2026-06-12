'use client';

import { useEffect, useState } from 'react';

type CliPhase = {
  label: string;
  badge: string;
  badgeClass: string;
  accent: string;
  lines: string[];
  riskLines?: number[];
  errorLog?: string;
  issueCounter?: boolean;
  diffLines?: { removed: number[]; added: number[] };
};

const CLI_PHASES: CliPhase[] = [
  {
    label: 'SCANNING',
    badge: 'Detecting',
    badgeClass: 'border-white/10 bg-white/5 text-gray-300',
    accent: 'text-[#2DD4BF]',
    lines: [
      '// scanning skill.ts for issues...',
      'checkInputValidation()',
      'checkRetryPolicy()',
      'checkObservability()',
      'checkGuardrails()',
    ],
    issueCounter: true,
  },
  {
    label: 'ANALYSIS',
    badge: '3 Critical Found',
    badgeClass: 'border-red-500/30 bg-red-500/10 text-red-400',
    accent: 'text-red-400',
    lines: [
      '// 3 critical issues detected',
      '✗  no input validation',
      '✗  missing retry logic',
      '✗  zero observability',
      '⚠  no guardrails',
    ],
    riskLines: [1, 2, 3, 4],
    errorLog: 'Agent looped 47×  ·  no backoff  ·  $2.40 wasted',
  },
  {
    label: 'ENRICHMENT',
    badge: 'Plan Ready',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    accent: 'text-amber-400',
    lines: [
      '// generating enrichment plan...',
      '[1] add validate(params, schema)',
      '[2] wrap with retry({ attempts: 3 })',
      '[3] inject observability hooks',
      '[4] apply guardrail constraints',
    ],
  },
  {
    label: 'AUTOFIX',
    badge: 'Applying',
    badgeClass: 'border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]',
    accent: 'text-[#2DD4BF]',
    lines: [
      '// applying fixes...',
      '- return tool.run(params)',
      '+ validate(params, schema)',
      '+ return await retry(tool.run, {',
      '+   attempts: 3, backoff: true',
      '+ })',
    ],
    diffLines: { removed: [1], added: [2, 3, 4, 5] },
  },
  {
    label: 'ENRICHED',
    badge: 'Production Ready',
    badgeClass: 'border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]',
    accent: 'text-[#2DD4BF]',
    lines: [
      '// score: 91% — production ready ✓',
      'async function callTool(params) {',
      '  validate(params, schema)',
      '  return await retry(tool.run, {',
      '    attempts: 3, backoff: true',
      '  })',
      '}',
    ],
  },
];

const CLI_LINE_DELAY_MS = 320;
const CLI_PHASE_PAUSE_MS = 1900;
const CLI_CODE_TEXT = 'font-mono text-[13px] leading-7 text-gray-300';

const PILLS = ['Validation Rules', 'Retry Safety', 'Observability', 'Guardrails'];

function CliPhaseView({ phase }: { phase: CliPhase }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timeouts: number[] = [];
    const resetId = window.setTimeout(() => { setVisibleLines(1); }, 140);
    phase.lines.forEach((_, index) => {
      if (index === 0) return;
      timeouts.push(window.setTimeout(() => {
        setVisibleLines(index + 1);
      }, 140 + index * CLI_LINE_DELAY_MS));
    });
    return () => {
      window.clearTimeout(resetId);
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [phase]);

  const issueCount = phase.issueCounter
    ? visibleLines >= 4 ? 3 : visibleLines >= 3 ? 2 : visibleLines >= 2 ? 1 : 0
    : null;

  const statusLabel = issueCount !== null
    ? issueCount === 0 ? 'Scanning...'
    : issueCount === 1 ? '1 issue found'
    : issueCount === 2 ? '2 issues found'
    : '3 critical · 1 warning'
    : phase.badge;

  const statusClass = issueCount !== null
    ? issueCount === 0 ? phase.accent
    : issueCount <= 2 ? 'text-yellow-400'
    : 'text-orange-400'
    : phase.accent;

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="font-mono text-sm text-gray-400">skill.ts</p>
        <span className={`rounded-md border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${phase.badgeClass}`}>
          {phase.label}
        </span>
      </div>

      <div className="flex flex-col px-5 pt-4 pb-4">
        <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
          <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-gray-500">
            <span>CLI session</span>
            <span className={statusClass}>{statusLabel}</span>
          </div>

          <div className={`${phase.errorLog ? 'h-[128px]' : 'h-[168px]'} overflow-hidden ${CLI_CODE_TEXT}`}>
            {phase.lines.map((line, index) => {
              const isRisk = phase.riskLines?.includes(index);
              const isRemoved = phase.diffLines?.removed.includes(index);
              const isAdded = phase.diffLines?.added.includes(index);
              return (
                <div
                  key={`${phase.label}-${index}`}
                  className={`flex items-start gap-2 break-words py-0.5 rounded transition-all duration-500 ${
                    index < visibleLines ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  } ${isRisk ? 'bg-red-500/10' : isRemoved ? 'bg-red-500/10' : isAdded ? 'bg-[#2DD4BF]/[0.07]' : ''}`}
                >
                  <span className="w-4 flex-none text-left text-gray-600 select-none">{index}</span>
                  <span className={
                    isRisk ? 'text-red-400 underline decoration-red-500/60 decoration-wavy underline-offset-2' :
                    isRemoved ? 'text-red-400' :
                    isAdded ? 'text-[#2DD4BF]' :
                    index === 0 ? phase.accent : 'text-gray-200'
                  }>{line}</span>
                </div>
              );
            })}
          </div>

          {phase.errorLog && (
            <div className={`mt-2 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3 py-2 transition-all duration-700 ${
              visibleLines >= phase.lines.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            }`}>
              <span className="font-mono text-[10px] text-red-400">✗ {phase.errorLog}</span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gray-500">
            Automatically Enriches These Failure Modes
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {PILLS.map((label) => (
              <span key={label} className="w-full rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-center text-[11px] font-medium text-gray-300">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function HeroCard() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = CLI_PHASES[phaseIndex];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPhaseIndex((current) => (current + 1) % CLI_PHASES.length);
    }, 140 + phase.lines.length * CLI_LINE_DELAY_MS + CLI_PHASE_PAUSE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [phase]);

  return (
    <div className="relative flex w-full max-w-[460px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#121214]/90 shadow-2xl shadow-black/40">
      <CliPhaseView key={phaseIndex} phase={phase} />
    </div>
  );
}

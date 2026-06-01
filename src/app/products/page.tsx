'use client';

import { useState } from 'react';
import { Space_Grotesk, Inter } from 'next/font/google';
import Link from 'next/link';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

const GITHUB_URL = 'https://github.com/trustabl/trustabl';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'npm' | 'python' | 'go'>('npm');

  const installCmds = {
    npm:    'npm install @trustabl/analyzer',
    python: 'pip install trustabl-analyzer',
    go:     'go install github.com/trustabl/trustabl/cmd/trustabl@latest',
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 ${inter.className}`}>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50">
        {/* Primary nav */}
        <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800">
                <span className={`text-base font-bold text-white ${spaceGrotesk.className}`}>T</span>
              </div>
              <span className={`text-lg font-semibold text-white ${spaceGrotesk.className}`}>Trustabl</span>
            </Link>

            <nav className="hidden md:flex">
              <a href="#" className={`relative px-4 py-2 text-sm font-semibold text-white ${spaceGrotesk.className}`}>
                Products
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white md:flex"
              >
                <GithubIcon className="h-4 w-4" />
                Star on GitHub
              </a>
              <a
                href="#quickstart"
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100 active:scale-[0.985]"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Secondary nav */}
        <div className="border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md">
          <div className="mx-auto flex h-10 max-w-[1200px] items-center gap-6 px-6">
            <a href="#" className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-200">Documentation</a>
            <a href="#" className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-200">Blog</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200">
              <GithubIcon className="h-3.5 w-3.5" />
              GitHub
            </a>
            <a
              href="trustabl-analyzer-landing.md"
              title="Clean Markdown version optimized for AI agents"
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              <span>🤖</span>
              For Agents (.md)
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="border-b border-slate-800 py-24 md:py-32">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">Open Source</span>
              <span className="h-4 w-px bg-slate-700" />
              <span className="text-xs text-slate-400">Apache 2.0</span>
            </div>

            <h1 className={`text-6xl font-bold tracking-tight text-white md:text-7xl ${spaceGrotesk.className}`}>
              Trustabl<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Agent Analyzer
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300 md:text-2xl">
              Static analysis for reliable, safe, and production-ready AI agents.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-3xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100 active:scale-[0.985]"
              >
                <GithubIcon className="h-5 w-5" />
                Get Started on GitHub
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900 px-7 py-3.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white active:scale-[0.985]"
              >
                Read the Docs
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ── CORE ANALYSIS ── */}
        <section className="border-b border-slate-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-14 text-center">
              <h2 className={`text-3xl font-bold text-white md:text-4xl ${spaceGrotesk.className}`}>
                What Trustabl Agent Analyzer detects
              </h2>
              <p className="mt-3 text-slate-400">Static analysis rules identify gaps in your agent tools</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: '✓',
                  iconBg: 'bg-emerald-500/10 text-emerald-400',
                  title: 'Input & Parameter Validation',
                  desc: 'Detects missing schema validation, unchecked parameters, and unsafe input handling before they cause runtime failures.',
                  issue: 'No input schema defined for tool parameters',
                },
                {
                  icon: '⚙',
                  iconBg: 'bg-indigo-500/10 text-indigo-400',
                  title: 'Retry Logic & Resilience',
                  desc: 'Finds tools with no retry policy, missing backoff strategies, and calls that will loop indefinitely on failure.',
                  issue: 'Tool has no retry wrapper or backoff policy',
                },
                {
                  icon: '👁',
                  iconBg: 'bg-purple-500/10 text-purple-400',
                  title: 'Observability & Monitoring',
                  desc: 'Identifies tools with no tracing, missing structured logs, and absent metrics hooks that make debugging impossible.',
                  issue: 'No observability hooks or structured logging found',
                },
                {
                  icon: '🛡',
                  iconBg: 'bg-amber-500/10 text-amber-400',
                  title: 'Guardrails & Safety Constraints',
                  desc: 'Catches missing applicability checks, absent approval gates, and tools that can trigger dangerous side effects unchecked.',
                  issue: 'No guardrails or applicability constraints defined',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-transform hover:-translate-y-1"
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-base font-semibold text-white ${spaceGrotesk.className}`}>{card.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate-400">{card.desc}</p>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-950 px-3 py-2">
                    <p className="font-mono text-[11px] text-slate-500">{card.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="border-b border-slate-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-14 text-center">
              <h2 className={`text-3xl font-bold text-white md:text-4xl ${spaceGrotesk.className}`}>How it works</h2>
            </div>

            <div className="mx-auto max-w-2xl">
              {[
                { n: '1', title: 'Scan your repo', desc: 'Point the analyzer at any agent codebase. It reads your tool definitions, schemas, and implementation files.' },
                { n: '2', title: 'Analyze findings', desc: 'Static rules run across every tool, checking for validation gaps, missing retry logic, observability holes, and guardrail issues.' },
                { n: '3', title: 'Generate report', desc: 'Get a prioritized report with a Production Readiness Score, severity-ranked findings, and SARIF/JSON/human-readable output.' },
                { n: '4', title: 'Improve & harden', desc: 'Use findings to guide manual fixes or wait for Auto-Fix (coming June 2026) to apply remediations automatically.' },
              ].map((step, i, arr) => (
                <div key={step.n} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-500 bg-indigo-500/10">
                      <span className={`text-sm font-bold text-indigo-400 ${spaceGrotesk.className}`}>{step.n}</span>
                    </div>
                    {i < arr.length - 1 && <div className="my-1 h-full min-h-[32px] w-px bg-slate-800" />}
                  </div>
                  <div className="pb-10">
                    <h3 className={`text-base font-semibold text-white ${spaceGrotesk.className}`}>{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="border-b border-slate-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: 'Open Source & Community Driven',
                  desc: 'Fully open source under Apache 2.0. Every rule is auditable, forkable, and improvable by the community. No black boxes.',
                  example: 'Fork the rules, add your own checks, contribute back.',
                },
                {
                  title: 'Production-Ready Rules',
                  desc: 'Rules are built from real production failures — not academic checklists. Each check maps to a known class of agent failure.',
                  example: 'Coverage across validation, retry, observability, and guardrails.',
                },
                {
                  title: 'Multiple Output Formats',
                  desc: 'Output as human-readable text, JSON for tooling, or SARIF for GitHub Code Scanning and CI/CD pipelines.',
                  example: 'Integrates directly into GitHub Actions and PR checks.',
                },
              ].map((f) => (
                <div key={f.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-7">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                    <CheckIcon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h3 className={`mb-2 text-base font-semibold text-white ${spaceGrotesk.className}`}>{f.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">{f.desc}</p>
                  <p className="text-xs text-slate-500">{f.example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUICK START ── */}
        <section id="quickstart" className="border-b border-slate-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-14 text-center">
              <h2 className={`text-3xl font-bold text-white md:text-4xl ${spaceGrotesk.className}`}>Quick start</h2>
            </div>

            <div className="mx-auto max-w-2xl space-y-5">
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
                <div className="flex border-b border-slate-800">
                  {(['npm', 'python', 'go'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        activeTab === tab
                          ? 'border-b-2 border-indigo-500 text-indigo-400'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="p-5">
                  <pre className="overflow-x-auto font-mono text-sm text-emerald-400">{installCmds[activeTab]}</pre>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                <div className="border-b border-slate-800 px-5 py-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Scan</span>
                </div>
                <div className="space-y-2 p-5">
                  {[
                    { cmd: 'trustabl scan ./my-agent-repo',              comment: '# basic scan' },
                    { cmd: 'trustabl scan . --strict',                   comment: '# strict mode' },
                    { cmd: 'trustabl scan . --format sarif > out.sarif', comment: '# SARIF output' },
                    { cmd: 'trustabl scan . --format json',              comment: '# JSON output' },
                  ].map(({ cmd, comment }) => (
                    <div key={cmd} className="flex items-center gap-3">
                      <span className="text-slate-600 select-none">$</span>
                      <pre className="flex-1 overflow-x-auto font-mono text-sm text-slate-300">{cmd}</pre>
                      <span className="font-mono text-xs text-slate-600">{comment}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-slate-500">
                Also available via{' '}
                <a href="#" className="text-indigo-400 hover:underline">GitHub Action</a>
                {' · '}
                <a href="#" className="text-indigo-400 hover:underline">Pre-commit hook</a>
                {' · '}
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Direct binary download</a>
              </p>
            </div>
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section className="border-b border-slate-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-14 text-center">
              <span className="mb-4 inline-block rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Product Roadmap
              </span>
              <h2 className={`mt-4 text-3xl font-bold text-white md:text-4xl ${spaceGrotesk.className}`}>
                Starting with open source.<br />Growing into a full platform.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Trustabl Agent Analyzer is the trustworthy foundation. We&apos;re shipping production hardening capabilities throughout 2026.
              </p>
            </div>

            <div className="mx-auto max-w-2xl space-y-4">
              {[
                {
                  status: 'NOW',
                  statusCls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                  cardBorder: 'border-emerald-500/20',
                  title: 'Trustabl Agent Analyzer',
                  badge: 'OPEN SOURCE',
                  badgeCls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
                  desc: 'Static analysis, rule-based detection, scoring, SARIF/JSON/human output, GitHub Action ready. Available today on GitHub.',
                },
                {
                  status: 'JUN',
                  statusCls: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                  cardBorder: 'border-amber-500/20',
                  title: 'Auto-Fix + OpenShell Features',
                  badge: 'COMING SOON',
                  badgeCls: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
                  desc: 'Automated remediation suggestions and full OpenShell risk surface analysis & hardening. First paid / platform capabilities.',
                },
                {
                  status: 'Q3',
                  statusCls: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                  cardBorder: 'border-amber-500/20',
                  title: 'Auto-Enrich',
                  badge: null,
                  badgeCls: '',
                  desc: 'LLM-powered enrichment of findings with deeper context, examples, and custom policy alignment.',
                },
              ].map((phase) => (
                <div key={phase.title} className={`flex gap-5 rounded-3xl border bg-slate-900 p-6 ${phase.cardBorder}`}>
                  <div className="flex-shrink-0 pt-0.5">
                    <span className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${phase.statusCls}`}>
                      {phase.status}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-base font-semibold text-white ${spaceGrotesk.className}`}>{phase.title}</h3>
                      {phase.badge && (
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${phase.badgeCls}`}>
                          {phase.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY OPEN SOURCE ── */}
        <section className="border-b border-slate-800 py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
              <div>
                <h2 className={`text-3xl font-bold text-white md:text-4xl ${spaceGrotesk.className}`}>
                  Why we&apos;re shipping Trustabl Agent Analyzer as open source first
                </h2>
                <ul className="mt-8 space-y-5">
                  {[
                    'Build trust through transparency. Let the community audit the rules and engine.',
                    'Establish the de-facto standard for agent reliability analysis before adding paid layers.',
                    'Enable every AI engineer and platform team to start hardening agents immediately — no gatekeeping.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                        <CheckIcon className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="text-sm leading-relaxed text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Navigation on this page</p>
                <p className="mb-3 text-sm leading-relaxed text-slate-400">
                  This Products page uses a focused primary nav + a lightweight subnav for supporting resources (Docs, Blog, GitHub, and the clean Markdown version optimized for AI agents).
                </p>
                <p className="text-sm leading-relaxed text-slate-400">
                  This keeps the experience clean while making it easy for both humans and agents to navigate supporting content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h2 className={`text-4xl font-bold text-white md:text-5xl ${spaceGrotesk.className}`}>
              Ready to make your agents production-grade?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              Start with Trustabl Agent Analyzer today. The rest of the platform is coming soon.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-3xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100 active:scale-[0.985]"
              >
                <GithubIcon className="h-5 w-5" />
                Star & Fork on GitHub
              </a>
              <a
                href="#quickstart"
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900 px-7 py-3.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white active:scale-[0.985]"
              >
                Run your first scan
              </a>
            </div>

            <p className="mt-8 text-xs text-slate-600">
              Questions? Reach out on{' '}
              <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:underline">
                GitHub Discussions
              </a>
              {' '}or join our waitlist for early platform access.
            </p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="text-xs text-slate-500">© 2026 Trustabl. Building Trust as Code for agentic systems.</p>
          <p className="mt-1.5 text-xs text-slate-600">
            Analyzer (Open Source) · Rules · GitHub Action · Auto-Fix & Enrich coming soon
          </p>
        </div>
      </footer>
    </div>
  );
}

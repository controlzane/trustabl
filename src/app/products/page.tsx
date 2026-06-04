'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bot, Search, Network, ShieldCheck, Gauge, Terminal, Package, Copy, Check } from 'lucide-react';
import HeroParticles from '@/components/HeroParticles';
import PreReleaseBanner from '@/components/PreReleaseBanner';

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
  const [activeTab, setActiveTab] = useState<'homebrew' | 'scoop' | 'docker'>('homebrew');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  function copyCmd(cmd: string) {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  }
  const [menuOpen, setMenuOpen] = useState(false);

  const installCmds = {
    npm:    'npm install @trustabl/analyzer',
    python: 'pip install trustabl-analyzer',
    go:     'go install github.com/trustabl/trustabl/cmd/trustabl@latest',
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Product', href: '/products' },
    { label: 'Docs', href: '/docs' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050506] text-white">

      {/* ── NAVBAR ── */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#050506]/85 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <Link href="/" className="justify-self-start">
            <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} priority className="h-7 w-auto" />
          </Link>

          <div className="hidden items-center justify-center gap-8 text-sm font-medium text-gray-400 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors duration-200 hover:text-white ${link.href === '/products' ? 'text-white' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center justify-end gap-4 md:flex">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#2DD4BF] px-5 py-2 text-sm font-medium text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]"
            >
              Try It
            </a>
          </div>

          <button
            className="justify-self-end text-gray-400 transition-colors hover:text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/5 bg-[#050506]/98 px-4 py-5 backdrop-blur-md md:hidden">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block text-sm text-gray-300 hover:text-white">
                  {link.label}
                </Link>
              ))}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="block rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-center text-sm font-medium text-[#08121F]">
                Try It
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        <PreReleaseBanner />

        {/* ── HERO ── */}
        <section className="relative border-b border-white/8 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <HeroParticles />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DD4BF]" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">Open Source</span>
              <span className="h-4 w-px bg-[#2DD4BF]/30" />
              <span className="text-xs text-gray-400">Apache 2.0</span>
            </div>

            <h1 className="text-6xl font-black tracking-tight text-white md:text-7xl">
              Trustabl <span className="text-[#2DD4BF]">Agent Analyzer</span>
            </h1>

            <p className="mt-6 text-xl font-light leading-relaxed text-gray-300 md:text-2xl">
              Static analysis for reliable, safe, and production-ready AI agents.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#08121F] transition-all hover:bg-gray-100 active:scale-[0.985]"
              >
                View on GitHub
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="#quickstart"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF]"
              >
                Install &amp; Scan in 60 seconds
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'https://randomuser.me/api/portraits/women/44.jpg',
                  'https://randomuser.me/api/portraits/men/32.jpg',
                  'https://randomuser.me/api/portraits/women/68.jpg',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="avatar"
                    className="h-8 w-8 rounded-full border-2 border-[#050506] object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Trusted by forward-deployed AI engineers &amp; <span className="font-semibold text-gray-300">platform teams</span>
              </p>
            </div>

            <div className="mx-auto mt-10 flex max-w-2xl items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10">
                  <Bot className="h-4 w-4 text-[#2DD4BF]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Also available for AI agents</p>
                  <p className="text-xs text-gray-400">Clean Markdown version — easy for agents to discover, read, parse, and deploy</p>
                </div>
              </div>
              <a
                href="trustabl-analyzer-landing.md"
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white transition-all hover:border-[#2DD4BF]/40 hover:text-[#2DD4BF] whitespace-nowrap"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View / Download .md
              </a>
            </div>
          </div>
        </section>

        {/* ── AGENT RELIABILITY GAP ── */}
        <section className="border-b border-white/8 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">The Agent Reliability Gap</p>
                <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
                  Your agents work in demos. They break in production.
                </h2>
              </div>
              <div className="space-y-5 text-gray-400">
                <p className="text-base leading-relaxed">
                  Most agent code is &ldquo;vibe coded&rdquo; — tools with missing schemas, subagents granted dangerous permissions, shell access without guardrails, and no traceability between agents and capabilities.
                </p>
                <p className="text-base leading-relaxed">
                  Trustabl Agent Analyzer brings{' '}
                  <strong className="font-semibold text-white">deterministic, SDK-aware static analysis</strong>
                  {' '}to the agent layer — the missing foundation for Trust as Code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="border-b border-white/8 bg-white/[0.02] py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                { stat: '4', label: 'Major SDKs supported', detail: 'Claude • OpenAI • Google ADK • MCP' },
                { stat: '0', label: 'Runtime required', detail: 'Pure static • Single binary • Offline' },
                { stat: '3', label: 'Output formats', detail: 'Human • JSON • SARIF 2.1' },
                { stat: '100%', label: 'Deterministic', detail: 'Byte-stable scans for reliable CI' },
              ].map((item) => (
                <div key={item.stat} className="flex flex-col gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-[#2DD4BF]">{item.stat}</span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">{item.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-300 whitespace-nowrap">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORE ANALYSIS ── */}
        <section className="border-b border-white/8 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 flex items-end justify-between">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">What makes it different</p>
                <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
                  Purpose-built for agentic systems
                </h2>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Search className="h-5 w-5" />,
                  title: 'SDK-Aware Analysis',
                  desc: 'Understands the specific idioms of Claude Agent SDK, OpenAI Agents SDK, Google ADK, and MCP. Rules only apply where they make sense.',
                },
                {
                  icon: <Network className="h-5 w-5" />,
                  title: 'Full Agent Graph Modeling',
                  desc: 'Discovers tools, agents, subagents, skills, slash commands, and the relationships between them — not just isolated functions.',
                },
                {
                  icon: <ShieldCheck className="h-5 w-5" />,
                  title: 'Actionable Findings',
                  desc: 'Every issue includes a clear explanation, suggested remediation, confidence score, and exact code location. No vague warnings.',
                },
                {
                  icon: <Gauge className="h-5 w-5" />,
                  title: 'Per-Tool Readiness Scores',
                  desc: 'Get a production readiness score for every tool definition. Overall score is the minimum across your inventory — surfaces the weakest links.',
                },
                {
                  icon: <Terminal className="h-5 w-5" />,
                  title: 'CI-Native & Deterministic',
                  desc: 'Byte-stable output, SARIF support, and clear exit codes (0/1/2). Perfect for GitHub Actions, pre-commit hooks, and policy gates.',
                },
                {
                  icon: <Package className="h-5 w-5" />,
                  title: 'Single Binary. Zero Dependencies.',
                  desc: 'No daemon, no server, no cloud. Install via Homebrew, Scoop, Docker, or Go. Runs fully offline after initial rule cache.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-[#2DD4BF]/30"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                    {card.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="border-b border-white/8 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">How it works</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Four steps. Minutes, not days.</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { n: '01', title: 'Scan your repo', desc: 'Point the analyzer at any agent codebase. It reads your tool definitions, schemas, and implementation files.' },
                { n: '02', title: 'Analyze findings', desc: 'Static rules run across every tool, checking for validation gaps, missing retry logic, observability holes, and guardrail issues.' },
                { n: '03', title: 'Generate report', desc: 'Get a prioritized report with a Production Readiness Score, severity-ranked findings, and SARIF/JSON/human-readable output.' },
                { n: '04', title: 'Improve & harden', desc: 'Use findings to guide manual fixes today. Free automated remediation via VS Code, Cursor, and Skill.md is coming soon.' },
              ].map((step) => (
                <div key={step.n} className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-[#2DD4BF]/30">
                  <span className="text-sm font-medium tracking-[0.12em] text-[#2DD4BF]">{step.n}</span>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── QUICK START ── */}
        <section id="quickstart" className="border-b border-white/8 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Quick start</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Up and running in seconds</h2>
            </div>

            <div className="mx-auto max-w-2xl space-y-5">
              {/* Install */}
              <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]">
                <div className="flex border-b border-white/8">
                  {(['homebrew', 'scoop', 'docker'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as never)}
                      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        activeTab === tab
                          ? 'border-b-2 border-[#2DD4BF] text-[#2DD4BF]'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="p-5">
                  {activeTab === 'homebrew' && (
                    <div className="flex items-center justify-between gap-3">
                      <pre className="flex-1 overflow-x-auto font-mono text-sm text-[#2DD4BF]">brew install trustabl/tap/trustabl</pre>
                      <button onClick={() => copyCmd('brew install trustabl/tap/trustabl')} className="flex-shrink-0 text-gray-500 transition-colors hover:text-[#2DD4BF]">
                        {copiedCmd === 'brew install trustabl/tap/trustabl' ? <Check className="h-4 w-4 text-[#2DD4BF]" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                  {activeTab === 'scoop' && (() => {
                    const scoopCmds = 'scoop bucket add trustabl https://github.com/trustabl/scoop-bucket\nscoop install trustabl';
                    return (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <pre className="overflow-x-auto font-mono text-sm text-[#2DD4BF]">scoop bucket add trustabl https://github.com/trustabl/scoop-bucket</pre>
                          <pre className="overflow-x-auto font-mono text-sm text-[#2DD4BF]">scoop install trustabl</pre>
                        </div>
                        <button onClick={() => copyCmd(scoopCmds)} className="flex-shrink-0 text-gray-500 transition-colors hover:text-[#2DD4BF]">
                          {copiedCmd === scoopCmds ? <Check className="h-4 w-4 text-[#2DD4BF]" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    );
                  })()}
                  {activeTab === 'docker' && (
                    <div className="flex items-center justify-between gap-3">
                      <pre className="flex-1 overflow-x-auto font-mono text-sm text-[#2DD4BF]">{`docker run --rm -v "$PWD:/repo" ghcr.io/trustabl/trustabl:latest scan /repo`}</pre>
                      <button onClick={() => copyCmd(`docker run --rm -v "$PWD:/repo" ghcr.io/trustabl/trustabl:latest scan /repo`)} className="flex-shrink-0 text-gray-500 transition-colors hover:text-[#2DD4BF]">
                        {copiedCmd === `docker run --rm -v "$PWD:/repo" ghcr.io/trustabl/trustabl:latest scan /repo` ? <Check className="h-4 w-4 text-[#2DD4BF]" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Scan */}
              <div className="overflow-hidden rounded-3xl border border-white/8 bg-black/30">
                <div className="border-b border-white/8 px-5 py-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Scan</span>
                </div>
                <div className="space-y-2 p-5">
                  {[
                    { cmd: 'trustabl scan ./path/to/agent-repo', comment: '# local repo' },
                    { cmd: 'trustabl scan https://github.com/org/repo', comment: '# remote repo' },
                    { cmd: 'trustabl scan ./repo --format json', comment: '# JSON output' },
                    { cmd: 'trustabl rules pull', comment: '# update rules' },
                  ].map(({ cmd, comment }) => (
                    <div key={cmd} className="flex items-center gap-3">
                      <span className="text-gray-600 select-none">$</span>
                      <pre className="flex-1 overflow-x-auto font-mono text-sm text-gray-300">{cmd}</pre>
                      <span className="font-mono text-xs text-gray-600">{comment}</span>
                      <button onClick={() => copyCmd(cmd)} className="flex-shrink-0 text-gray-600 transition-colors hover:text-[#2DD4BF]">
                        {copiedCmd === cmd ? <Check className="h-3.5 w-3.5 text-[#2DD4BF]" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-gray-500">
                Also available as a{' '}
                <a href="https://github.com/trustabl/actions" target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">GitHub Action</a>
                {' · '}
                <a href="https://github.com/trustabl/trustabl/releases/latest" target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">Direct binary download</a>
              </p>
            </div>
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section className="border-b border-white/8 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-16 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Product Roadmap</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Starting with open source.<br />Growing into a full platform.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">
                Trustabl Agent Analyzer is the trustworthy foundation. We&apos;re shipping production hardening capabilities throughout 2026.
              </p>
            </div>

            {/* Timeline */}
            <div className="mx-auto max-w-3xl">
              {[
                {
                  date: 'Now',
                  dateCls: 'text-[#2DD4BF]',
                  dotCls: 'bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.5)]',
                  title: 'Trustabl Agent Analyzer',
                  badge: 'OPEN SOURCE',
                  badgeCls: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/25',
                  desc: 'Static analysis, rule-based detection, scoring, SARIF/JSON/human output, GitHub Action ready. Available today on GitHub.',
                  active: true,
                },
                {
                  date: 'Jun 2026',
                  dateCls: 'text-amber-400',
                  dotCls: 'bg-amber-400/40 border border-amber-400/60',
                  title: 'Auto-Fix + OpenShell Features',
                  badge: 'COMING SOON',
                  badgeCls: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
                  desc: 'Automated remediation via VS Code/Cursor extension and Skill.md — auto-fix safe issues, review higher-risk changes before committing. Full OpenShell risk surface analysis & hardening.',
                  active: false,
                },
                {
                  date: 'Q3 2026',
                  dateCls: 'text-gray-500',
                  dotCls: 'bg-white/10 border border-white/15',
                  title: 'Auto-Enrich',
                  badge: null,
                  badgeCls: '',
                  desc: 'LLM-powered enrichment of findings with deeper context, examples, and custom policy alignment.',
                  active: false,
                },
              ].map((phase, i, arr) => (
                <div key={phase.title} className="flex gap-6">
                  {/* Date + dot + connector column */}
                  <div className="relative hidden w-32 flex-shrink-0 flex-col items-end md:flex">
                    {/* Date + dot row */}
                    <div className="flex items-center gap-2 pt-6">
                      <span className={`text-xs font-semibold ${phase.dateCls}`}>{phase.date}</span>
                      <div className={`h-3 w-3 flex-shrink-0 rounded-full ${phase.dotCls}`} />
                    </div>
                    {/* Connector line — only between items */}
                    {i < arr.length - 1 && (
                      <div className="mr-[5px] w-px flex-1 bg-white/8" />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`mb-5 flex-1 rounded-3xl border p-6 transition-colors ${phase.active ? 'border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.04]' : 'border-white/8 bg-white/[0.03]'}`}>
                    <div className="mb-1 flex flex-wrap items-center gap-2 md:hidden">
                      <span className={`text-xs font-semibold ${phase.dateCls}`}>{phase.date}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{phase.title}</h3>
                      {phase.badge && (
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${phase.badgeCls}`}>
                          {phase.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY OPEN SOURCE ── */}
        <section className="border-b border-white/8 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Why open source</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Why we&apos;re shipping open source first
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  number: '01',
                  title: 'Trust through transparency',
                  desc: 'Every rule is auditable, forkable, and improvable by the community. No black boxes — see exactly what we check and why.',
                },
                {
                  number: '02',
                  title: 'Set the standard early',
                  desc: 'Establish the de-facto standard for agent reliability analysis before adding paid layers. The community shapes the foundation.',
                },
                {
                  number: '03',
                  title: 'No gatekeeping',
                  desc: 'Every AI engineer and platform team can start hardening agents immediately. Reliability tooling shouldn\'t be locked behind a paywall.',
                },
              ].map((item) => (
                <div key={item.number} className="rounded-3xl border border-white/8 bg-white/[0.03] p-7 transition-colors hover:border-[#2DD4BF]/30">
                  <span className="text-sm font-medium tracking-[0.12em] text-[#2DD4BF]">{item.number}</span>
                  <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Ready to make your agents production-grade?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-400">
              Start with Trustabl Agent Analyzer today. The rest of the platform is coming soon.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-7 py-3.5 text-sm font-semibold text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]"
              >
                <GithubIcon className="h-5 w-5" />
                Star & Fork on GitHub
              </a>
              <a
                href="#quickstart"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-medium text-gray-300 transition-all hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF]"
              >
                Run your first scan
              </a>
            </div>

            <p className="mt-8 text-xs text-gray-600">
              Questions? Reach out on{' '}
              <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">
                GitHub Discussions
              </a>
              {' '}or join our waitlist for early platform access.
            </p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} className="h-6 w-auto opacity-60" />
          </Link>
          <p className="text-xs text-gray-500">© 2026 Trustabl</p>
        </div>
      </footer>
    </div>
  );
}

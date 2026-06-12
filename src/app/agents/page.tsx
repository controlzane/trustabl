'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import HeroParticles from '@/components/HeroParticles';
import PreReleaseBanner from '@/components/PreReleaseBanner';
import { useGithubStars } from '@/hooks/useGithubStars';
import Footer from '@/components/Footer';

const GITHUB_URL = 'https://github.com/trustabl/trustabl';

const XIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CheckCircle = () => (
  <svg className="h-4 w-4 flex-shrink-0 text-[#2DD4BF] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XCircle = () => (
  <svg className="h-4 w-4 flex-shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/products' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
];

const problemCards = [
  {
    title: 'Invalid or hallucinated tool calls',
    desc: 'Caused by missing schemas and validation.',
    danger: true,
  },
  {
    title: 'Silent failures and cascading errors',
    desc: 'Hidden by lack of observability.',
    danger: true,
  },
  {
    title: 'Context degradation & specification drift',
    desc: 'In long-running or multi-turn agents due to sparse tool descriptions.',
    danger: true,
  },
  {
    title: 'Token waste',
    desc: 'From repeated failed calls and loops.',
    danger: true,
  },
  {
    title: 'Painful debugging',
    desc: 'With no structured logs or traces.',
    danger: true,
  },
  {
    title: 'Our Solution',
    desc: 'Automated ATM that gives agents rich, structured context + built-in guards + full visibility.',
    danger: false,
  },
];

const featureCards = [
  {
    title: 'Proper Tool Selection & Calling',
    desc: 'Rich input/output schemas, applicability constraints, and validation rules. Agents call the right tool with correct parameters.',
  },
  {
    title: 'Observability for Silent Failures',
    desc: 'Auto-generated OTEL tracing, structured logging, and metrics. Catch issues early and debug fast.',
  },
  {
    title: 'Reduced Context Degradation',
    desc: 'Persistent, high-fidelity ATM metadata travels with the tool, maintaining clarity across long agent runs.',
  },
  {
    title: 'Early Auto-Remediation',
    desc: 'Generated retries, guardrails, circuit breakers, and prioritized suggestions. Fix problems before they reach production.',
  },
];

const karpathyCards = [
  {
    n: '1',
    title: 'Think Before Coding',
    desc: 'Analyze tools before hardening — understand risk profile first.',
  },
  {
    n: '2',
    title: 'Simplicity First',
    desc: "Generate only the metadata that's needed, no bloat.",
  },
  {
    n: '3',
    title: 'Surgical Changes',
    desc: 'Non-invasive enrichment — your tool code stays untouched.',
  },
  {
    n: '4',
    title: 'Outcomes First',
    desc: 'Every ATM field maps to a measurable reliability outcome.',
  },
];

const schemaChips = ['Validation', 'Resilience', 'Observability', 'Security (OpenShell)', 'Supply Chain', 'Applicability'];

const integrationTiers = [
  {
    badge: 'Free Tier',
    title: 'Individual Builders / Quick Start',
    desc: 'Connect GitHub repo → Get scored & hardened in minutes.',
    cta: 'Start free →',
  },
  {
    badge: 'Automation',
    title: 'CI/CD & Teams',
    desc: 'GitHub Action for automated scanning and enrichment on every push.',
    cta: 'View GitHub Action →',
  },
  {
    badge: 'Frameworks',
    title: 'Agent Frameworks (OpenClaw etc.)',
    desc: 'Install Trustabl skills including the Karpathy-aligned version. Reference ATM in your tool discovery logic.',
    cta: 'Get Skills →',
  },
];

const integrationTiers2 = [
  {
    badge: 'Enterprise',
    title: 'NVIDIA / Governed Environments',
    desc: 'Use our OpenShell-compatible policy generation and export.',
    cta: 'OpenShell docs →',
  },
  {
    badge: 'API',
    title: 'Programmatic / Registry',
    desc: 'Public feeds and metadata available for agent directories.',
    cta: 'API Reference →',
  },
];

const faqItems = [
  {
    q: 'How do I call Trustabl from my agent builder?',
    a: 'Use the GitHub Action, open-source scanner, or install our skills directly. ATM JSON output is structured for easy consumption by any agent framework.',
  },
  {
    q: 'ATM vs SKILL.md?',
    a: 'Skills teach the agent how to perform a task or workflow. ATM makes the tools themselves reliable underneath. They are complementary and recommended together.',
  },
  {
    q: 'Does this work with my existing tools?',
    a: 'Yes. Non-invasive. Trustabl analyzes your code, documentation, and behavior, then generates enriched metadata on top without modifying your source.',
  },
  {
    q: 'How does this help developers upskilling in AI?',
    a: 'Provides the production hardening layer employers expect. Clear scores and explicit evidence of reliability — validation rules, retry policies, observability hooks, and more.',
  },
  {
    q: 'Evidence it works?',
    a: 'Before/after scores (38% → 91%+), explicit failure mode coverage, NVIDIA OpenShell compatibility, and Karpathy alignment.',
  },
];

export default function AgentsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const starCount = useGithubStars();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050506] text-white">

      {/* NAVBAR */}
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
                className={`transition-colors duration-200 hover:text-white ${link.href === '/agents' ? 'text-white' : ''}`}
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
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/[0.07] hover:text-white"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
              {starCount !== null && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/15 px-2 py-0.5 text-[12px] font-semibold text-amber-400">
                  <svg className="h-3 w-3 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {starCount >= 1000 ? `${(starCount / 1000).toFixed(1)}k` : starCount}
                </span>
              )}
            </a>
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
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/5 bg-[#050506]/98 px-4 py-5 backdrop-blur-md md:hidden">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block text-sm font-medium transition-colors hover:text-white ${link.href === '/agents' ? 'text-white' : 'text-gray-400'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-center text-sm font-medium text-[#08121F]"
              >
                Try It
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="page-transition pt-16">
        <PreReleaseBanner />

      {/* HERO */}
      <section className="relative border-b border-white/8 flex flex-col items-center justify-center pb-24 pt-24 md:pt-32 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <HeroParticles />
        </div>
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-[#2DD4BF]">
          For AI Agents &amp; Builders
        </p>
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          Make Your Tools Agent-Ready:{' '}
          <span className="text-[#2DD4BF]">From Demo to Production</span>{' '}
          in Minutes
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          Prevent agentic failure with rich Agentic Tool Metadata (ATM), observability, and early remediation.
          Compatible with NVIDIA OpenShell. Aligned with Karpathy&apos;s principles.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Average Production Readiness Score:{' '}
          <span className="text-white">38%</span>
          {' → '}
          <span className="text-[#2DD4BF]">91%+</span>
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-medium text-[#0f1117] transition-all hover:bg-[#22B8A6]"
          >
            Connect GitHub &amp; Harden Tools →
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-[#222536] px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/20"
          >
            Try the free Scanner
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* WHY AGENTS NEED HARDENED TOOLS */}
      <section className="border-b border-white/8 bg-[#090a0d] py-24 reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">
            The Problem We Solve
          </p>
          <h2 className="mb-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
            Why Agents Need Hardened Tools
          </h2>
          <p className="mb-12 max-w-3xl text-lg text-gray-400">
            Most agent projects never reach reliable production because the underlying tools are fragile.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problemCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-3xl border p-6 ${card.danger
                  ? 'border-white/8 bg-white/[0.03]'
                  : 'border-[#2dd4bf] bg-white/[0.03]'
                }`}
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${card.danger
                    ? 'border-[#7f2020] bg-[#1c0f0f]'
                    : 'border-[#2dd4bf] bg-[#0c2b2e]'
                  }`}
                >
                  {card.danger ? (
                    <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE PREVENT AGENTIC FAILURE */}
      <section className="border-b border-white/8 bg-black py-24 reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">
            How We Prevent Agentic Failure
          </p>
          <h2 className="mb-4 text-center text-4xl font-semibold leading-tight text-white lg:text-5xl">
            Evidence for Agents &amp; Employers
          </h2>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {featureCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#2dd4bf] bg-[#0c2b2e]">
                  <svg className="h-4 w-4 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Before / After */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#7f2020] bg-white/[0.03] p-6">
              <h3 className="mb-4 text-sm font-medium text-red-400">Before — Typical Tool (~38% High Risk)</h3>
              <ul className="space-y-2">
                {[
                  'No input validation → agents pass bad parameters.',
                  'Missing retry logic → duplicate side effects or silent breaks.',
                  'No observability → cascading errors go unnoticed until failure.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <XCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[#2dd4bf] bg-white/[0.03] p-6">
              <h3 className="mb-4 text-sm font-medium text-[#2DD4BF]">After — Trustabl Hardened (91%+)</h3>
              <ul className="space-y-2">
                {[
                  'Full schemas + validation rules auto-added.',
                  'Retry safety and circuit breakers in place.',
                  'Observability hooks + clear workflow guidance.',
                  'Result: Fewer mistakes, faster recovery, measurable reliability.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            See full JSON examples and the complete ATM Schema —{' '}
            <a href="#schema" className="text-[#2DD4BF] underline">linked below</a>.
          </p>
        </div>
      </section>

      {/* NVIDIA OPENSHELL */}
      <section id="openshell" className="border-b border-white/8 bg-[#090a0d] py-24 reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">
                NVIDIA OpenShell Compatibility
              </p>
              <h2 className="mb-6 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                Designed for Governed Agent Deployments
              </h2>
              <p className="mb-8 text-lg text-gray-400">
                Trustabl is the natural bridge to secure, governed agent deployments for NVIDIA agents and users.
              </p>
              <ul className="space-y-3">
                {[
                  'Automatic least-privilege sandbox policies and egress rules.',
                  'Pre-flight compatibility checks.',
                  '1-click hardened + sandboxed export.',
                  'Policy-aware recommendations for routing and constraints.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-400">
                    <CheckCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0A0A0C] p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-2 font-mono text-xs text-gray-500">openshell_policy.json</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-gray-300">
{`{
  "tool": "fetch_user_data",
  "sandbox": {
    "egress": ["api.example.com"],
    "permissions": ["read:users"],
    "network": "restricted"
  },
  "preflight": {
    "checks": ["auth", "rate_limit"],
    "circuit_breaker": true
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* KARPATHY ALIGNMENT */}
      <section className="border-b border-white/8 bg-black py-24 reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">
            Karpathy Alignment
          </p>
          <h2 className="mb-4 text-center text-4xl font-semibold leading-tight text-white lg:text-5xl">
            Behavioral Discipline Meets Production Discipline
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-400">
            We embrace and extend Andrej Karpathy&apos;s 4 Rules into tool hardening — combining coding
            discipline with production-ready reliability.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {karpathyCards.map((card) => (
              <div key={`${card.n}-${card.title}`} className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#2dd4bf] bg-[#0c2b2e]">
                  <span className="text-sm font-medium text-white">{card.n}</span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2dd4bf] bg-[#0c2b2e]">
                  <svg className="h-4 w-4 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-white">Karpathy + Trustabl Skill</h3>
              </div>
              <p className="text-sm text-gray-400">
                Available for OpenClaw and compatible frameworks. Combines the 4 Rules with explicit ATM
                recommendations, hardening guidance, and production readiness checklists.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="#" className="rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-sm font-medium text-[#0f1117] transition-all hover:bg-[#22B8A6]">
                  Trustabl_Karpathy.md →
                </Link>
                <Link href="#" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20">
                  Skill Packages →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATM SCHEMA */}
      <section id="schema" className="border-b border-white/8 bg-[#090a0d] py-24 reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">
            ATM Schema &amp; Machine-Readable Details
          </p>
          <h2 className="mb-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
            Programmatic Understanding for Agents
          </h2>
          <p className="mb-12 max-w-3xl text-lg text-gray-400">
            For agents and builders who want direct access to the complete metadata specification.
          </p>

          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-white">Schema Coverage</h3>
              <div className="flex flex-wrap gap-2">
                {schemaChips.map((chip) => (
                  <span key={chip} className="rounded-lg bg-[#0c2b2e] px-3 py-1.5 text-xs font-medium text-[#2DD4BF]">
                    {chip}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                This schema lets agents understand exactly what metadata is available to improve tool
                calling reliability and prevent failures.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="#" className="rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-sm font-medium text-[#0f1117] transition-all hover:bg-[#22B8A6]">
                  Full schema: ATM_SCHEMA.json →
                </Link>
                <Link href="#" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20">
                  Example enriched ATM output →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATION OPTIONS */}
      <section className="border-b border-white/8 bg-black py-24 reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">
            Integration Options
          </p>
          <h2 className="mb-4 text-center text-4xl font-semibold leading-tight text-white lg:text-5xl">
            Direct &amp; Explicit — All CTAs Have Plain Text Links
          </h2>
          <p className="mb-12 text-center text-lg text-gray-400">
            Plain text links included below for agent parsing.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {integrationTiers.map((tier) => (
              <div key={tier.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <span className="mb-4 inline-block rounded-full bg-[#0c2b2e] px-3 py-1 text-xs font-medium text-[#2DD4BF]">
                  {tier.badge}
                </span>
                <h3 className="mb-2 text-base font-semibold text-white">{tier.title}</h3>
                <p className="mb-4 text-sm text-gray-400">{tier.desc}</p>
                <a href="#" className="text-xs font-medium text-[#2DD4BF] hover:underline">
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {integrationTiers2.map((tier) => (
              <div key={tier.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <span className="mb-4 inline-block rounded-full bg-[#0c2b2e] px-3 py-1 text-xs font-medium text-[#2DD4BF]">
                  {tier.badge}
                </span>
                <h3 className="mb-2 text-base font-semibold text-white">{tier.title}</h3>
                <p className="mb-4 text-sm text-gray-400">{tier.desc}</p>
                <a href="#" className="text-xs font-medium text-[#2DD4BF] hover:underline">
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/8 bg-[#090a0d] py-24 reveal">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">
            Agent-Specific FAQ
          </p>
          <h2 className="mb-12 text-center text-4xl font-semibold leading-tight text-white">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-white/8">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  <span className="text-lg text-white">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {faqOpen === i && (
                  <div className="pb-5 text-sm leading-relaxed text-gray-400">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="border-b border-white/8 bg-black py-16 reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-10">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="mb-3 text-2xl font-bold leading-snug text-white sm:text-3xl">
                  Ready to List Trustabl in Your Agent Tool Registry?
                </h2>
                <p className="max-w-lg text-gray-400">
                  Use our metadata, schema, and this page as the canonical source.
                  Contact us for partnership or early access.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-medium text-[#0f1117] transition-all hover:bg-[#22B8A6]"
                >
                  Start Free - Connect GitHub →
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/20"
                >
                  Explore Open-Source Scanner &amp; Skills →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}

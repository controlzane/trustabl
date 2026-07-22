'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Zap, Target, Building2, Map, FileText, Terminal, BookOpen } from 'lucide-react';
import HeroParticles from '@/components/HeroParticles';

const GITHUB_URL = 'https://github.com/trustabl/trustabl';
const DOCS_URL = 'https://trustabl.github.io/trustabl-docs';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/products' },
  { label: 'Docs', href: 'https://trustabl.github.io/trustabl-docs/' },
  { label: 'Blog', href: '/blog' },
];

// ── Carousel data ──
const ROW1 = [
  { id: 'CSDK-003', name: 'Network call has no timeout', sev: 'high' },
  { id: 'MCP-010',  name: 'Tool registration shells out', sev: 'high' },
  { id: 'OAI-012',  name: 'Tool body spawns a subprocess', sev: 'high' },
  { id: 'ADK-008',  name: 'BashTool missing metacharacter blocking', sev: 'high' },
  { id: 'CSDK-002', name: 'Tool parameters not type-annotated', sev: 'medium' },
  { id: 'MCP-008',  name: 'SSRF / caller-controlled URL', sev: 'high' },
  { id: 'OAI-003',  name: 'Tool sets strict_mode=False', sev: 'medium' },
  { id: 'CSDK-110', name: 'Subagent granted the built-in Bash tool', sev: 'high' },
  { id: 'ADK-101',  name: 'LlmAgent has no description', sev: 'medium' },
  { id: 'OAI-106',  name: 'Agent wires MCP servers without guardrails', sev: 'high' },
  { id: 'MCP-004',  name: 'MCP tool network call has no timeout', sev: 'high' },
  { id: 'CSDK-004', name: 'Path used in I/O without validation', sev: 'high' },
  { id: 'OAI-201',  name: 'Project uses default OpenAI tracing', sev: 'medium' },
];

const ROW2 = [
  { id: 'CSDK-101', name: 'Claude subagent granted the Bash tool', sev: 'high' },
  { id: 'OAI-013',  name: 'eval/exec/compile on dynamic input', sev: 'high' },
  { id: 'MCP-001',  name: 'MCP tool has no description', sev: 'low' },
  { id: 'ADK-102',  name: 'Agent with BashTool has no before_tool_callback', sev: 'high' },
  { id: 'CSDK-006', name: 'Mutating tool has no idempotency key', sev: 'medium' },
  { id: 'MCP-014',  name: 'MCP tool uses eval / new Function', sev: 'high' },
  { id: 'OAI-102',  name: 'tool_use_behavior="stop_on_first_tool"', sev: 'high' },
  { id: 'ADK-003',  name: 'Network call has no timeout', sev: 'high' },
  { id: 'CSDK-001', name: 'Tool has no description', sev: 'low' },
  { id: 'MCP-005',  name: 'MCP tool path used without validation', sev: 'high' },
  { id: 'OAI-005',  name: 'Network call has no timeout', sev: 'high' },
  { id: 'ADK-104',  name: 'Agent has no safety_settings', sev: 'medium' },
  { id: 'CSDK-102', name: 'Claude subagent granted the WebSearch tool', sev: 'high' },
];

function sevDot(sev: string) {
  if (sev === 'high') return 'bg-red-400';
  if (sev === 'medium') return 'bg-amber-400';
  return 'bg-[#2DD4BF]';
}

function sdkLabel(id: string) {
  if (id.startsWith('CSDK')) return 'Claude';
  if (id.startsWith('OAI'))  return 'OpenAI';
  if (id.startsWith('ADK'))  return 'ADK';
  return 'MCP';
}

function CarouselPill({ id, name, sev }: { id: string; name: string; sev: string }) {
  return (
    <div className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-gray-400 whitespace-nowrap">
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${sevDot(sev)}`} />
      <span className="text-[11px] text-[#2DD4BF]">{id}</span>
      <span className="text-[11px] text-gray-500 hidden sm:inline">{sdkLabel(id)}</span>
      <span>{name}</span>
    </div>
  );
}

function Carousel({ items, reverse }: { items: typeof ROW1; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)' }}>
      <div
        className="flex gap-2.5"
        style={{ animation: `${reverse ? 'scrollRight' : 'scrollLeft'} ${reverse ? '120s' : '100s'} linear infinite`, willChange: 'transform' }}
      >
        {doubled.map((item, i) => <CarouselPill key={i} {...item} />)}
      </div>
    </div>
  );
}

// ── Rules data ──
type Rule = { id: string; scope: string; policy: string; sev: 'high' | 'medium' | 'low'; risk: number };

const CLAUDE_RULES: Rule[] = [
  { id: 'CSDK-001', scope: 'tool',     policy: 'Tool has no description',                         sev: 'low',    risk: 14.3 },
  { id: 'CSDK-002', scope: 'tool',     policy: 'Tool parameters are not type-annotated',           sev: 'medium', risk: 36.0 },
  { id: 'CSDK-003', scope: 'tool',     policy: 'Network call has no timeout',                      sev: 'high',   risk: 59.5 },
  { id: 'CSDK-004', scope: 'tool',     policy: 'Path parameter used in I/O without validation',    sev: 'high',   risk: 49.0 },
  { id: 'CSDK-005', scope: 'tool',     policy: 'Tool raises exceptions without structured error contract', sev: 'medium', risk: 24.0 },
  { id: 'CSDK-006', scope: 'tool',     policy: 'Mutating tool has no idempotency key',             sev: 'medium', risk: 22.0 },
  { id: 'CSDK-007', scope: 'tool',     policy: 'Ambiguous tool name',                              sev: 'low',    risk: 13.5 },
  { id: 'CSDK-101', scope: 'agent',    policy: 'Claude subagent is granted the Bash tool',         sev: 'high',   risk: 56.0 },
  { id: 'CSDK-102', scope: 'agent',    policy: 'Claude subagent is granted the WebSearch tool',    sev: 'high',   risk: 56.0 },
  { id: 'CSDK-110', scope: 'subagent', policy: 'Subagent granted the built-in Bash tool',          sev: 'high',   risk: 63.0 },
];

const OPENAI_RULES: Rule[] = [
  { id: 'OAI-001', scope: 'tool',  policy: 'Tool function has no docstring',                         sev: 'low',    risk: 13.5 },
  { id: 'OAI-002', scope: 'tool',  policy: 'Tool function has no type-annotated parameters',         sev: 'medium', risk: 34.0 },
  { id: 'OAI-003', scope: 'tool',  policy: 'Tool sets strict_mode=False',                            sev: 'medium', risk: 38.0 },
  { id: 'OAI-005', scope: 'tool',  policy: 'Network call has no timeout',                            sev: 'high',   risk: 59.5 },
  { id: 'OAI-006', scope: 'tool',  policy: 'Tool accepts path without normalization',                sev: 'high',   risk: 49.0 },
  { id: 'OAI-012', scope: 'tool',  policy: 'Tool body spawns a subprocess',                         sev: 'high',   risk: 63.0 },
  { id: 'OAI-013', scope: 'tool',  policy: 'Tool body calls eval/exec/compile on dynamic input',    sev: 'high',   risk: 63.0 },
  { id: 'OAI-101', scope: 'agent', policy: 'Agent has no input_guardrails and wires shell tools',   sev: 'high',   risk: 59.5 },
  { id: 'OAI-102', scope: 'agent', policy: 'Agent uses tool_use_behavior="stop_on_first_tool"',     sev: 'high',   risk: 66.5 },
  { id: 'OAI-106', scope: 'agent', policy: 'Agent wires MCP servers without input_guardrails',      sev: 'high',   risk: 63.0 },
];

const GOOGLE_RULES: Rule[] = [
  { id: 'ADK-002', scope: 'tool',  policy: 'FunctionTool has no type-annotated parameters',          sev: 'medium', risk: 34.0 },
  { id: 'ADK-003', scope: 'tool',  policy: 'Network call has no timeout',                            sev: 'high',   risk: 59.5 },
  { id: 'ADK-004', scope: 'tool',  policy: 'Path parameter used in I/O without normalization',       sev: 'high',   risk: 49.0 },
  { id: 'ADK-005', scope: 'tool',  policy: 'Tool raises exceptions without structured error contract', sev: 'medium', risk: 24.0 },
  { id: 'ADK-008', scope: 'tool',  policy: 'BashTool missing shell metacharacter blocking',          sev: 'high',   risk: 63.0 },
  { id: 'ADK-101', scope: 'agent', policy: 'LlmAgent has no description',                            sev: 'medium', risk: 34.0 },
  { id: 'ADK-102', scope: 'agent', policy: 'Agent with BashTool has no before_tool_callback',        sev: 'high',   risk: 59.5 },
  { id: 'ADK-103', scope: 'agent', policy: 'Sub-agent is granted BashTool',                          sev: 'high',   risk: 63.0 },
  { id: 'ADK-104', scope: 'agent', policy: 'Agent has no safety_settings',                           sev: 'medium', risk: 30.0 },
  { id: 'ADK-105', scope: 'agent', policy: 'Agent uses web search without before_tool_callback',     sev: 'high',   risk: 59.5 },
];

function SevBadge({ sev }: { sev: 'high' | 'medium' | 'low' }) {
  const cls = sev === 'high'
    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
    : sev === 'medium'
    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    : 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20';
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${cls}`}>{sev}</span>;
}

const docCards = [
  { icon: Package,   title: 'Installation',   desc: 'Install via Homebrew, Scoop, Docker, or a direct binary download. Works on macOS, Linux, and Windows — no runtime dependencies.', href: `${DOCS_URL}/installation/`, label: 'docs/installation' },
  { icon: Zap,       title: 'Quick Start',    desc: 'Run your first scan in two commands. Trustabl reads your repo, discovers every agent and tool, and produces a deterministic reliability report.', href: `${DOCS_URL}/quick-start/`, label: 'docs/quick-start' },
  { icon: Target,    title: 'Use Cases',      desc: 'Gate agent code in CI, annotate pull requests with GitHub Code Scanning (SARIF), run pre-release audits, or scan third-party dependency repos.', href: `${DOCS_URL}/use-cases/`, label: 'docs/use-cases' },
  { icon: Building2, title: 'Architecture',   desc: 'A flat, deterministic pipeline: recon → inventory → policy selection → analysis → scoring. Identical inputs always produce identical output.', href: `${DOCS_URL}/how-it-works/architecture/`, label: 'docs/how-it-works' },
  { icon: Map,       title: 'Coverage',       desc: 'Full SDK-by-language coverage matrix. Claude SDK, OpenAI Agents SDK, Google ADK, MCP tool registrations, and shell-invocation risk surface.', href: `${DOCS_URL}/coverage/`, label: 'docs/coverage' },
  { icon: FileText,  title: 'Output Formats', desc: 'Human-readable terminal output, structured JSON for pipelines, and SARIF 2.1.0 for GitHub Code Scanning annotations with stable fingerprints.', href: `${DOCS_URL}/output-formats/`, label: 'docs/output-formats' },
  { icon: Terminal,  title: 'CLI Reference',  desc: 'Every flag, command, and exit code. trustabl scan, trustabl rules pull, output control, strict mode, and more.', href: `${DOCS_URL}/cli-reference/`, label: 'docs/cli-reference' },
  { icon: BookOpen,  title: 'Rule Index',     desc: 'Every check Trustabl runs, across all supported SDKs — each with the threat model behind it, risk score, confidence level, and link to its YAML source.', href: `${DOCS_URL}/rules/`, label: 'docs/rules' },
];

const useCases = [
  { tag: 'CI / CD', tagCls: 'bg-[#2DD4BF]/8 text-[#2DD4BF] border-[#2DD4BF]/25', title: 'Gate Agent Code in CI', desc: 'Use exit codes as a contract: 0 = clean, 1 = findings ≥ medium, 2 = scanner error. The gate never flakes — identical commits always yield identical results.' },
  { tag: 'GitHub', tagCls: 'bg-[#2DD4BF]/8 text-[#2DD4BF] border-[#2DD4BF]/25', title: 'PR Annotations via SARIF', desc: 'Emit SARIF 2.1.0 and upload with codeql-action/upload-sarif. Findings surface as inline PR annotations with stable fingerprints — no duplicates across runs.' },
  { tag: 'Security', tagCls: 'bg-red-500/8 text-red-400 border-red-500/25', title: 'Pre-Release Safety Audit', desc: 'Catch shell-out tools missing human-approval, network calls without timeouts, agents without guardrails, and project-wide bypassPermissions before shipping.' },
  { tag: 'Baseline', tagCls: 'bg-[#2DD4BF]/8 text-[#2DD4BF] border-[#2DD4BF]/25', title: 'Inventory Existing Codebases', desc: 'Point Trustabl at an established repo to get a structured inventory of all agents, tools, guardrails, subagents, and MCP servers — with an overall score to improve against.' },
  { tag: 'Supply Chain', tagCls: 'bg-amber-500/8 text-amber-400 border-amber-500/25', title: 'Audit Third-Party Repos', desc: 'Assess a dependency before adopting it. Scanning is read-only and works straight from a URL: trustabl scan https://github.com/org/their-agent-repo' },
  { tag: 'Offline', tagCls: 'bg-red-500/8 text-red-400 border-red-500/25', title: 'Air-Gapped Environments', desc: 'Pre-fetch rule packs with trustabl rules pull where you have connectivity. Then scan offline with --no-rules-update — no network access needed.' },
];

type RulesTab = 'claude' | 'openai' | 'google';
const RULES_MAP: Record<RulesTab, Rule[]> = { claude: CLAUDE_RULES, openai: OPENAI_RULES, google: GOOGLE_RULES };
const RULES_LINKS: Record<RulesTab, string> = {
  claude: `${DOCS_URL}/rules/claude_sdk/POLICY_INDEX/`,
  openai: `${DOCS_URL}/rules/openai_sdk/POLICY_INDEX/`,
  google: `${DOCS_URL}/rules/google_adk/POLICY_INDEX/`,
};

export default function DocsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [rulesTab, setRulesTab] = useState<RulesTab>('claude');

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050506] text-white">
      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="scrollLeft"], [style*="scrollRight"] { animation: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#050506]/85 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <Link href="/" className="justify-self-start">
            <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} priority className="h-7 w-auto" />
          </Link>

          <div className="hidden items-center justify-center gap-8 text-sm font-medium text-gray-400 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith('http') ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-white text-white">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className="transition-colors duration-200 hover:text-white">
                  {link.label}
                </Link>
              )
            )}
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
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              className="rounded-xl bg-[#2DD4BF] px-5 py-2 text-sm font-medium text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]">
              Try It
            </a>
          </div>

          <button className="justify-self-end text-gray-400 transition-colors hover:text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/5 bg-[#050506]/98 px-4 py-5 backdrop-blur-md md:hidden">
            <div className="space-y-4">
              {navLinks.map((link) =>
                link.href.startsWith('http') ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-white" onClick={() => setMenuOpen(false)}>{link.label}</a>
                ) : (
                  <Link key={link.label} href={link.href} className="block text-sm font-medium text-gray-400 transition-colors hover:text-white" onClick={() => setMenuOpen(false)}>{link.label}</Link>
                )
              )}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                className="block rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-center text-sm font-medium text-[#08121F]">
                Try It
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="page-transition pt-16">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/8 pb-24 pt-24 text-center md:pt-32">
          <div className="absolute inset-0 pointer-events-none">
            <HeroParticles />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DD4BF]" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">Documentation</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-6xl">
              Static Analyzer for<br />
              <span className="text-[#2DD4BF]">Agent Reliability</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-gray-400 md:text-xl">
              Trustabl scans any AI agent repo — Claude SDK, OpenAI Agents SDK, or Google ADK — and reports reliability and safety weaknesses before they reach production.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href={DOCS_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-7 py-3.5 text-sm font-semibold text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]">
                Read the Docs →
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#2DD4BF]/40 hover:text-[#2DD4BF]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                View on GitHub
              </a>
            </div>

            {/* Carousel */}
            <div className="mx-auto mt-12 max-w-4xl space-y-2.5">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-gray-500">A few of the checks Trustabl runs</p>
              <Carousel items={ROW1} />
              <Carousel items={ROW2} reverse />
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="border-b border-white/8 bg-[#050506] reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 divide-x divide-white/8 md:grid-cols-5">
              {[
                { num: 'Read-only', label: 'Never writes to your repo' },
                { num: 'Deterministic', label: 'Identical inputs, identical output' },
                { num: 'Py + TS', label: 'Languages analyzed' },
                { num: 'MCP', label: 'Servers, tools & plugins' },
                { num: 'SARIF', label: 'Plus JSON & terminal output' },
              ].map((s) => (
                <div key={s.label} className="px-6 py-8 text-center">
                  <p className="text-lg font-semibold text-white">{s.num}</p>
                  <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COVERAGE */}
        <section className="border-b border-white/8 py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Coverage</p>
            <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Built for Every Major Agent SDK — and MCP</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
              Trustabl audits the major agent SDKs and MCP servers. It&apos;s honest about its blind spots, emitting an explicit &quot;unaudited SDK&quot; finding rather than a falsely clean result.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { dot: 'bg-[#2DD4BF]', name: 'Claude Agent SDK', langs: ['Python', 'TypeScript'], desc: 'Tools, agents, and subagents — checked for reliability and safety across the SDK surface.', href: `${DOCS_URL}/rules/claude_sdk/POLICY_INDEX/`, label: 'View Claude rules' },
                { dot: 'bg-emerald-400', name: 'OpenAI Agents SDK', langs: ['Python', 'TypeScript'], desc: 'Tools, agents, and project-wide configuration — checked for reliability and safety.', href: `${DOCS_URL}/rules/openai_sdk/POLICY_INDEX/`, label: 'View OpenAI rules' },
                { dot: 'bg-red-400', name: 'Google ADK', langs: ['Python', 'JavaScript', 'Go', 'Java'], desc: 'Function tools and LlmAgents — checked for reliability and safety across all supported languages.', href: `${DOCS_URL}/rules/google_adk/POLICY_INDEX/`, label: 'View ADK rules' },
                { dot: 'bg-violet-400', name: 'MCP', langs: ['TypeScript', 'Go', 'Rust'], desc: 'MCP server tool registrations and config files — audited by a dedicated MCP rule pack.', href: `${DOCS_URL}/rules/`, label: 'View MCP rules' },
              ].map((sdk) => (
                <div key={sdk.name} className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-[#2DD4BF]/30">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${sdk.dot}`} />
                    <span className="font-semibold text-white">{sdk.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sdk.langs.map((l) => (
                      <span key={l} className="rounded-md border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[11px] text-gray-400">{l}</span>
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-gray-400">{sdk.desc}</p>
                  <a href={sdk.href} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-[#2DD4BF] transition-colors hover:text-white">
                    {sdk.label} →
                  </a>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Every rule is scoped to where the risk lives — tool, agent, subagent, or repo. See the{' '}
              <a href={`${DOCS_URL}/coverage/`} target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">full coverage matrix</a>.
            </p>
          </div>
        </section>

        {/* DOC CARDS */}
        <section className="border-b border-white/8 py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Documentation</p>
            <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Everything You Need to Get Running</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-400">From your first install to CI pipelines and rule authoring — all in one place.</p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {docCards.map((card) => (
                <a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-all hover:border-[#2DD4BF]/30 hover:bg-white/[0.05]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.05] text-[#2DD4BF]">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{card.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-400">{card.desc}</p>
                  <span className="text-[11px] text-[#2DD4BF] transition-colors group-hover:text-white">{card.label} →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="border-b border-white/8 py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Use Cases</p>
            <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Built for the Full Agent Lifecycle</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-400">From CI gates to air-gapped offline environments — Trustabl fits every workflow without writing a single file to your repo.</p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc) => (
                <div key={uc.title} className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-white/15">
                  <span className={`w-fit rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${uc.tagCls}`}>{uc.tag}</span>
                  <h3 className="font-semibold text-white">{uc.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RULES TABLE */}
        <section className="border-b border-white/8 py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Rule Index</p>
            <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Detection Rules for Every Major Agent SDK</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
              Every rule ships with a threat model, risk score, and confidence rating. The{' '}
              <a href={`${DOCS_URL}/rules/`} target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">live rule index</a>{' '}
              is always the complete, up-to-date source of truth.
            </p>

            <div className="mt-10 overflow-hidden rounded-3xl border border-white/8">
              {/* Tabs */}
              <div className="flex border-b border-white/8 bg-white/[0.02]">
                {(['claude', 'openai', 'google'] as RulesTab[]).map((tab) => (
                  <button key={tab} onClick={() => setRulesTab(tab)}
                    className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors ${rulesTab === tab ? 'border-b-2 border-[#2DD4BF] text-[#2DD4BF]' : 'text-gray-500 hover:text-gray-300'}`}>
                    {tab === 'claude' ? 'Claude SDK' : tab === 'openai' ? 'OpenAI SDK' : 'Google ADK'}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500 whitespace-nowrap">ID</th>
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500">Scope</th>
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500">Policy</th>
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500">Severity</th>
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RULES_MAP[rulesTab].map((rule, i) => (
                      <tr key={rule.id} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i === RULES_MAP[rulesTab].length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-5 py-3 text-[12px] text-[#2DD4BF] whitespace-nowrap">{rule.id}</td>
                        <td className="px-5 py-3 text-gray-500">{rule.scope}</td>
                        <td className="px-5 py-3 text-gray-300">{rule.policy}</td>
                        <td className="px-5 py-3"><SevBadge sev={rule.sev} /></td>
                        <td className="px-5 py-3 text-gray-500">{rule.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-white/8 px-5 py-4">
                <span className="text-xs text-gray-500">Showing a sample of the {rulesTab === 'claude' ? 'Claude SDK' : rulesTab === 'openai' ? 'OpenAI SDK' : 'Google ADK'} checks</span>
                <a href={RULES_LINKS[rulesTab]} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-[#2DD4BF] transition-colors hover:text-white">
                  Full index →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 text-center lg:py-32 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Trustabl = Trustworthy + Reliable</p>
            <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Read the Docs. Secure Your Agents.</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-gray-400">Read-only. Deterministic. Open source. Dive into the full documentation to get started.</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href={DOCS_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-7 py-3.5 text-sm font-semibold text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]">
                Read the Docs →
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#2DD4BF]/40 hover:text-[#2DD4BF]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/8 py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="inline-flex items-center">
              <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} className="h-6 w-auto opacity-60" />
            </Link>
            <p className="text-xs text-gray-500">© 2026 Trustabl</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroParticles from '@/components/HeroParticles';
import PreReleaseBanner from '@/components/PreReleaseBanner';
import { useGithubStars } from '@/hooks/useGithubStars';
import Footer from '@/components/Footer';

const GITHUB_URL = 'https://github.com/trustabl/trustabl';

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/products' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
];

const frameworks = [
  'Claude Agent SDK',
  'OpenAI Agents SDK',
  'Google ADK',
  'LangGraph',
  'LangChain',
  'CrewAI',
  'Pydantic AI',
  'AutoGen',
  'Vercel AI SDK',
  'No framework / built from scratch',
];

const languages = [
  'Python',
  'TypeScript / JavaScript',
  'Go',
  'Java / Kotlin',
];

const runtimes = [
  'Locally / on a developer machine',
  'A backend server we manage (VM, bare metal)',
  'Serverless (AWS Lambda, Google Cloud Run, Azure Functions)',
  'Containers (ECS, Kubernetes, Fargate)',
  'A PaaS (Vercel, Render, Railway, Fly.io)',
  'A managed agent platform',
];

const ciOptions = [
  'GitHub Actions',
  'GitLab CI',
  'Jenkins',
  'Bitbucket Pipelines',
  'Manual deploy / no CI',
];

const stages = [
  'Just experimenting / prototyping',
  'Testing internally',
  'In production',
];

const featureCategories = [
  {
    category: 'Reliability — stop agents from breaking',
    items: [
      { id: 'retry-safety', label: 'Retry safety', desc: 'Flags whether a tool is safe to retry so your agent won\'t double-charge or duplicate actions' },
      { id: 'error-catalog', label: 'Error catalog', desc: 'Common errors + how to fix them, so the agent recovers instead of looping' },
      { id: 'timeouts-fallbacks', label: 'Timeouts & fallbacks', desc: 'What the agent should do when a tool hangs or fails' },
    ],
  },
  {
    category: 'Smarter tool selection',
    items: [
      { id: 'when-to-use', label: 'When to use / when NOT to use', desc: 'Clear rules so the agent picks the right tool' },
      { id: 'tool-purpose', label: 'Tool purpose', desc: 'A plain one-liner on what each tool is actually for' },
      { id: 'prompt-snippets', label: 'Prompt snippets', desc: 'Copy-paste tool descriptions for your system prompt' },
    ],
  },
  {
    category: 'Input & output safety',
    items: [
      { id: 'input-validation', label: 'Input validation rules', desc: 'Blocks malformed or invalid tool calls before they run' },
      { id: 'output-schema', label: 'Output schema', desc: 'Predictable, structured responses your agent can rely on' },
    ],
  },
  {
    category: 'Visibility — know what your agent is doing',
    items: [
      { id: 'tracing', label: 'Tracing (OTEL)', desc: 'See every step the agent took' },
      { id: 'structured-logging', label: 'Structured logging', desc: 'Clean logs with automatic PII redaction' },
      { id: 'usage-metrics', label: 'Usage metrics', desc: 'Counts, latencies, and failure rates per tool' },
    ],
  },
  {
    category: 'Safety, policy & compliance',
    items: [
      { id: 'approval-gates', label: 'Approval gates', desc: 'Require human sign-off for risky actions (e.g. refunds over $5K)' },
      { id: 'risk-level', label: 'Risk level', desc: 'Flags how risky each tool is to call' },
      { id: 'data-pii', label: 'Data / PII handling', desc: 'How sensitive data is classified and protected' },
      { id: 'audit-logs', label: 'Audit logs', desc: 'Compliance-ready logging on every call' },
    ],
  },
  {
    category: 'Trust & provenance',
    items: [
      { id: 'signing', label: 'Signing / attestation', desc: 'Tamper-proof proof of what a tool is and does (Sigstore)' },
      { id: 'openshell', label: 'OpenShell sandbox policies', desc: 'Auto-generate least-privilege runtime policies' },
    ],
  },
  {
    category: 'Compatibility & exports',
    items: [
      { id: 'export-formats', label: 'Export formats', desc: 'Ready-to-use MCP / OpenAI / Claude / LangChain / GitAgent definitions' },
    ],
  },
  {
    category: 'Cost & performance',
    items: [
      { id: 'cost-per-call', label: 'Cost per call estimate', desc: 'See roughly what each tool costs (USD / tokens)' },
      { id: 'latency-profile', label: 'Latency profile', desc: 'Expected speed of each tool' },
      { id: 'caching', label: 'Caching recommendations', desc: 'Cut repeat calls and save tokens' },
    ],
  },
];

const MAX_FEATURES = 5;

export default function SurveyPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const starCount = useGithubStars();

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [otherFramework, setOtherFramework] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [otherLanguage, setOtherLanguage] = useState('');
  const [tools, setTools] = useState('');
  const [mcp, setMcp] = useState<string | null>(null);
  const [selectedRuntimes, setSelectedRuntimes] = useState<string[]>([]);
  const [otherRuntime, setOtherRuntime] = useState('');
  const [selectedCi, setSelectedCi] = useState<string[]>([]);
  const [otherCi, setOtherCi] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [otherFeature, setOtherFeature] = useState('');
  const [breakQuestion, setBreakQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  function toggleFeature(id: string) {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else if (selectedFeatures.length < MAX_FEATURES) {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

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
              <Link key={link.label} href={link.href} className="transition-colors duration-200 hover:text-white">
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
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs tabular-nums">{starCount}</span>
              )}
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="justify-self-end text-gray-400 md:hidden" aria-label="Toggle menu">
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/5 bg-[#050506]/95 px-4 py-4 md:hidden">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="block py-2 text-sm text-gray-400 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <PreReleaseBanner />

      {/* HERO */}
      <section className="relative pt-36 pb-16 sm:pt-40">
        <HeroParticles />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Help shape what Trustabl builds next
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
            We're adding new fields and checks to the Agent Analyzer, and we want to build them in the order you actually need. Takes about 2 minutes.
          </p>
          <p className="mt-3 text-sm text-gray-500 italic">
            We're only asking about your setup and which features matter to you — never your code or your repos.
          </p>
        </div>
      </section>

      {submitted ? (
        <section className="relative z-10 mx-auto max-w-2xl px-4 pb-32 text-center sm:px-6">
          <div className="rounded-3xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/5 p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2DD4BF]/10">
              <svg className="h-8 w-8 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Thanks for your input!</h2>
            <p className="mt-3 text-gray-400">
              Your responses help us prioritize the right features. We'll let you know when the things you picked go live.
            </p>
            <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#2DD4BF]/90">
              Back to home
            </Link>
          </div>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 mx-auto max-w-3xl px-4 pb-32 sm:px-6">

          {/* SECTION 1 — Setup */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold">Tell us about your setup</h2>
              <div className="mt-1 h-px bg-gradient-to-r from-[#2DD4BF]/40 to-transparent" />
            </div>

            {/* Q1 Frameworks */}
            <fieldset>
              <legend className="text-base font-semibold">
                1. What framework(s) are you using to build your agents?
                <span className="ml-2 text-sm font-normal text-gray-500">pick all that apply</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {frameworks.map((fw) => (
                  <label key={fw} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${selectedFrameworks.includes(fw) ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/5 text-white' : 'border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/20'}`}>
                    <input
                      type="checkbox"
                      checked={selectedFrameworks.includes(fw)}
                      onChange={() => toggleItem(selectedFrameworks, fw, setSelectedFrameworks)}
                      className="sr-only"
                    />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selectedFrameworks.includes(fw) ? 'border-[#2DD4BF] bg-[#2DD4BF]' : 'border-white/20'}`}>
                      {selectedFrameworks.includes(fw) && (
                        <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {fw}
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-300 hover:border-white/20 sm:col-span-2">
                  <span className="shrink-0 text-gray-500">Other:</span>
                  <input
                    type="text"
                    value={otherFramework}
                    onChange={(e) => setOtherFramework(e.target.value)}
                    placeholder="e.g. Haystack, Semantic Kernel…"
                    className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
                  />
                </label>
              </div>
            </fieldset>

            {/* Q2 Languages */}
            <fieldset>
              <legend className="text-base font-semibold">
                2. What language(s) are your agents written in?
                <span className="ml-2 text-sm font-normal text-gray-500">pick all that apply</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {languages.map((lang) => (
                  <label key={lang} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${selectedLanguages.includes(lang) ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/5 text-white' : 'border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/20'}`}>
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => toggleItem(selectedLanguages, lang, setSelectedLanguages)}
                      className="sr-only"
                    />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selectedLanguages.includes(lang) ? 'border-[#2DD4BF] bg-[#2DD4BF]' : 'border-white/20'}`}>
                      {selectedLanguages.includes(lang) && (
                        <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {lang}
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-300 hover:border-white/20 sm:col-span-2">
                  <span className="shrink-0 text-gray-500">Other:</span>
                  <input
                    type="text"
                    value={otherLanguage}
                    onChange={(e) => setOtherLanguage(e.target.value)}
                    placeholder="e.g. Rust, C#…"
                    className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
                  />
                </label>
              </div>
            </fieldset>

            {/* Q3 Tools & MCP */}
            <fieldset>
              <legend className="text-base font-semibold">
                3. What tools or integrations do your agents use?
              </legend>
              <p className="mt-1 text-sm text-gray-500">e.g. internal APIs, databases, Slack, payment/refunds, search, email…</p>
              <textarea
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                rows={3}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#2DD4BF]/50 focus:outline-none focus:ring-1 focus:ring-[#2DD4BF]/30"
                placeholder="List the tools and integrations your agents connect to…"
              />
              <p className="mt-4 text-sm font-medium text-gray-300">Do you connect any of these via MCP (Model Context Protocol)?</p>
              <div className="mt-3 flex gap-3">
                {['Yes', 'No', 'Not sure'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMcp(opt)}
                    className={`rounded-xl border px-5 py-2 text-sm font-medium transition-all ${mcp === opt ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Q4 Runtime */}
            <fieldset>
              <legend className="text-base font-semibold">
                4. Where do your agents actually run?
                <span className="ml-2 text-sm font-normal text-gray-500">pick all that apply</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {runtimes.map((rt) => (
                  <label key={rt} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${selectedRuntimes.includes(rt) ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/5 text-white' : 'border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/20'}`}>
                    <input
                      type="checkbox"
                      checked={selectedRuntimes.includes(rt)}
                      onChange={() => toggleItem(selectedRuntimes, rt, setSelectedRuntimes)}
                      className="sr-only"
                    />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selectedRuntimes.includes(rt) ? 'border-[#2DD4BF] bg-[#2DD4BF]' : 'border-white/20'}`}>
                      {selectedRuntimes.includes(rt) && (
                        <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {rt}
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-300 hover:border-white/20 sm:col-span-2">
                  <span className="shrink-0 text-gray-500">Other:</span>
                  <input
                    type="text"
                    value={otherRuntime}
                    onChange={(e) => setOtherRuntime(e.target.value)}
                    placeholder="e.g. Edge workers, on-prem…"
                    className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
                  />
                </label>
              </div>
            </fieldset>

            {/* Q5 CI/CD */}
            <fieldset>
              <legend className="text-base font-semibold">
                5. How do you ship changes to your agents?
                <span className="ml-2 text-sm font-normal text-gray-500">pick all that apply — optional</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ciOptions.map((ci) => (
                  <label key={ci} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${selectedCi.includes(ci) ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/5 text-white' : 'border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/20'}`}>
                    <input
                      type="checkbox"
                      checked={selectedCi.includes(ci)}
                      onChange={() => toggleItem(selectedCi, ci, setSelectedCi)}
                      className="sr-only"
                    />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selectedCi.includes(ci) ? 'border-[#2DD4BF] bg-[#2DD4BF]' : 'border-white/20'}`}>
                      {selectedCi.includes(ci) && (
                        <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {ci}
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-300 hover:border-white/20 sm:col-span-2">
                  <span className="shrink-0 text-gray-500">Other:</span>
                  <input
                    type="text"
                    value={otherCi}
                    onChange={(e) => setOtherCi(e.target.value)}
                    placeholder="e.g. ArgoCD, Terraform…"
                    className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
                  />
                </label>
              </div>
            </fieldset>

            {/* Q6 Stage */}
            <fieldset>
              <legend className="text-base font-semibold">
                6. What stage are your agents at?
                <span className="ml-2 text-sm font-normal text-gray-500">pick all that apply</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {stages.map((s) => (
                  <label key={s} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${selectedStages.includes(s) ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/5 text-white' : 'border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/20'}`}>
                    <input
                      type="checkbox"
                      checked={selectedStages.includes(s)}
                      onChange={() => toggleItem(selectedStages, s, setSelectedStages)}
                      className="sr-only"
                    />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selectedStages.includes(s) ? 'border-[#2DD4BF] bg-[#2DD4BF]' : 'border-white/20'}`}>
                      {selectedStages.includes(s) && (
                        <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* SECTION 2 — What we already do */}
          <div className="mt-20 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">What we already do</h2>
              <div className="mt-1 h-px bg-gradient-to-r from-[#2DD4BF]/40 to-transparent" />
            </div>
            <p className="text-sm text-gray-400">Quick context before you choose. Trustabl already scans your tools and generates the basics automatically:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Production readiness score', desc: 'For each tool' },
                { title: 'Input validation & clean schemas', desc: 'MCP / OpenAI / Claude compatible' },
                { title: 'Retry & idempotency safety', desc: 'Built-in resilience checks' },
                { title: 'Core documentation & examples', desc: 'Auto-generated from your tools' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Now we want to know what to deepen and add next.</p>
          </div>

          {/* SECTION 3 — Pick your top 5 */}
          <div className="mt-20 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Pick your top 5</h2>
              <div className="mt-1 h-px bg-gradient-to-r from-[#2DD4BF]/40 to-transparent" />
            </div>
            <p className="text-sm text-gray-400">
              Out of everything below, which 5 would help you the most right now?
              <span className="ml-1 text-gray-500">Don't overthink it — pick the ones that match your real pain.</span>
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <span className={`text-sm font-semibold tabular-nums ${selectedFeatures.length >= MAX_FEATURES ? 'text-[#2DD4BF]' : 'text-gray-400'}`}>
                {selectedFeatures.length} / {MAX_FEATURES}
              </span>
              <span className="text-sm text-gray-500">selected</span>
              <div className="ml-auto flex gap-1">
                {Array.from({ length: MAX_FEATURES }).map((_, i) => (
                  <div key={i} className={`h-2 w-6 rounded-full transition-colors ${i < selectedFeatures.length ? 'bg-[#2DD4BF]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            {featureCategories.map((cat) => (
              <div key={cat.category}>
                <h3 className="mb-3 text-sm font-semibold text-gray-300">{cat.category}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => {
                    const selected = selectedFeatures.includes(item.id);
                    const disabled = !selected && selectedFeatures.length >= MAX_FEATURES;
                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${selected ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/5' : disabled ? 'cursor-not-allowed border-white/5 bg-white/[0.01] opacity-40' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleFeature(item.id)}
                          disabled={disabled}
                          className="sr-only"
                        />
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected ? 'border-[#2DD4BF] bg-[#2DD4BF]' : 'border-white/20'}`}>
                          {selected && (
                            <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <div>
                          <span className="font-medium text-white">{item.label}</span>
                          <span className="ml-2 text-gray-500">— {item.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-300">Something we're missing?</h3>
              <input
                type="text"
                value={otherFeature}
                onChange={(e) => setOtherFeature(e.target.value)}
                placeholder="Tell us what else you need…"
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#2DD4BF]/50 focus:outline-none focus:ring-1 focus:ring-[#2DD4BF]/30"
              />
            </div>
          </div>

          {/* SECTION 4 — Open question */}
          <div className="mt-20 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">One open question</h2>
              <div className="mt-1 h-px bg-gradient-to-r from-[#2DD4BF]/40 to-transparent" />
            </div>
            <div>
              <label className="text-base font-semibold">
                What's the #1 thing that breaks your agents in production?
              </label>
              <textarea
                value={breakQuestion}
                onChange={(e) => setBreakQuestion(e.target.value)}
                rows={3}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#2DD4BF]/50 focus:outline-none focus:ring-1 focus:ring-[#2DD4BF]/30"
                placeholder="What breaks most often? What's hardest to debug?"
              />
            </div>
          </div>

          {/* SECTION 5 — Early access */}
          <div className="mt-20 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Want early access?</h2>
              <div className="mt-1 h-px bg-gradient-to-r from-[#2DD4BF]/40 to-transparent" />
            </div>
            <p className="text-sm text-gray-400">
              Want first access to the fields you picked once we ship them? Drop your email (optional) and we'll let you know — and tell you when your requests go live.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#2DD4BF]/50 focus:outline-none focus:ring-1 focus:ring-[#2DD4BF]/30"
            />
          </div>

          {/* SUBMIT */}
          <div className="mt-12 flex justify-center">
            <button
              type="submit"
              className="rounded-xl bg-[#2DD4BF] px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-[#2DD4BF]/90 hover:shadow-lg hover:shadow-[#2DD4BF]/20"
            >
              Submit survey
            </button>
          </div>
        </form>
      )}

      <Footer />
    </div>
  );
}

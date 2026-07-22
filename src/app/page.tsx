'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Terminal,
  Zap,
  Monitor, Wrench, FileText, Cpu, Code2, Link2,
  ChevronDown, ChevronRight, PlayCircle, X, Maximize2,
  TrendingUp, Search, ShieldCheck, DollarSign, Package, Settings2,
  KeyRound, AlertTriangle,
} from 'lucide-react';
import HeroParticles from '@/components/HeroParticles';
import IdeWindow from '@/components/IdeWindow';
import Footer from '@/components/Footer';

const githubRepoUrl = 'https://github.com/trustabl';
const DOCS_URL = 'https://trustabl.github.io/trustabl-docs';

// ── Rules data ──
const RULE_CATEGORIES = [
  { category: 'Tool definition',   example: 'Missing tool description causing incorrect LLM selection' },
  { category: 'Input validation',  example: 'User-controlled parameter passed without validation' },
  { category: 'Shell safety',      example: 'Shell command built from unsanitized input' },
  { category: 'Path safety',       example: 'Path traversal vulnerability in file tool' },
  { category: 'Network',           example: 'HTTP request without timeout or SSRF protection' },
  { category: 'Retry logic',       example: "Duplicate execution because retries aren't idempotent" },
  { category: 'Error handling',    example: 'Exception swallowed, agent silently fails' },
  { category: 'Observability',     example: 'Missing traces, logs, or token cost reporting' },
  { category: 'Guardrails',        example: 'Dangerous tool callable without approval' },
  { category: 'Repository hygiene', example: 'SDK version drift, missing configuration, stale metadata' },
  { category: 'Specialized',       example: 'Framework-specific issues across Claude SDK, OpenAI Agents SDK, Google ADK, MCP, Skills, OpenShell' },
];

/* ── Score ring (card #3) ── */
function ScoreRing({ tick }: { tick: number }) {
  const [score, setScore] = useState(38);

  useEffect(() => {
    let intervalId: number | undefined;
    const resetId = window.setTimeout(() => {
      setScore(38);
    }, 0);
    const delayId = window.setTimeout(() => {
      let s = 38;
      intervalId = window.setInterval(() => {
        s = Math.min(s + 1, 91);
        setScore(s);
        if (s >= 91 && intervalId) clearInterval(intervalId);
      }, 40);
    }, 700);
    return () => {
      window.clearTimeout(resetId);
      window.clearTimeout(delayId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [tick]);

  const R = 28;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? '#2DD4BF' : score >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex h-36 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-white/8 bg-[#0A0A0C]">
      <div className="relative">
        <svg width="68" height="68" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
          <circle cx="34" cy="34" r={R} fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 34 34)"
            style={{ transition: 'stroke-dashoffset 0.08s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-black" style={{ color }}>{score}%</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-gray-500">Production Score</span>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scanTick, setScanTick] = useState(0);
  const [atmModal, setAtmModal] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const demoVideoRef = useRef<HTMLDivElement>(null);
  const handleDemoFullscreen = () => {
    demoVideoRef.current?.requestFullscreen?.();
  };
  useEffect(() => {
    const iv = setInterval(() => setScanTick(t => t + 1), 7000);
    return () => clearInterval(iv);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Product', href: '/products' },
    { label: 'Docs', href: '/docs' },
    { label: 'Blog', href: '/blog' },
  ];

  const trustLogoItems = [
    {
      name: 'GitHub',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: 'Claude',
      icon: (
        <span
          aria-hidden="true"
          className="block h-5 w-5 bg-current"
          style={{
            WebkitMaskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg)',
            maskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ),
    },
    {
      name: 'OpenAI',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0L4.01 14.23a4.5 4.5 0 01-1.671-6.334zm16.55 3.868l-5.814-3.355 2.02-1.168a.076.076 0 01.071 0l4.808 2.773a4.5 4.5 0 01-.676 8.123v-5.68a.795.795 0 00-.408-.693zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.37 9.24V6.908a.077.077 0 01.032-.063l4.808-2.77a4.5 4.5 0 016.142 1.633 4.48 4.48 0 01.537 3.026zm-12.67 4.161l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08L8.704 5.46a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
      ),
    },
    {
      name: 'LangGraph',
      icon: (
        <span
          aria-hidden="true"
          className="block h-5 w-5 bg-current"
          style={{
            WebkitMaskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/langgraph.svg)',
            maskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/langgraph.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ),
    },
    {
      name: 'CrewAI',
      icon: (
        <span
          aria-hidden="true"
          className="block h-5 w-5 bg-current"
          style={{
            WebkitMaskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/crewai.svg)',
            maskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/crewai.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ),
    },
    {
      name: 'OpenShell',
      icon: <Terminal className="h-5 w-5" />,
    },
    {
      name: 'MCP',
      icon: (
        <span
          aria-hidden="true"
          className="block h-5 w-5 bg-current"
          style={{
            WebkitMaskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/mcp.svg)',
            maskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/mcp.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ),
    },
    {
      name: 'Microsoft',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.4 2H2v9.4h9.4V2zm10.6 0h-9.4v9.4H22V2zM11.4 12.6H2V22h9.4v-9.4zm10.6 0h-9.4V22H22v-9.4z"/>
        </svg>
      ),
    },
    {
      name: 'VS Code',
      icon: (
        <span
          aria-hidden="true"
          className="block h-5 w-5 bg-current"
          style={{
            WebkitMaskImage: 'url(/visual-studio-code-svgrepo-com.svg)',
            maskImage: 'url(/visual-studio-code-svgrepo-com.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ),
    },
    {
      name: 'Cursor',
      icon: (
        <span
          aria-hidden="true"
          className="block h-5 w-5 bg-current"
          style={{
            WebkitMaskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/cursor.svg)',
            maskImage: 'url(https://unpkg.com/@lobehub/icons-static-svg@latest/icons/cursor.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ),
    },
  ];

  const atmComponents = [
    {
      id: 'llm',
      title: 'LLM Model',
      tagline: "Rich ATM dramatically improves how the model understands and uses tools.",
      preview: [
        'Higher Tool-Calling Accuracy — precise schemas reduce hallucinations and invalid calls.',
        'Better Context Efficiency — right tool, fewer reasoning tokens.',
        'Stronger Guardrails — risk_level and approval_gates prevent bad calls proactively.',
      ],
      bullets: [
        { head: 'Higher Tool-Calling Accuracy', body: 'Precise input_schema, parameter_details, and validation_rules give the model clear constraints and examples, dramatically reducing hallucinations and invalid parameter calls.' },
        { head: 'Better Context Efficiency', body: 'Rich purpose, when_to_use, and prompt_snippets allow the model to select the right tool faster with less reasoning tokens.' },
        { head: 'Fewer Retry Loops', body: 'retry_policy, idempotency, and error_handling metadata lets the model understand when and how to retry intelligently instead of blindly looping.' },
        { head: 'Stronger Guardrails at Inference Time', body: 'risk_level, when_not_to_use, and approval_gates help the model avoid dangerous or inappropriate tool calls proactively.' },
        { head: 'Improved Few-Shot Performance', body: 'High-quality usage_examples and anti_patterns provide better in-context learning than generic tool descriptions.' },
        { head: 'Reduced Token Waste', body: 'Structured error_catalog and graceful_degradation let the model recover from failures without needing extra clarification turns.' },
      ],
    },
    {
      id: 'agent',
      title: 'Agent',
      tagline: 'The agent becomes far more reliable and autonomous with rich ATM.',
      preview: [
        'Self-Healing Behavior — recover from failures without human intervention.',
        'Higher Success Rate — prevents calling the wrong tool at the wrong time.',
        'Stronger Compliance — every action logged correctly for regulated environments.',
      ],
      bullets: [
        { head: 'Self-Healing & Self-Correcting Behavior', body: 'error_handling, retry_policy, and graceful_degradation metadata enable the agent to recover from failures without human intervention.' },
        { head: 'Dramatically Higher Success Rate', body: 'when_to_use / when_not_to_use + applicability rules prevent the #1 cause of agent failure: calling the wrong tool at the wrong time.' },
        { head: 'Resilient Execution', body: 'idempotency, side_effects, and retry_policy allow safe retries and prevent duplicate or destructive actions.' },
        { head: 'Better Long-Running Reliability', body: 'timeout, circuit_breaker, and scalability_notes help the agent manage slow or rate-limited tools gracefully.' },
        { head: 'Improved Decision Quality', body: 'risk_level, approval_gates, and decision_audit_fields give the agent the context it needs to escalate high-risk actions appropriately.' },
        { head: 'Lower Operational Cost', body: 'cost_profile and caching_strategy enable smarter routing and caching decisions at runtime.' },
        { head: 'Stronger Compliance & Auditability', body: 'audit_log_schema, compliance_flags, and data_handling ensure every action is logged correctly for regulated environments.' },
      ],
    },
    {
      id: 'devtools',
      title: 'Developer Tools',
      tagline: 'Developers get a much better experience when building and maintaining tools.',
      preview: [
        'Superior Prompt Engineering — ready-to-use snippets for system prompts.',
        'Better Documentation — auto-generated from usage_examples and error_catalog.',
        'Anti-Pattern Prevention — avoid common mistakes that break agents.',
      ],
      bullets: [
        { head: 'Superior Prompt Engineering', body: 'prompt_snippets, purpose, and when_to_use give developers ready-to-use text for system prompts and few-shot examples.' },
        { head: 'Faster Tool Creation & Hardening', body: 'applied_fixes and projected_improvements clearly show exactly what Trustabl improved and why it matters.' },
        { head: 'Better Documentation', body: 'full_documentation, usage_examples, error_catalog, and faq generate high-quality, self-service docs automatically.' },
        { head: 'Reduced Debugging Time', body: 'Rich tracing, logging, and metrics configs + error_handling make tools far easier to debug in production.' },
        { head: 'Clearer Ownership & Review', body: 'production_readiness_checklist and completion_percentage give developers a clear checklist and confidence score before shipping.' },
        { head: 'Anti-Pattern Prevention', body: 'anti_patterns and when_not_to_use help developers avoid common mistakes that break agents.' },
      ],
    },
    {
      id: 'harness',
      title: 'Agent Harness',
      tagline: 'Frameworks integrate more cleanly and run more reliably.',
      preview: [
        'Native Integration — ready-to-use definitions for every major ecosystem.',
        'Better Tool Discovery — semantic search and dynamic tool selection.',
        'Safer Composition — enforcement of governance when chaining tools.',
      ],
      bullets: [
        { head: 'Native, High-Quality Integration', body: 'mcp_tool_definition, openai_function_schema, claude_tool_schema, and gitagent_tool_reference provide ready-to-use definitions for every major ecosystem.' },
        { head: 'Composable & Reusable Components', body: 'Rich side_effects, idempotency, and workflow_patterns make tools safe to combine in multi-step agent workflows.' },
        { head: 'Better Tool Discovery & Routing', body: 'discoverability_tags, related_tools, and purpose improve semantic search and dynamic tool selection inside frameworks.' },
        { head: 'Reduced Framework-Level Complexity', body: 'Strong validation_rules, error_handling, and retry_policy mean frameworks need less custom retry or validation logic.' },
        { head: 'Improved Observability Across the Stack', body: 'Standardized tracing, logging, and metrics configs work consistently across different harnesses.' },
        { head: 'Safer Agent Composition', body: 'approval_gates, risk_level, and sod_conflicts help frameworks enforce governance when chaining tools.' },
      ],
    },
    {
      id: 'openshell',
      title: 'NVIDIA OpenShell',
      tagline: 'One of the highest-leverage integrations — automatic policy generation at every layer.',
      preview: [
        'Auto Least-Privilege Policies — ready-to-use OpenShell YAML from ATM fields.',
        '1-Click Secure Deployment — minimal manual policy work required.',
        'Continuous Hardening Loop — runtime signals improve metadata automatically.',
      ],
      bullets: [
        { head: 'Automatic Least-Privilege Policy Generation', body: 'egress_requirements, binary_requirements, and execution_context enable Trustabl to output ready-to-use openshell_policy_fragment YAML.' },
        { head: '1-Click Secure Deployment', body: 'sandbox_compatibility and pre-generated policy fragments let teams deploy hardened tools into OpenShell with minimal manual policy work.' },
        { head: 'Runtime Security Enforcement', body: 'Detailed network, binary, and filesystem metadata allows OpenShell to apply precise Landlock + seccomp + network policies.' },
        { head: 'Continuous Hardening Loop', body: 'continuous_hardening_feedback field ingests runtime signals (denied requests, new endpoints) so Trustabl can automatically improve metadata over time.' },
        { head: 'Stronger Supply Chain Trust', body: 'Combined with SLSA fields (slsa_attestation, slsa_provenance), OpenShell gets cryptographically verifiable tool metadata.' },
        { head: 'Reduced Attack Surface', body: 'data_handling, risk_level, and policy_tags help OpenShell apply the right isolation and monitoring for sensitive tools.' },
      ],
    },
    {
      id: 'judge',
      title: 'LLM-as-Judge',
      tagline: 'The judge layer becomes much more efficient and effective with rich ATM context.',
      preview: [
        'Fewer Judge Calls — many actions auto-approved via strong metadata.',
        'Higher-Quality Judgments — richer context drives better decisions.',
        'Stronger Defense-in-Depth — ATM + judge together far stronger than either alone.',
      ],
      bullets: [
        { head: 'Significantly Fewer Judge Calls', body: 'Many actions that previously required judge review can now be auto-approved because of strong validation_rules, risk_level, idempotency, and side_effects metadata.' },
        { head: 'Higher-Quality Judgments', body: 'The judge receives much richer context (purpose, when_to_use, approval_gates, error_handling) so it makes better approve/block/revise/escalate decisions.' },
        { head: 'Lower Latency & Cost', body: 'Fewer judge invocations + smaller context per judgment = faster and cheaper real-time policing.' },
        { head: 'Better High-Risk Handling', body: 'Pre-classified risk_level and approval_gates let the judge focus its intelligence on truly complex or novel cases.' },
        { head: 'Improved Audit & Explainability', body: 'Structured decision_audit_fields and applied_fixes give the judge (and humans) clear reasoning for why actions were allowed or blocked.' },
        { head: 'Stronger Defense-in-Depth', body: 'ATM provides the structural hardening layer while the judge provides dynamic behavioral oversight — together they are far stronger than either alone.' },
      ],
    },
  ];

  const faqItems = [
    {
      q: 'What is Trustabl?',
      a: 'Trustabl scans AI agents, tools, and skills for production-readiness issues — flagging reliability, safety, and configuration gaps with clear fix suggestions. Free remediation via VS Code, Cursor, and Skill.md is coming soon. Think of it as a specialized linter for agentic systems.',
    },
    {
      q: 'Who is Trustabl for?',
      a: 'Trustabl is built for AI engineers, platform teams, and security/compliance teams who are building or running agentic systems in production and want tools that are reliable, observable, and policy-compliant.',
    },
    {
      q: 'How long does it take to harden a tool?',
      a: 'Most tools are fully hardened in under 60 seconds. You connect your GitHub repo, and Trustabl scans, enriches, and generates most of the metadata automatically.',
    },
    {
      q: 'Do I need to change my existing tool code?',
      a: 'No. Trustabl works on top of your existing tools. It analyzes your code, documentation, and behavior, then generates enriched metadata and optional policy files without modifying your source code.',
    },
    {
      q: 'Is Agentic Tool Metadata (ATM) the same thing as Skills (SKILL.md)?',
      a: 'No. Skills (SKILL.md) teach the agent how to perform a task or workflow. Agentic Tool Metadata (ATM) makes the tools themselves reliable, safe, and production-ready. Skills focus on process. ATM focuses on resilience, validation, policy, observability, and supply-chain trust. The two are highly complementary — great skills need hardened tools underneath them.',
    },
    {
      q: 'If I use OpenShell to secure my runtime agents, do I still need ATM?',
      a: 'Yes. OpenShell secures the runtime environment. Trustabl hardens the tools the agents call inside that environment. ATM automatically generates least-privilege policies, egress rules, binary requirements, and sandbox compatibility metadata that OpenShell can consume directly. Together they deliver defense-in-depth: secure runtime + production-hardened tools.',
    },
    {
      q: "As models get smarter, won't they just add ATM to every tool?",
      a: "Smarter models can describe tools better, but they cannot reliably harden them for production. Trustabl adds critical production-grade elements models cannot consistently provide: structured validation rules, circuit breakers, policy enforcement, cryptographic attestations, least-privilege OpenShell policies, and SLSA supply-chain provenance.",
    },
    {
      q: 'Does Trustabl help with compliance (SOC 2, GDPR, PCI, etc.)?',
      a: 'Yes. Trustabl generates audit-ready metadata, including structured logging schemas, data lineage, retention policies, and SLSA attestations that make compliance evidence much easier to produce.',
    },
    {
      q: 'How does Trustabl compare to observability tools like LangSmith and Langfuse?',
      a: "Complementary. Trustabl automatically generates OpenTelemetry (OTEL) tracing, structured logging, and metrics configurations that feed directly into LangSmith, Langfuse, or any observability platform. We also surface key aggregated metrics and production readiness insights ourselves.",
    },
    {
      q: 'How does Trustabl compare to agentic security tools from CrowdStrike or Snyk?',
      a: 'They focus on securing the agent runtime and detecting threats. Trustabl focuses on hardening the tools agents use so they are production-safe, policy-compliant, and resilient by design. We prevent problems at the source rather than only detecting them at runtime.',
    },
    {
      q: 'Can I try Trustabl for free?',
      a: 'Yes. The Trustabl Agent Analyzer is fully open source — scan any agent codebase for free, no account required. Free remediation via VS Code, Cursor, and Skill.md is coming soon. No credit card, no gates.',
    },
    {
      q: "What's coming next for Trustabl?",
      a: "We're focused on the free remediation experience: GitHub Actions integration, expanded Skill.md support, and skills file scanning. Team governance and compliance features are planned for later.",
    },
    {
      q: 'Is Trustabl like a linting tool specialized for AI agents?',
      a: 'Yes. Trustabl is essentially a specialized linter for AI agents. While traditional linters (like ESLint or Ruff) focus on code style, syntax, and general bugs, Trustabl analyzes your AI agents, tools, prompts, and SDK configurations for reliability, safety, and production readiness — flagging patterns that expose you to prompt injection, missing timeouts, tool misconfigurations, and guardrail gaps that standard linters miss. Think of it as "ESLint for AI agents" — it runs in CI/CD, gives clear explanations and fix suggestions, and helps you ship safer, more robust agentic systems.',
    },
    {
      q: 'How does the free remediation process work?',
      a: 'After scanning, Trustabl generates fix suggestions for every finding. Safe, low-risk fixes will be applied automatically. Higher-risk changes will be surfaced for your review before anything is committed. Remediation will be available as a VS Code/Cursor extension and as a Skill.md for other agent environments. Coming soon.',
    },
    {
      q: 'Do I have to accept every suggested fix?',
      a: 'No. You have full control. Trustabl auto-applies safe fixes (like adding missing timeouts or standardizing retry logic) and surfaces higher-risk changes for your explicit review and approval. You decide what gets committed.',
    },
  ];


  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050506] text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#050506]/85 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <Link href="/" className="justify-self-start">
            <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} priority className="h-7 w-auto" />
          </Link>

          <div className="hidden items-center justify-center gap-8 text-sm font-medium text-gray-400 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith('http') ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-white">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className={`transition-colors duration-200 hover:text-white ${link.href === '/' ? 'text-white' : ''}`}>
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center justify-end gap-4 md:flex">
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/[0.07] hover:text-white"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
              <a
              href={githubRepoUrl}
              className="rounded-xl bg-[#2DD4BF] px-5 py-2 text-sm font-medium text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]"
            >
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
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className={`block text-sm font-medium transition-colors hover:text-white ${link.href === '/' ? 'text-white' : 'text-gray-400'}`}>
                  {link.label}
                </Link>
              ))}
              <a href={githubRepoUrl} className="block rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-center text-sm font-medium text-[#08121F]">
                Try It
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="page-transition pt-16">
        <section className="relative overflow-hidden bg-[#050506] py-24 md:py-28">
          <div className="absolute inset-0 pointer-events-none">
            <HeroParticles />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <a
                href="https://arxiv.org/abs/2406.12045"
                target="_blank"
                rel="noopener noreferrer"
                title="Even state-of-the-art function calling agents succeed on <50% of the tasks."
                className="mb-5 inline-flex items-center rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                Agents Fail Over 50% of Tasks
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </a>
              <h1 className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight lg:text-6xl">
                Make your agents{' '}
                <span className="text-[#2DD4BF]">reliable</span>
              </h1>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <p className="max-w-3xl text-center text-sm leading-relaxed text-gray-500 sm:text-base">
                It&apos;s usually not the model. It&apos;s the agent&apos;s config, tools, context, and guardrails.{' '}
                <span className="text-white">Trustabl<br />finds and fixes these reliability issues in your agent repo before they reach production.</span>
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`${DOCS_URL}/quick-start/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#08121F] transition-all hover:scale-[1.02] hover:bg-[#22B8A6]"
                >
                  <Terminal className="h-4 w-4" />
                  Scan Your Repository
                </a>

                <a
                  href={`${githubRepoUrl}/trustabl-action`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-white/10"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  Use GitHub Action
                </a>

                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-300 transition-all hover:text-white"
                >
                  <PlayCircle className="h-4 w-4" />
                  Watch Demo
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-gray-600">
                Open source <span className="mx-2 text-gray-700">•</span> Runs locally <span className="mx-2 text-gray-700">•</span> Deterministic <span className="mx-2 text-gray-700">•</span> No code leaves your machine
              </p>
            </div>

            <div className="mt-16">
              <IdeWindow />
            </div>

            <div className="mt-16">
              <p className="text-xs text-center text-gray-600 uppercase tracking-widest font-semibold mb-6">
                Works with
              </p>
              <div className="flex justify-center">
                <div className="relative w-[640px] max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                  <div
                    className="flex gap-14 w-max"
                    style={{ animation: 'marquee 18s linear infinite' }}
                  >
                    {[...trustLogoItems, ...trustLogoItems].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-gray-400 cursor-default select-none whitespace-nowrap">
                        <span className="opacity-60">{item.icon}</span>
                        <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Benefits</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Why teams use Trustabl</h2>
            </div>

            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <TrendingUp className="h-4 w-4 text-[#2DD4BF]" />, title: 'Higher agent success rate',      desc: 'Increase your reliability score, reduce failure.' },
                { icon: <Wrench className="h-4 w-4 text-[#2DD4BF]" />,     title: 'Automates issue remediation',    desc: 'IDE integration enables inline suggested fixes.' },
                { icon: <Search className="h-4 w-4 text-[#2DD4BF]" />,     title: 'Reduced debugging work',         desc: 'Solve issues before they become problems.' },
                { icon: <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />,title: 'Better compliance and security', desc: 'Maps to compliance frameworks, hardens agents.' },
                { icon: <DollarSign className="h-4 w-4 text-[#2DD4BF]" />, title: 'Lowers token costs',             desc: 'Better tool calling, limits failed retries.' },
                { icon: <FileText className="h-4 w-4 text-[#2DD4BF]" />,   title: 'Generates policies',             desc: 'For OpenShell, Microsoft ACS, and more.' },
                { icon: <Package className="h-4 w-4 text-[#2DD4BF]" />,    title: 'Supply chain visibility',        desc: 'Total visibility with CycloneDX and VEX.' },
                { icon: <Settings2 className="h-4 w-4 text-[#2DD4BF]" />,  title: 'Less manual hardening',          desc: 'Generates production-grade metadata for you.' },
              ].map((card, i) => (
                <div
                  key={card.title}
                  className={`bg-white/[0.03] p-6 border-white/8 ${i % 4 !== 3 ? 'border-r' : ''} ${i < 4 ? 'border-b' : ''}`}
                >
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md bg-[#2DD4BF]/10">
                    {card.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RULE INDEX */}
        <section className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Static Analysis</p>
            <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">What Trustabl fixes</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
              Covers every layer of your agent stack. No LLM required. Fully offline.
            </p>

            <div className="mt-10 overflow-hidden rounded-3xl border border-white/8">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500 whitespace-nowrap">Category</th>
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500">Example Finding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RULE_CATEGORIES.map((rule, i) => (
                      <tr key={rule.category} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i === RULE_CATEGORIES.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-5 py-3 text-[13px] font-medium text-[#2DD4BF] whitespace-nowrap">{rule.category}</td>
                        <td className="px-5 py-3 text-gray-400">{rule.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-white/8 px-5 py-4">
                <span className="text-xs text-gray-500">187 rules across all categories</span>
                <a href={`${DOCS_URL}/rules/`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-[#2DD4BF] transition-colors hover:text-white">
                  Full index →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* COVERAGE */}
        <section className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Coverage</p>
            <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">What Trustabl evaluates</h2>

            {/* What we analyze — surface area grid */}
            <h3 className="mt-10 text-sm font-semibold uppercase tracking-wider text-gray-500">What we analyze</h3>
            <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/8 sm:grid-cols-3">
              {[
                { title: 'Agents',        desc: 'Every declaration, config captured' },
                { title: 'Sub-agents',    desc: 'Markdown agent definitions' },
                { title: 'Tools',         desc: 'Custom function tools' },
                { title: 'Hosted tools',  desc: 'Built-ins: shell, search, computer' },
                { title: 'Skills',        desc: 'SKILL.md + bundled files' },
                { title: 'Slash commands',desc: 'Command prompts' },
                { title: 'MCP servers',   desc: 'Registrations + configs' },
                { title: 'Guardrails',    desc: 'Input / output' },
                { title: 'Sessions',      desc: 'Memory + persistence' },
                { title: 'Handoffs',      desc: 'Agent-to-agent edges' },
                { title: 'Plugins',       desc: 'Manifests + marketplaces' },
                { title: 'Permissions',   desc: 'Settings + tool grants' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`bg-white/[0.03] p-5 border-white/8 ${i % 3 !== 2 ? 'border-r' : ''} ${i < 9 ? 'border-b' : ''}`}
                >
                  <h4 className="text-base font-semibold text-[#2DD4BF]">{item.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* What we look for — scannable rows */}
            <h3 className="mt-14 text-sm font-semibold uppercase tracking-wider text-gray-500">What we look for</h3>
            <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/8 md:grid-cols-3">
              {[
                {
                  icon: <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />,
                  title: 'Reliability and safety',
                  desc: 'The headline 187 rules: missing guardrails, over-broad permissions, shell and code execution, SSRF.',
                },
                {
                  icon: <KeyRound className="h-4 w-4 text-[#2DD4BF]" />,
                  title: 'Secrets',
                  desc: 'Credentials committed in agent and skill artifacts.',
                },
                {
                  icon: <AlertTriangle className="h-4 w-4 text-[#2DD4BF]" />,
                  title: 'Known CVEs',
                  desc: 'Vulnerable dependencies, matched against an OSV snapshot (opt-in).',
                },
              ].map((row, i) => (
                <div key={row.title} className={`bg-white/[0.03] p-6 border-white/8 ${i !== 2 ? 'md:border-r' : ''}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2DD4BF]/10">
                    {row.icon}
                  </div>
                  <h4 className="mt-3 text-base font-semibold text-white">{row.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GET STARTED */}
        <section className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Get Started in 2 Minutes</p>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Three steps</h2>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`${githubRepoUrl}/trustabl-action`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#08121F] transition-all hover:scale-[1.02] hover:bg-[#22B8A6]"
                >
                  Add GitHub Action
                </a>
                <a
                  href={`${DOCS_URL}/quick-start/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-white/10"
                >
                  Run CLI scan
                </a>
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: 'Add the GitHub Action',
                  desc: "Add Trustabl to your repo's CI pipeline. Scans run automatically on every push.",
                  code: 'uses: trustabl/scan-action@v1',
                },
                {
                  title: 'Add Trustabl to your dev tool',
                  desc: 'Install the Trustabl integration for Cursor, Claude Code, or your preferred IDE.',
                  code: 'ext install trustabl.trustabl-vscode',
                },
                {
                  title: 'See issues and fixes in your IDE',
                  desc: 'Review findings with explanations and apply suggested fixes directly in your editor.',
                  code: '✓ 7 fixed · score 91% · PASS',
                },
              ].map((step, i) => (
                <div key={step.title} className="relative flex flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#2DD4BF]/40 bg-[#050506] text-sm font-semibold text-[#2DD4BF]">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.desc}</p>
                  <div className="mt-4 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5 font-mono text-xs text-[#2DD4BF]">
                    {step.code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPLEMENTS SECURITY TOOLS */}
        <section className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Context</p>

            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Trustabl complements your security tools</h2>
                <p className="mt-5 text-lg leading-relaxed text-gray-400">
                  Trustabl solves agent <span className="font-semibold text-white">reliability issues</span>, something cybersecurity tools don&apos;t address. Most agents fail not because of security vulnerabilities, but because of missing guardrails, poor tool definitions, and unhandled edge cases.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-gray-400">
                  By hardening your agents, we also make them more secure. We include tooling for vulnerabilities, secrets, SBOMs, and compliance, with dependency license types coming soon. We generate security policies automatically for things like MCPs, NVIDIA OpenShell, and Microsoft ACS.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    who: 'Trustabl',
                    lead: 'Reliability',
                    desc: 'Guardrails, tool definitions, retries, and error handling, checked before code ships.',
                    highlight: true,
                  },
                  {
                    who: 'CrowdStrike / Snyk',
                    lead: 'Runtime threat detection',
                    desc: 'Secures the agent environment after deployment.',
                    highlight: false,
                  },
                  {
                    who: 'LangSmith / Langfuse',
                    lead: 'Observability',
                    desc: 'Trustabl generates the OTEL traces and logs that feed these platforms.',
                    highlight: false,
                  },
                  {
                    who: 'Together',
                    lead: 'Defense in depth',
                    desc: 'Hardened tools, secured runtime, full observability.',
                    highlight: false,
                  },
                ].map((row) => (
                  <div
                    key={row.who}
                    className={`rounded-2xl border p-5 ${row.highlight ? 'border-[#2DD4BF]/30 bg-[#2DD4BF]/[0.06]' : 'border-white/8 bg-white/[0.03]'}`}
                  >
                    <h4 className="text-sm font-semibold text-white">{row.who}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                      <span className={row.highlight ? 'font-medium text-[#2DD4BF]' : 'font-medium text-gray-300'}>{row.lead}:</span> {row.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ATM Diagram Section */}
        <section id="atm" className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Trustabl Agent Analyzer (TAA)</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">TAA makes every layer of the stack better</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
                Rich, production-grade metadata doesn&apos;t just describe your tools, it makes every system that uses them smarter, safer, and faster.
              </p>
            </div>

            {/* Desktop diagram */}
            <div className="hidden lg:block">
              {(() => {
                // Layout (px): 3 cards h-[168px], gap-5 (20px) between rows
                // Total H = 3×168 + 2×20 = 544. Row midpoints: 84, 272, 460.
                // cardW=340, 48px gap to rail, center channel=184px, 52px rail-to-logo.
                // leftRail=388, rightRail=572, cx=480
                const W = 960, H = 544;
                const cardW = 340;
                const leftRailX = cardW + 48;      // 388
                const rightRailX = W - cardW - 48; // 572
                const cx = W / 2;                  // 480
                const logoSize = 80;
                const logoX = cx - logoSize / 2;   // 440
                const logoY = 272 - logoSize / 2;  // 232
                const rows = [84, 272, 460];
                const lineColor = 'rgba(45,212,191,0.25)';
                const dotColor = '#2DD4BF';

                const leftNodes = [
                  { id: 'openshell', icon: <Monitor className="h-4 w-4" />, title: 'NVIDIA OpenShell', desc: 'Least-privilege sandbox policies' },
                  { id: 'harness',   icon: <Wrench className="h-4 w-4" />,  title: 'Agent Harness',   desc: 'Native integration (MCP, GitAgent)' },
                  { id: 'judge',     icon: <FileText className="h-4 w-4" />,title: 'LLM-as-Judge',    desc: 'Reduced load, smarter high risk policy' },
                ];
                const rightNodes = [
                  { id: 'llm',      icon: <Cpu className="h-4 w-4" />,   title: 'LLM Model',       desc: 'Better tool calling accuracy' },
                  { id: 'agent',    icon: <Zap className="h-4 w-4" />,   title: 'Agent Runtime',   desc: 'Resilient execution and self-recovery' },
                  { id: 'devtools', icon: <Code2 className="h-4 w-4" />, title: 'IDE / Dev Tools', desc: 'Superior prompting and docs' },
                ];

                return (
                  <div className="mx-auto" style={{ width: W }}>
                    {/* Supply chain — centered within 900px wrapper */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0D0D10] px-5 py-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#2DD4BF]/10 text-[#2DD4BF]">
                          <Link2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">Supply Chain</p>
                          <p className="text-sm text-gray-400">SLSA + Sigstore attestations</p>
                        </div>
                      </div>
                      <div style={{ width: 1, height: 40, backgroundColor: 'rgba(45,212,191,0.25)' }} />
                    </div>

                    {/* Diagram area: fixed 900×520, SVG lines + absolutely positioned cards */}
                    <div className="relative" style={{ width: W, height: H }}>

                      {/* SVG lines */}
                      <svg className="pointer-events-none absolute inset-0" width={W} height={H}>
                        {/* Center vertical: supply-chain connector → logo top */}
                        <line x1={cx} y1={0} x2={cx} y2={logoY} stroke={lineColor} strokeWidth="1" />
                        {/* Left vertical rail: row0 midpoint → row2 midpoint */}
                        <line x1={leftRailX} y1={rows[0]} x2={leftRailX} y2={rows[2]} stroke={lineColor} strokeWidth="1" />
                        {/* Right vertical rail */}
                        <line x1={rightRailX} y1={rows[0]} x2={rightRailX} y2={rows[2]} stroke={lineColor} strokeWidth="1" />
                        {/* Left rail → logo left edge (at logo vertical center) */}
                        <line x1={leftRailX} y1={rows[1]} x2={logoX} y2={rows[1]} stroke={lineColor} strokeWidth="1" />
                        {/* Right rail → logo right edge */}
                        <line x1={rightRailX} y1={rows[1]} x2={logoX + logoSize} y2={rows[1]} stroke={lineColor} strokeWidth="1" />
                        {/* Left card → left rail (20px horizontal per row) */}
                        {rows.map((y) => (
                          <line key={`hl-${y}`} x1={cardW} y1={y} x2={leftRailX} y2={y} stroke={lineColor} strokeWidth="1" />
                        ))}
                        {/* Right rail → right card */}
                        {rows.map((y) => (
                          <line key={`hr-${y}`} x1={rightRailX} y1={y} x2={W - cardW} y2={y} stroke={lineColor} strokeWidth="1" />
                        ))}
                        {/* Dots at rail intersections */}
                        {rows.map((y) => (
                          <g key={`d-${y}`}>
                            <circle cx={leftRailX} cy={y} r="5" fill={dotColor} />
                            <circle cx={rightRailX} cy={y} r="5" fill={dotColor} />
                          </g>
                        ))}
                      </svg>

                      {/* Left cards — width=340, starts at x=0, ends at x=340 (rail at 360) */}
                      <div className="absolute left-0 top-0 flex flex-col gap-5" style={{ width: cardW }}>
                        {leftNodes.map((node) => (
                          <div key={node.id} className="flex h-[168px] flex-col gap-2 rounded-2xl border border-white/8 bg-[#0D0D10] p-6 transition-colors hover:border-[#2DD4BF]/30">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#2DD4BF]/10 text-[#2DD4BF]">{node.icon}</div>
                            <span className="text-base font-semibold text-white">{node.title}</span>
                            <p className="text-sm leading-relaxed text-gray-400">{node.desc}</p>
                            <button type="button" onClick={() => setAtmModal(node.id)} className="self-start text-xs font-medium text-[#2DD4BF] hover:underline">See more</button>
                          </div>
                        ))}
                      </div>

                      {/* Center logo */}
                      <div className="absolute z-10" style={{ left: logoX, top: logoY, width: logoSize, height: logoSize }}>
                        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-[#2DD4BF]/30 bg-[#0B0B0D]" style={{ animation: 'coreGlow 2s ease-in-out infinite' }}>
                          <svg className="h-11 w-11" viewBox="0 0 612 633" fill="#2DD4BF">
                            <path d="M150.066 523.027C150.066 523.027 266.828 630.601 300.296 632.297C333.764 633.992 552.581 495.592 581.992 243.134C581.992 243.134 470.79 353.155 468.772 357.964C466.754 362.772 394.924 505.231 298.514 544.173L150.066 523.027Z"/>
                            <path d="M206.247 374.515L300.403 460.278L605.928 152.563C605.928 152.563 615.353 137.987 609.9 122.144C604.447 106.301 581.133 92.3682 581.133 92.3682C581.133 92.3682 563.895 88.6973 548.932 98.9588C533.969 109.22 298.407 349.012 298.407 349.012L206.226 374.537L206.247 374.515Z"/>
                            <path d="M393.896 3.21383C393.896 3.21383 181.819 -13.3805 133.496 28.846C133.496 28.846 101.38 53.1901 94.6396 120.104C94.6396 120.104 181.969 78.3929 268.419 83.3519C354.868 88.3109 393.918 3.21383 393.918 3.21383H393.896Z"/>
                            <path d="M186.241 8.51621C186.241 8.51621 83.1752 24.0372 13.5991 76.0958C-7.67515 92.0032 -4.69113 181.286 27.5315 209.173C46.058 225.187 206.227 374.515 206.227 374.515C206.227 374.515 246.693 379.581 275.094 368.762L298.408 348.99C298.408 348.99 97.8589 169.308 95.841 145.951C93.823 122.594 109.022 36.703 186.219 8.49475L186.241 8.51621Z"/>
                            <path d="M341.599 209.345V117.764C341.599 117.764 351.238 81.4414 387.389 86.336C423.54 91.2306 452.951 101.707 470.533 92.583C488.115 83.4593 497.732 59.8881 479.742 28.4597C461.752 -2.96868 366.179 -0.693158 344.647 11.9941C323.116 24.6814 270.37 50.2706 262.771 104.519V231.928C262.771 231.928 278.571 266.405 300.875 264.044C323.18 261.682 332.475 256.788 341.256 235.814L341.599 209.366V209.345Z"/>
                            <path d="M298.516 544.173C298.516 544.173 181.067 467.126 143.22 375.696C143.22 375.696 122.44 329.391 82.5531 353.735C82.5531 353.735 48.4198 371.317 67.0107 404.098C85.6015 436.878 125.896 502.118 150.863 523.736C150.863 523.736 214.363 578.821 298.516 544.173Z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Right cards */}
                      <div className="absolute right-0 top-0 flex flex-col gap-5" style={{ width: cardW }}>
                        {rightNodes.map((node) => (
                          <div key={node.id} className="flex h-[168px] flex-col gap-2 rounded-2xl border border-white/8 bg-[#0D0D10] p-6 transition-colors hover:border-[#2DD4BF]/30">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#2DD4BF]/10 text-[#2DD4BF]">{node.icon}</div>
                            <span className="text-base font-semibold text-white">{node.title}</span>
                            <p className="text-sm leading-relaxed text-gray-400">{node.desc}</p>
                            <button type="button" onClick={() => setAtmModal(node.id)} className="self-start text-xs font-medium text-[#2DD4BF] hover:underline">See more</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Mobile fallback */}
            <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
              {atmComponents.map((comp) => (
                <div key={comp.id} className="flex flex-col rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                  <h3 className="mb-1 text-base font-semibold text-white">{comp.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-400">{comp.tagline}</p>
                  <button type="button" onClick={() => setAtmModal(comp.id)} className="mt-auto self-start text-xs font-medium text-[#2DD4BF] hover:underline">See more</button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal */}
          {atmModal && (() => {
            const comp = atmComponents.find(c => c.id === atmModal);
            if (!comp) return null;
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAtmModal(null)}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <div className="relative mx-auto w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0F0F12] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => setAtmModal(null)} className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white">✕</button>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-[#2DD4BF]">Trustabl Agent Analyzer (TAA)</p>
                  <h3 className="mb-2 text-2xl font-bold text-white">{comp.title}</h3>
                  <p className="mb-6 text-sm text-gray-400">{comp.tagline}</p>
                  <ul className="space-y-4">
                    {comp.bullets.map((b) => (
                      <li key={b.head} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2DD4BF]" />
                        <span><strong className="text-white">{b.head}</strong> — {b.body}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">FAQ</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Common questions</h2>
            </div>
            <div className="mt-12 divide-y divide-white/8">
              {faqItems.map((item, i) => (
                <div key={i} className="py-5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <span className={`text-lg transition-colors duration-200 ${faqOpen === i ? 'text-[#2DD4BF]' : 'text-gray-400'}`}>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${faqOpen === i ? 'rotate-180 text-[#2DD4BF]' : 'text-gray-400'}`}
                    />
                  </button>
                  {faqOpen === i && (
                    <div className="pb-5 text-sm leading-relaxed text-gray-400">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="share" className="bg-[#050506] py-20 lg:py-24 reveal">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="rounded-[32px] border border-white/8 bg-white/[0.03] p-8 text-center lg:p-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">Stay Updated</p>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Product updates, delivered.</h2>
            <p className="mb-8 text-base text-gray-400 lg:whitespace-nowrap">New features, security guides, and early access drops, straight to your inbox. No spam.</p>
            {newsletterSubmitted ? (
              <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-6 py-4 text-[#2DD4BF]">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">You&apos;re on the list. We&apos;ll be in touch.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setNewsletterSubmitted(true);
                }}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2DD4BF]/40 focus:ring-1 focus:ring-[#2DD4BF]/20"
                />
                <button
                  type="submit"
                  className="flex h-10 items-center justify-center rounded-xl bg-[#2DD4BF] px-6 text-sm font-medium text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6] active:scale-100"
                >
                  Notify Me
                </button>
              </form>
            )}
            </div>
          </div>
        </section>
      </main>

      <div className="pt-12">
        <Footer />
      </div>

      {demoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={() => setDemoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDemoFullscreen}
                aria-label="Full screen"
                className="rounded-lg border border-white/15 bg-white/5 p-2 text-white transition-colors hover:bg-white/10"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDemoOpen(false)}
                aria-label="Close"
                className="rounded-lg border border-white/15 bg-white/5 p-2 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div ref={demoVideoRef} className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/MBh5FoF5Nqo"
                title="Trustabl Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

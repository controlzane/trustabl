'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import Footer from '@/components/Footer';

const GITHUB_URL = 'https://github.com/trustabl/trustabl';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/products' },
  { label: 'Docs', href: 'https://trustabl.github.io/trustabl-docs/' },
  { label: 'Blog', href: '/blog' },
];

type Field = { name: string; type: string; note: string };
type EventBlock = { name: string; desc: string; fields: Field[] };

const NEVER_COLLECT = [
  'Repo names, org names, usernames, email addresses, IP addresses',
  'File paths, directory names, or filenames from the scanned repo',
  'Source code — no snippets in any form, including inside error messages',
  'Finding content — explanation text, fix text, matched code',
  'Tool or agent names from the scanned codebase',
  'Raw error strings — errors are bucketed into a closed enum before sending',
  'Env var values — CI provider detected by presence only, never values',
  'Exact file counts — coarse size buckets are used instead',
];

const EVENTS: EventBlock[] = [
  {
    name: 'scan.started',
    desc: 'Fired when a scan begins, after argument validation passes',
    fields: [
      { name: 'os', type: 'string', note: 'darwin, linux, windows' },
      { name: 'arch', type: 'string', note: 'arm64, amd64' },
      { name: 'target_type', type: 'string', note: '"local" or "remote" (GitHub URL)' },
      { name: 'format', type: 'string', note: 'human, json, sarif' },
      { name: 'strict_mode', type: 'bool', note: 'Whether --strict was passed' },
      { name: 'flags_used', type: '[]string', note: 'Flag names only — never flag values' },
      { name: 'ci_provider', type: 'string', note: 'github_actions, gitlab_ci, circleci, jenkins, unknown, or "" (not CI)' },
      { name: 'is_new_install', type: 'bool', note: 'First run on this machine' },
    ],
  },
  {
    name: 'scan.completed',
    desc: 'Fired on a successful scan (exit code 0 or 1)',
    fields: [
      { name: 'duration_ms', type: 'int', note: 'Wall-clock milliseconds' },
      { name: 'repo_size_bucket', type: 'string', note: 'small (<20 files), medium (<200), large (≥200)' },
      { name: 'sdks_detected', type: '[]string', note: 'SDKs observed in code' },
      { name: 'languages_detected', type: '[]string', note: 'Languages recognized in the repo' },
      { name: 'tools_count', type: 'int', note: 'Tool definitions discovered' },
      { name: 'agents_count', type: 'int', note: 'Agent declarations discovered' },
      { name: 'findings_by_severity', type: 'object', note: 'Finding count per severity level' },
      { name: 'rule_ids_fired', type: 'object', note: 'Hit count per rule ID — no finding content included' },
      { name: 'rules_sha', type: 'string', note: 'Commit SHA of the rule pack used' },
      { name: 'schema_version', type: 'int', note: 'Rule schema version' },
      { name: 'exit_code', type: 'int', note: '0 (clean) or 1 (findings present)' },
      { name: 'features_used', type: '[]string', note: 'attest, vuln_scan, sarif_out, json_out, bom_out, no_rules_update' },
      { name: 'repo_id_hash', type: 'string', note: 'One-way hash of CI repo env var, used for dedup only — the repo name cannot be recovered. Empty outside CI.' },
    ],
  },
  {
    name: 'scan.failed',
    desc: 'Fired when the scan exits with code 2 (scanner or I/O error)',
    fields: [
      { name: 'error_category', type: 'string', note: 'Closed enum — raw error string is never sent. Values: rules_fetch_failed, clone_failed, parse_error, no_rules, unknown.' },
      { name: 'duration_ms', type: 'int', note: 'Wall-clock milliseconds until failure' },
    ],
  },
  {
    name: 'command.run',
    desc: 'Fired for every non-scan subcommand invocation',
    fields: [
      { name: 'command', type: 'string', note: 'version, mcp, enrich, attest, verify, capabilities, rules.pull, rules.validate, vulndb.pull, llm.list, llm.key.set, llm.key.get, llm.key.delete, llm.model.set, llm.provider.set, llm.provider.list' },
    ],
  },
];

const OPTOUT_METHODS = [
  { title: 'Environment variable — highest priority', desc: 'Overrides the config file. Takes effect immediately, session-scoped.', code: 'export TRUSTABL_TELEMETRY=0' },
  { title: 'CLI command — persisted', desc: 'Writes your preference to the config file. Persists across sessions.', code: 'trustabl telemetry off' },
  { title: 'Config file — manual', desc: 'Edit ~/.config/trustabl/telemetry.json directly.', code: '{"enabled": false, "anonymous_id": "your-uuid-here"}' },
];

export default function TelemetryPage() {
  const [menuOpen, setMenuOpen] = useState(false);

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
                <Link key={link.label} href={link.href} className="transition-colors duration-200 hover:text-white">
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center justify-end gap-4 md:flex">
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
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-gray-400 transition-colors hover:text-white" onClick={() => setMenuOpen(false)}>{link.label}</a>
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

      <main className="pt-16">
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Legal</p>
          <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">Telemetry</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
            Trustabl collects anonymous usage data to improve the product. This page is the complete list of every event and every property that can be sent — updated in the same commit as any schema change.
          </p>

          {/* Opt-out summary bar */}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 sm:flex-row sm:items-center">
            <p className="text-sm text-gray-400">
              Telemetry is <span className="font-semibold text-white">on by default</span> and opt-out.
            </p>
            <div className="flex flex-wrap gap-2">
              <code className="rounded-md border border-white/8 bg-white/[0.05] px-2.5 py-1 font-mono text-xs text-[#2DD4BF]">trustabl telemetry off</code>
              <code className="rounded-md border border-white/8 bg-white/[0.05] px-2.5 py-1 font-mono text-xs text-[#2DD4BF]">TRUSTABL_TELEMETRY=0</code>
            </div>
          </div>

          {/* What we never collect */}
          <div className="mt-16">
            <h2 className="mb-2 text-xl font-semibold text-white">What we never collect</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {NEVER_COLLECT.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-red-400">Never</div>
                  <p className="text-sm leading-relaxed text-gray-400">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anonymous ID */}
          <div className="mt-16">
            <h2 className="mb-2 text-xl font-semibold text-white">Anonymous ID</h2>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Every event carries an <code className="rounded border border-white/8 bg-white/[0.05] px-1.5 py-0.5 font-mono text-xs text-[#2DD4BF]">anonymous_id</code> that identifies the installation, not the person. It is never derived from machine fingerprinting — no hostname, no MAC address, no username hash.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#2DD4BF]">Local</div>
                <p className="text-sm leading-relaxed text-gray-400">Random UUID v4 generated once, stored in <code className="text-gray-300">~/.config/trustabl/telemetry.json</code>. Stable across runs on the same machine.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#2DD4BF]">CI</div>
                <p className="text-sm leading-relaxed text-gray-400">Ephemeral UUID generated per invocation, never written to disk. CI runs are counted but not session-correlated.</p>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="mt-16">
            <h2 className="mb-2 text-xl font-semibold text-white">Events</h2>
            <div className="mt-6 space-y-6">
              {EVENTS.map((event) => (
                <div key={event.name} className="overflow-hidden rounded-3xl border border-white/8">
                  <div className="flex flex-col gap-1.5 border-b border-white/8 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:gap-3">
                    <span className="w-fit rounded-md border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[#2DD4BF]">{event.name}</span>
                    <span className="text-sm text-gray-500">{event.desc}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/8">
                          <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500 whitespace-nowrap">Property</th>
                          <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500 whitespace-nowrap">Type</th>
                          <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-gray-500">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.fields.map((field, i) => (
                          <tr key={field.name} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${i === event.fields.length - 1 ? 'border-b-0' : ''}`}>
                            <td className="px-5 py-3 font-mono text-[12px] text-gray-200 whitespace-nowrap align-top">{field.name}</td>
                            <td className="px-5 py-3 font-mono text-[12px] text-[#2DD4BF] whitespace-nowrap align-top">{field.type}</td>
                            <td className="px-5 py-3 text-gray-400 align-top">{field.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to opt out */}
          <div className="mt-16">
            <h2 className="mb-2 text-xl font-semibold text-white">How to opt out</h2>
            <div className="mt-6 space-y-3">
              {OPTOUT_METHODS.map((method, i) => (
                <div key={method.title} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-xs font-bold text-[#2DD4BF]">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white">{method.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{method.desc}</p>
                    <code className="mt-2 block overflow-x-auto rounded-lg border border-white/8 bg-[#050506] px-3 py-2 font-mono text-xs text-[#2DD4BF]">{method.code}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="mt-16">
            <h2 className="mb-2 text-xl font-semibold text-white">Backend</h2>
            <div className="mt-6 flex items-start gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.05] text-[#2DD4BF]">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">PostHog</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-400">
                  Events are sent over HTTPS to PostHog, a product analytics platform. Trustabl does not use PostHog for advertising, profiling, or any purpose other than product improvement. Events are batched and sent asynchronously — no telemetry call ever adds latency to a scan. Network errors are silently discarded and never affect the exit code.{' '}
                  <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">PostHog privacy policy →</a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-16 border-t border-white/8 pt-8 text-sm text-gray-500">
            <p>
              Questions? <a href="https://github.com/trustabl/trustabl/issues" target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">Open an issue</a> or join the{' '}
              <a href="https://discord.gg/27sdvYnZ5" target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">Discord</a>.
            </p>
            <p className="mt-2">
              This page is updated in the same commit as any event schema change. Source:{' '}
              <a href="https://github.com/trustabl/trustabl/blob/main/TELEMETRY.md" target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:underline">TELEMETRY.md</a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

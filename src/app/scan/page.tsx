'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const GITHUB_REPO_PATTERN = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})\/[a-zA-Z0-9._-]+\/?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: backend doesn't emit per-stage scan events yet — these labels advance
// on fixed timers as a stand-in. Once the scan-request status endpoint reports
// real stages (e.g. status: 'cloning' | 'scanning' | 'preparing'), drive
// SCAN_STEPS off that instead of setTimeout.
const SCAN_STEPS = ['Cloning repository...', 'Running scan...', 'Preparing report...'];
const SCAN_STEP_DELAYS_MS = [3000, 8000];

type Status = 'idle' | 'submitting' | 'queued' | 'scanning' | 'sent' | 'error';

type ScanState = {
  status: Status;
  requestId: string | null;
  queuePosition: number | null;
  queueTotal: number | null;
  filesScanned: number | null;
  filesTotal: number | null;
  errorMessage: string | null;
};

const initialScanState: ScanState = {
  status: 'idle',
  requestId: null,
  queuePosition: null,
  queueTotal: null,
  filesScanned: null,
  filesTotal: null,
  errorMessage: null,
};

export default function ScanPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [repoError, setRepoError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanState>(initialScanState);
  const [scanStep, setScanStep] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearStepTimers = () => {
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
  };

  const startStepMock = () => {
    clearStepTimers();
    setScanStep(0);
    stepTimersRef.current = SCAN_STEP_DELAYS_MS.map((delay, i) =>
      setTimeout(() => setScanStep(i + 1), delay)
    );
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      clearStepTimers();
    };
  }, []);

  const startPolling = (requestId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/marketing/scan-request/${requestId}/status`);
        if (!res.ok) {
          // Status endpoint unavailable or request unknown — fall back to a
          // generic scanning state rather than surfacing a poll error.
          setScan((prev) => (prev.status === 'sent' ? prev : { ...prev, status: 'scanning' }));
          return;
        }
        const data = await res.json();
        if (data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
          clearStepTimers();
          setScan((prev) => ({ ...prev, status: 'error', errorMessage: data.error_message || 'Scan failed. Please try again.' }));
          return;
        }
        if (data.status === 'sent') {
          if (pollRef.current) clearInterval(pollRef.current);
          clearStepTimers();
        }
        setScan((prev) => ({
          ...prev,
          status: data.status,
          queuePosition: data.queue_position ?? null,
          queueTotal: data.queue_total ?? null,
          filesScanned: data.files_scanned ?? null,
          filesTotal: data.files_total ?? null,
        }));
      } catch {
        setScan((prev) => (prev.status === 'sent' ? prev : { ...prev, status: 'scanning' }));
      }
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedRepo = repoUrl.trim();
    const trimmedEmail = email.trim();
    let hasError = false;

    if (trimmedRepo && !GITHUB_REPO_PATTERN.test(trimmedRepo)) {
      setRepoError('Enter a valid GitHub repository, e.g. github.com/your-org/your-repo');
      hasError = true;
    } else {
      setRepoError(null);
    }

    if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (hasError) return;

    setScan({ ...initialScanState, status: 'submitting' });

    try {
      const res = await fetch('/api/marketing/scan-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: trimmedRepo, email: trimmedEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setScan({ ...initialScanState, status: 'error', errorMessage: data.error_message || 'Something went wrong. Please try again.' });
        return;
      }

      setScan({
        ...initialScanState,
        status: data.status === 'scanning' ? 'scanning' : 'queued',
        requestId: data.request_id,
      });
      startStepMock();
      startPolling(data.request_id);
    } catch {
      setScan({ ...initialScanState, status: 'error', errorMessage: 'Could not reach the scan service. Please try again.' });
    }
  };

  const isSubmitting = scan.status === 'submitting';
  const isInProgress = scan.status === 'queued' || scan.status === 'scanning' || scan.status === 'sent' || isSubmitting;
  const isScanning = scan.status === 'queued' || scan.status === 'scanning' || isSubmitting;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050506] text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#050506]/85 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <Link href="/" className="justify-self-start">
            <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} priority className="h-7 w-auto" />
          </Link>

          <div />

          {isScanning ? (
            <span className="justify-self-end text-sm font-medium text-gray-600 cursor-not-allowed" aria-disabled="true">
              Back to home
            </span>
          ) : (
            <Link href="/" className="justify-self-end text-sm font-medium text-gray-400 transition-colors hover:text-white">
              Back to home
            </Link>
          )}
        </div>
      </nav>

      <main className="page-transition pt-16">
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-[#050506] py-16">
          <div className="relative z-10 mx-auto w-full max-w-2xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="w-full text-center text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">
                See what&apos;s breaking in
                <br />
                your agent before it ships
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-500 sm:text-base">
                Try Trustabl on your own repo, no install required. Paste a link and
                <br />
                see exactly what we&apos;d catch, delivered straight to your inbox.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-[460px] rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              {!isInProgress && scan.status !== 'error' && (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="repo_url" className="mb-1.5 block text-sm font-medium text-gray-300">
                      GitHub repository
                    </label>
                    <div className="relative">
                      <GithubIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        id="repo_url"
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="github.com/your-org/your-repo"
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2DD4BF]/40 focus:ring-1 focus:ring-[#2DD4BF]/20"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-600">Public repositories only.</p>
                    {repoError && <p className="mt-1.5 text-xs text-red-400">{repoError}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2DD4BF]/40 focus:ring-1 focus:ring-[#2DD4BF]/20"
                      />
                    </div>
                    {emailError && <p className="mt-1.5 text-xs text-red-400">{emailError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#08121F] transition-all hover:scale-[1.01] hover:bg-[#22B8A6] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Starting your scan...
                      </>
                    ) : (
                      'Get my free report'
                    )}
                  </button>

                  <p className="flex items-start gap-1.5 text-xs text-gray-500">
                    <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    We scan what&apos;s needed to generate your report. Source code isn&apos;t stored, only the results.
                  </p>
                </form>
              )}

              {scan.status === 'error' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {scan.errorMessage}
                  </div>
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="repo_url_retry" className="mb-1.5 block text-sm font-medium text-gray-300">
                        GitHub repository
                      </label>
                      <div className="relative">
                        <GithubIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                          id="repo_url_retry"
                          type="text"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          placeholder="github.com/your-org/your-repo"
                          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2DD4BF]/40 focus:ring-1 focus:ring-[#2DD4BF]/20"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-gray-600">Public repositories only.</p>
                      {repoError && <p className="mt-1.5 text-xs text-red-400">{repoError}</p>}
                    </div>

                    <div>
                      <label htmlFor="email_retry" className="mb-1.5 block text-sm font-medium text-gray-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                          id="email_retry"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2DD4BF]/40 focus:ring-1 focus:ring-[#2DD4BF]/20"
                        />
                      </div>
                      {emailError && <p className="mt-1.5 text-xs text-red-400">{emailError}</p>}
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#08121F] transition-all hover:scale-[1.01] hover:bg-[#22B8A6]"
                    >
                      Try again
                    </button>
                  </form>
                </div>
              )}

              {isInProgress && (
                <div className="flex flex-col items-center py-6 text-center">
                  {scan.status === 'sent' ? (
                    <Link href="/emails/scan-report.html" className="flex w-full flex-col items-center rounded-xl transition-colors hover:bg-white/[0.03]">
                      <CheckCircle2 className="h-8 w-8 text-[#2DD4BF]" />
                      <p className="mt-3 text-sm font-medium text-white">Check your inbox</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {repoUrl.trim()
                          ? `We've emailed the full report for ${repoUrl.trim()}.`
                          : "We've emailed the full report."}
                      </p>
                    </Link>
                  ) : (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-[#2DD4BF]" />
                      <p className="mt-3 text-sm font-medium text-white">{SCAN_STEPS[scanStep]}</p>
                      <p className="mt-1 text-xs text-gray-500">Usually just a couple minutes.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

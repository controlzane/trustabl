'use client';

import Image from 'next/image';
import { Bebas_Neue } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});

const githubRepoUrl = 'https://github.com/controlzane/trustabl.git';

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context = ctx;

    const dpr = window.devicePixelRatio || 1;

    function getCenter() {
      return { x: canvas!.offsetWidth / 2, y: canvas!.offsetHeight / 2 };
    }

    const MAX_SPEED = 0.48;
    const TRAIL = 6;
    const N = 145;
    const DRAG = 0.996;
    const SPAWN_MARGIN = 48;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      trail: [number, number][];
      teal: boolean;
      age: number;
      swirl: number;
      swirlSpeed: number;
      wobble: number;
    };

    function createParticle(x: number, y: number): Particle {
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: 0.45 + Math.random() * 0.95,
        opacity: 0.1 + Math.random() * 0.22,
        trail: [],
        teal: Math.random() < 0.12,
        age: 0,
        swirl: Math.random() * Math.PI * 2,
        swirlSpeed: 0.0018 + Math.random() * 0.0018,
        wobble: 0.0008 + Math.random() * 0.0012,
      };
    }

    function spawnAnywhere(): Particle {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      return createParticle(Math.random() * w, Math.random() * h);
    }

    function spawnFromEdge(): Particle {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const side = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;

      if (side === 0) {
        x = -SPAWN_MARGIN;
        y = Math.random() * h;
      } else if (side === 1) {
        x = w + SPAWN_MARGIN;
        y = Math.random() * h;
      } else if (side === 2) {
        x = Math.random() * w;
        y = -SPAWN_MARGIN;
      } else {
        x = Math.random() * w;
        y = h + SPAWN_MARGIN;
      }

      return createParticle(x, y);
    }

    let particles: Particle[] = [];

    function resetParticles() {
      particles = Array.from({ length: N }, spawnAnywhere);
      context.clearRect(0, 0, canvas!.offsetWidth, canvas!.offsetHeight);
    }

    function resize() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetParticles();
    }

    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      context.clearRect(0, 0, w, h);
      const center = getCenter();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = center.x - p.x;
        const dy = center.y - p.y;
        const dist = Math.hypot(dx, dy);
        const safeDist = Math.max(dist, 1);
        p.age += 1;

        if (p.x < -SPAWN_MARGIN || p.x > w + SPAWN_MARGIN || p.y < -SPAWN_MARGIN || p.y > h + SPAWN_MARGIN) {
          particles[i] = spawnFromEdge();
          continue;
        }

        p.swirl += p.swirlSpeed;
        const nx = dx / safeDist;
        const ny = dy / safeDist;
        const tangentialX = -ny;
        const tangentialY = nx;
        const drift = Math.sin(p.swirl) * 0.02;
        p.vx += tangentialX * drift + Math.cos(p.swirl * 0.7) * p.wobble;
        p.vy += tangentialY * drift + Math.sin(p.swirl * 0.7) * p.wobble;
        p.vx += Math.sin(p.age * 0.012 + p.swirl) * 0.006;
        p.vy += Math.cos(p.age * 0.011 + p.swirl) * 0.006;

        p.vx *= DRAG;
        p.vy *= DRAG;

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.trail.push([p.x, p.y]);
        if (p.trail.length > TRAIL) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;

        const centerFade = 0.85 - Math.min(0.35, dist / Math.max(w, h) * 0.25);
        const alpha = p.opacity * centerFade;

        if (speed > 0.12 && p.trail.length > 2) {
          for (let t = 1; t < p.trail.length; t++) {
            const tf = t / p.trail.length;
            context.beginPath();
            context.moveTo(p.trail[t - 1][0], p.trail[t - 1][1]);
            context.lineTo(p.trail[t][0], p.trail[t][1]);
            context.strokeStyle = p.teal
              ? `rgba(45,212,191,${alpha * tf * 0.18})`
              : `rgba(220,232,255,${alpha * tf * 0.14})`;
            context.lineWidth = p.size * tf * 0.35;
            context.lineCap = 'round';
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fillStyle = p.teal ? `rgba(45,212,191,${alpha})` : `rgba(220,232,255,${alpha})`;
        context.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none" />;
}

const CLI_PHASES = [
  {
    label: 'BARE',
    badge: 'High Risk',
    badgeClass: 'border-red-500/30 bg-red-500/10 text-red-400',
    accent: 'text-red-400',
    lines: [
      '// ⚠ score: 38% - high risk',
      'async function callTool(params) {',
      '  return tool.run(params)',
      '}',
    ],
  },
  {
    label: 'SCANNING',
    badge: 'Detecting',
    badgeClass: 'border-white/10 bg-white/5 text-gray-300',
    accent: 'text-[#2DD4BF]',
    lines: [
      '// scanning for missing guards',
      'validate(params, schema)',
      'checkPermissions(params.user)',
      'inspectRetryPolicy(params)',
      'logFindings(report)',
    ],
  },
  {
    label: 'HARDENING',
    badge: 'Applying',
    badgeClass: 'border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]',
    accent: 'text-[#2DD4BF]',
    lines: [
      '// adding protection layers',
      'validate(params, schema)',
      'return await retry(tool.run, {',
      '  attempts: 3, backoff: true',
      '})',
    ],
  },
  {
    label: 'HARDENED',
    badge: 'Production Ready',
    badgeClass: 'border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]',
    accent: 'text-[#2DD4BF]',
    lines: [
      '// score: 91% - production ready',
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

function CliPhaseView({ phase }: { phase: (typeof CLI_PHASES)[number] }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timeouts: number[] = [];

    const resetId = window.setTimeout(() => {
      setVisibleLines(1);
    }, 140);

    phase.lines.forEach((_, index) => {
      if (index === 0) return;
      timeouts.push(
        window.setTimeout(() => {
          setVisibleLines(index + 1);
        }, 140 + index * CLI_LINE_DELAY_MS),
      );
    });

    return () => {
      window.clearTimeout(resetId);
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [phase]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="font-mono text-sm text-gray-400">tool.ts</p>
        <span className={`rounded-md border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${phase.badgeClass}`}>
          {phase.label}
        </span>
      </div>

      <div className="flex flex-col px-5 pt-4 pb-4">
        <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
          <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-gray-500">
            <span>CLI session</span>
            <span className={phase.accent}>{phase.badge}</span>
          </div>

          <div className={`h-[168px] overflow-hidden ${CLI_CODE_TEXT}`}>
            {phase.lines.map((line, index) => (
              <div
                key={`${phase.label}-${index}`}
                className={`flex items-start gap-2 break-words py-0.5 transition-all duration-500 ${
                  index < visibleLines ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                }`}
              >
                <span className="w-4 flex-none text-left text-gray-600 select-none">{index}</span>
                <span className={index === 0 ? phase.accent : 'text-gray-200'}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gray-500">What we automatically improve</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {['Validation Rules', 'Retry Safety', 'Observability', 'Guardrails'].map((badge) => (
              <span key={badge} className="w-full rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-center text-[11px] font-medium text-gray-300">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function HeroCard() {
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'NVIDIA', href: '#nvidia' },
    { label: 'Pricing', href: '#pricing' },
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
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" />
          <path d="M7 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.5 15h4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
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
  ];

  const steps = [
    {
      n: '01',
      title: 'Connect GitHub',
      desc: 'One-click import of your tools and skills.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      n: '02',
      title: 'Get Instantly Scored',
      desc: 'See a clear Production Readiness Score and prioritized findings.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      n: '03',
      title: '80-90% Auto-Hardened',
      desc: 'We generate validation, retries, observability, and guardrails for you.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      n: '04',
      title: 'Review & Export',
      desc: 'Approve changes in minutes, export hardened versions, or push back to GitHub.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
  ];

  const pricingTiers = [
    {
      name: 'Try It Free',
      price: 'Free',
      period: '',
      best: 'Testing the experience',
      features: ['1 repo', 'Core auto-hardening', 'Local inference'],
      cta: 'Get Started Free',
      highlight: false,
    },
    {
      name: 'Builder',
      price: '$9.98',
      period: '/user/mo',
      best: 'Serious builders & individuals',
      features: ['BYOK', 'Up to 10 repos', 'GitHub Action', 'Badges & full exports'],
      cta: 'Start Building',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$29.98',
      period: '/user/mo',
      best: 'Teams and heavy users',
      features: ['Unlimited repos', 'Guided clarification', 'Early agent features', 'Priority support'],
      cta: 'Go Pro',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      best: 'Production agent platforms',
      features: ['Full agent hardening', 'SSO & on-prem', 'SLA guarantees', 'Dedicated support'],
      cta: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050506] text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#050506]/85 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <a href="#" className="justify-self-start">
            <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} priority className="h-7 w-auto" />
          </a>

          <div className="hidden items-center justify-center gap-8 text-sm font-medium text-gray-400 md:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors duration-200 hover:text-white">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center justify-end gap-4 md:flex">
            <a href="#" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
              Login
            </a>
              <a
              href={githubRepoUrl}
              className="rounded-xl bg-[#2DD4BF] px-5 py-2 text-sm font-bold text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]"
            >
              Try It Free
            </a>
          </div>

          <button className="justify-self-end text-gray-400 transition-colors hover:text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/5 bg-[#050506]/98 px-4 py-5 backdrop-blur-md md:hidden">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="block text-sm text-gray-300 hover:text-white">
                  {link.label}
                </a>
              ))}
              <a href={githubRepoUrl} className="block rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-center text-sm font-bold text-[#08121F]">
                Try It Free
              </a>
            </div>
          </div>
        )}
      </nav>

      <main>
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#050506]">
          <div className="absolute inset-0 pointer-events-none">
            <HeroParticles />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-40 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center lg:items-stretch">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2.5 bg-[#2DD4BF]/10 border border-[#2DD4BF]/25 rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-pulse" />
                  <span className="text-[#2DD4BF] text-xs font-bold uppercase tracking-wider">
                    AI Tool Hardening - Now in Beta
                  </span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  Make Your AI Tools{' '}
                  <span className="text-[#2DD4BF]">Production&#8209;Ready</span>{' '}
                  in Minutes
                </h1>

                <p className="text-xl text-gray-300 font-light leading-relaxed">
                  Average Production Readiness Score goes from{' '}
                  <span className={`${bebasNeue.className} tracking-[0.04em] font-bold text-red-400`}>38%</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className={`${bebasNeue.className} tracking-[0.04em] font-bold text-[#2DD4BF]`}>91%</span>.
                </p>

                <div className="flex gap-3 pt-2">
                  <a
                    href={githubRepoUrl}
                    className="inline-flex items-center gap-2 bg-[#2DD4BF] text-[#0A0F1E] font-bold px-5 py-2 rounded-xl hover:bg-[#22B8A6] transition-all hover:scale-105 text-sm"
                  >
                    Try It Free — Connect GitHub
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 border border-white/20 text-white font-bold px-5 py-2 rounded-xl hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF] transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch 45-second demo
                  </a>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end h-full">
                <HeroCard />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 bg-[#050506]/88 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
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

        <section className="bg-[#080809] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#2DD4BF]">AI Solutions</p>
              <h2 className="text-4xl font-black leading-tight lg:text-5xl">What we automate for teams that need real output.</h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-400">
                We build the rails around AI workflows so your team can move faster without losing reliability, visibility, or control.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { title: 'Workflow Automation', desc: 'Automate repetitive tasks, approvals, and handoffs across systems.' },
                { title: 'AI Assistant', desc: 'Delegate daily work with assistants that stay on task and on policy.' },
                { title: 'Custom Projects', desc: 'Tailored implementation for the exact operations your team runs.' },
              ].map((card, index) => (
                <div key={card.title} className="h-full rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-[#2DD4BF]/30">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#2DD4BF]">0{index + 1}</p>
                  <h3 className="mb-3 text-xl font-bold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#0D0D10] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#2DD4BF]">Simple Process</p>
              <h2 className="text-4xl font-black">How it works</h2>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.n} className="h-full rounded-3xl border border-white/8 bg-[#131317] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF]">
                      {step.icon}
                    </div>
                    <span className={`${bebasNeue.className} text-3xl tracking-[0.04em] text-white/10`}>{step.n}</span>
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="nvidia" className="bg-[#080809] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[32px] border border-[#2DD4BF]/20 bg-[linear-gradient(135deg,rgba(20,20,24,0.98),rgba(10,10,12,0.98))] p-8 lg:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#2DD4BF]/6 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#76b900]/5 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="inline-flex rounded-full border border-[#76b900]/30 bg-[#76b900]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#76b900]">
                    NVIDIA Partner
                  </span>
                  <h2 className="mt-5 text-3xl font-black leading-tight lg:text-4xl">
                    Built for production.
                    <span className="block text-[#2DD4BF]">Designed to work with NVIDIA OpenShell.</span>
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
                    Trustabl is the bridge from prototype AI workflows to governed deployment, compliance, and repeatable execution.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {['Reference deployment platform', 'Compatibility checks', 'Policy-aware exports', 'Future bidirectional sync'].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#0D0D10] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#2DD4BF]">Pricing</p>
              <h2 className="text-4xl font-black">Start free. Upgrade when you are ready.</h2>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex h-full flex-col rounded-3xl p-6 ${
                    tier.highlight
                      ? 'border-2 border-[#2DD4BF] bg-[#2DD4BF]/10 shadow-xl shadow-[#2DD4BF]/10'
                      : 'border border-white/8 bg-[#141419]'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-[#2DD4BF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] text-[#08121F]">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="mb-1 font-bold text-white">{tier.name}</h3>
                    <p className="text-xs text-gray-500">{tier.best}</p>
                  </div>

                  <div className="mb-6">
                    <span className={`${bebasNeue.className} text-4xl tracking-[0.04em] ${tier.highlight ? 'text-[#2DD4BF]' : 'text-white'}`}>
                      {tier.price}
                    </span>
                    {tier.period && <span className="ml-1.5 text-xs text-gray-500">{tier.period}</span>}
                  </div>

                  <ul className="mb-6 flex-1 space-y-2 text-sm text-gray-300">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className={tier.highlight ? 'text-[#2DD4BF]' : 'text-gray-600'}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                      tier.highlight ? 'bg-[#2DD4BF] text-[#08121F] hover:bg-[#22B8A6]' : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#050506] py-12">
        <div className="mx-auto max-w-7xl px-4 text-gray-500 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3 items-start">
            <div>
              <a href="#" className="mb-4 inline-flex items-center">
                <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} className="h-6 w-auto opacity-80" />
              </a>
              <p className="max-w-xs text-xs leading-relaxed">
                AI tool hardening for production teams.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-sm">
              <div>
                <p className="mb-4 font-bold text-white">Product</p>
                <ul className="space-y-2.5 text-gray-500">
                  <li><a href="#how-it-works" className="transition-colors hover:text-[#2DD4BF]">How it Works</a></li>
                  <li><a href="#nvidia" className="transition-colors hover:text-[#2DD4BF]">NVIDIA &amp; OpenShell</a></li>
                  <li><a href="#pricing" className="transition-colors hover:text-[#2DD4BF]">Pricing</a></li>
                </ul>
              </div>
              <div>
                <p className="mb-4 font-bold text-white">Company</p>
                <ul className="space-y-2.5 text-gray-500">
                  <li><a href="#" className="transition-colors hover:text-[#2DD4BF]">Agents Roadmap</a></li>
                  <li><a href="#" className="transition-colors hover:text-[#2DD4BF]">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/5 pt-8 text-center">
            <p className="text-xs text-gray-700">Trustabl © 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

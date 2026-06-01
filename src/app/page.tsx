'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  GitBranch, BarChart3, ShieldCheck, Download,
  Clock, TrendingDown, Eye,
  Play, Terminal,
  Zap, DollarSign, Activity, Settings2, TrendingUp,
  Monitor, Wrench, FileText, Cpu, Code2, Link2,
} from 'lucide-react';

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

/* ── Flow purification animation ── */
const FLOW_PILLS = [
  'retry logic',    'observability',    'validation',      'guardrails',
  'tracing',        'schema check',     'tool hardening',  'runtime safety',
  'type safety',    'error handling',   'rate limiting',   'input sanitizing',
  'timeout config', 'fallback logic',   'audit logging',   'policy check',
];

// Icons deliberately different from value-prop cards (ShieldCheck/Clock/TrendingDown/Eye)
const FLOW_ICON_DATA: { paths: string[]; circles: {cx:number;cy:number;r:number}[]; filled?: {cx:number;cy:number;r:number}[] }[] = [
  // GitBranch — versioning / connect
  { paths: ['M6 3v12', 'M6 15a9 9 0 009-9'], circles: [{ cx: 18, cy: 9, r: 3 }, { cx: 6, cy: 21, r: 3 }] },
  // RefreshCw — retry logic
  { paths: ['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0114.85-3.36L23 10', 'M1 14l4.64 4.36A9 9 0 0020.49 15'], circles: [] },
  // AlertTriangle — warnings
  { paths: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4'], circles: [], filled: [{ cx: 12, cy: 17, r: 1 }] },
  // Lock — guardrails / security
  { paths: ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z', 'M7 11V7a5 5 0 0110 0v4'], circles: [] },
  // Search — inspection
  { paths: ['M21 21l-4.35-4.35'], circles: [{ cx: 11, cy: 11, r: 8 }] },
  // Activity — monitoring
  { paths: ['M22 12L18 12L15 21L9 3L6 12L2 12'], circles: [] },
  // Zap — performance
  { paths: ['M13 2L3 14L12 14L11 22L21 10L12 10Z'], circles: [] },
  // Code2 — code quality
  { paths: ['M10 20l4-16', 'M17 8l4 4-4 4', 'M7 8L3 12l4 4'], circles: [] },
];

function FlowPurification() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = 0, H = 0, cx = 0, cy = 0;

    type P = { x: number; y: number; vx: number; vy: number; label: string; icon: boolean; iconIdx: number; age: number; life: number };

    // Build icon draw functions from Path2D
    const iconDrawers = FLOW_ICON_DATA.map(({ paths, circles, filled }) =>
      (c: CanvasRenderingContext2D) => {
        paths.forEach(d => c.stroke(new Path2D(d)));
        circles.forEach(({ cx, cy, r }) => {
          c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
        });
        filled?.forEach(({ cx, cy, r }) => {
          c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
        });
      }
    );

    // Round-robin cursors — guarantees no two visible particles share same content
    let pillCursor = 0;
    let iconCursor = 0;

    function spawn(ageOffset = 0): P {
      const fromLeft = Math.random() < 0.5;
      const x = fromLeft ? -18 : W + 18;
      const y = Math.random() * H;

      const speed = 0.50 + Math.random() * 0.30;
      const angle = Math.atan2(cy - y, cx - x) + (Math.random() - 0.5) * 0.22;
      const life  = Math.ceil(Math.hypot(cx - x, cy - y) / speed);
      const isIcon = Math.random() < 0.45;
      const label = isIcon ? '' : FLOW_PILLS[pillCursor++ % FLOW_PILLS.length];
      const iconIdx = iconCursor++ % FLOW_ICON_DATA.length;

      const p: P = { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                     label, icon: isIcon, iconIdx, age: 0, life };
      if (ageOffset > 0) {
        const steps = Math.min(ageOffset, Math.floor(life * 0.8));
        p.x += p.vx * steps; p.y += p.vy * steps; p.age = steps;
      }
      return p;
    }

    // Shared neutral palette
    const BG   = 'rgba(255,255,255,0.05)';
    const BORD = 'rgba(255,255,255,0.14)';
    const TXT  = 'rgba(190,192,200,0.80)';

    function drawParticle(p: P, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;

      if (p.icon) {
        // Circle with Lucide icon inside
        const r = 16;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = BG; ctx!.fill();
        ctx!.strokeStyle = BORD; ctx!.lineWidth = 1; ctx!.stroke();
        // Draw Lucide icon via Path2D, scaled+centered
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.scale(0.75, 0.75);
        ctx!.translate(-12, -12);
        ctx!.strokeStyle = 'rgba(175,180,198,0.75)';
        ctx!.fillStyle   = 'rgba(175,180,198,0.75)';
        ctx!.lineWidth = 1.8 / 0.75;
        ctx!.lineCap = 'round';
        ctx!.lineJoin = 'round';
        iconDrawers[p.iconIdx]?.(ctx!);
        ctx!.restore();
      } else {
        // Pill badge
        ctx!.font = '500 14px -apple-system,BlinkMacSystemFont,sans-serif';
        const tw = ctx!.measureText(p.label).width;
        const pw = tw + 16, ph = 20, brad = 10;
        const px = p.x - pw / 2, py = p.y - ph / 2;
        ctx!.beginPath();
        ctx!.moveTo(px + brad, py);
        ctx!.lineTo(px + pw - brad, py);
        ctx!.quadraticCurveTo(px + pw, py, px + pw, py + brad);
        ctx!.lineTo(px + pw, py + ph - brad);
        ctx!.quadraticCurveTo(px + pw, py + ph, px + pw - brad, py + ph);
        ctx!.lineTo(px + brad, py + ph);
        ctx!.quadraticCurveTo(px, py + ph, px, py + ph - brad);
        ctx!.lineTo(px, py + brad);
        ctx!.quadraticCurveTo(px, py, px + brad, py);
        ctx!.closePath();
        ctx!.fillStyle = BG; ctx!.fill();
        ctx!.strokeStyle = BORD; ctx!.lineWidth = 1; ctx!.stroke();
        ctx!.fillStyle = TXT; ctx!.textAlign = 'center'; ctx!.textBaseline = 'middle';
        ctx!.fillText(p.label, p.x, p.y + 0.5);
      }
      ctx!.restore();
    }

    const N = 10;
    const pts: P[] = Array.from({ length: N }, (_, i) => spawn(Math.floor((i / N) * 340)));
    let raf = 0;

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.age++; p.x += p.vx; p.y += p.vy;
        const dist = Math.hypot(cx - p.x, cy - p.y);
        if (dist < 26 || p.age >= p.life) { pts[i] = spawn(0); continue; }
        const t = p.age / p.life;
        const alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
        drawParticle(p, alpha);
      }
      raf = requestAnimationFrame(draw);
    }

    function resize() {
      W = canvas!.offsetWidth; H = canvas!.offsetHeight;
      canvas!.width = W * dpr; canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2;
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div
      className="relative h-full min-h-[368px] w-full overflow-hidden rounded-3xl border border-white/8 bg-[#080809]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

      {/* Core — DOM overlay so it stays crisp */}
      <div className="absolute" style={{ left: '50%', top: '50%', zIndex: 2 }}>
        {[0, 0.75, 1.5].map(d => (
          <div key={d} className="absolute rounded-[18px] border border-[#2DD4BF]/15"
            style={{ width: 60, height: 60, top: -30, left: -30,
              animation: `coreRing 2.2s ease-out ${d}s infinite` }} />
        ))}
        <div className="relative flex items-center justify-center rounded-[18px] bg-[#0B0B0D]"
          style={{ width: 60, height: 60, marginTop: -30, marginLeft: -30,
            border: '1px solid rgba(45,212,191,0.30)',
            animation: 'coreGlow 2s ease-in-out infinite' }}>
          <svg className="h-6 w-6" viewBox="0 0 612 633" fill="#2DD4BF" xmlns="http://www.w3.org/2000/svg">
            <path d="M150.066 523.027C150.066 523.027 266.828 630.601 300.296 632.297C333.764 633.992 552.581 495.592 581.992 243.134C581.992 243.134 470.79 353.155 468.772 357.964C466.754 362.772 394.924 505.231 298.514 544.173L150.066 523.027Z"/>
            <path d="M206.247 374.515L300.403 460.278L605.928 152.563C605.928 152.563 615.353 137.987 609.9 122.144C604.447 106.301 581.133 92.3682 581.133 92.3682C581.133 92.3682 563.895 88.6973 548.932 98.9588C533.969 109.22 298.407 349.012 298.407 349.012L206.226 374.537L206.247 374.515Z"/>
            <path d="M393.896 3.21383C393.896 3.21383 181.819 -13.3805 133.496 28.846C133.496 28.846 101.38 53.1901 94.6396 120.104C94.6396 120.104 181.969 78.3929 268.419 83.3519C354.868 88.3109 393.918 3.21383 393.918 3.21383H393.896Z"/>
            <path d="M186.241 8.51621C186.241 8.51621 83.1752 24.0372 13.5991 76.0958C-7.67515 92.0032 -4.69113 181.286 27.5315 209.173C46.058 225.187 206.227 374.515 206.227 374.515C206.227 374.515 246.693 379.581 275.094 368.762L298.408 348.99C298.408 348.99 97.8589 169.308 95.841 145.951C93.823 122.594 109.022 36.703 186.219 8.49475L186.241 8.51621Z"/>
            <path d="M341.599 209.345V117.764C341.599 117.764 351.238 81.4414 387.389 86.336C423.54 91.2306 452.951 101.707 470.533 92.583C488.115 83.4593 497.732 59.8881 479.742 28.4597C461.752 -2.96868 366.179 -0.693158 344.647 11.9941C323.116 24.6814 270.37 50.2706 262.771 104.519V231.928C262.771 231.928 278.571 266.405 300.875 264.044C323.18 261.682 332.475 256.788 341.256 235.814L341.599 209.366V209.345Z"/>
            <path d="M298.516 544.173C298.516 544.173 181.067 467.126 143.22 375.696C143.22 375.696 122.44 329.391 82.5531 353.735C82.5531 353.735 48.4198 371.317 67.0107 404.098C85.6015 436.878 125.896 502.118 150.863 523.736C150.863 523.736 214.363 578.821 298.516 544.173Z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scanTick, setScanTick] = useState(0);
  const [copied, setCopied] = useState(false);
  const [atmModal, setAtmModal] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  function copyLink() {
    navigator.clipboard.writeText('https://trustabl.ai');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  useEffect(() => {
    const iv = setInterval(() => setScanTick(t => t + 1), 7000);
    return () => clearInterval(iv);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'NVIDIA', href: '#openshell' },
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
  ];

  const valueProps = [
    {
      title: 'Dramatically fewer runtime failures',
      desc: 'Catch invalid parameters, retry mistakes, and silent breaks before they reach production.',
    },
    {
      title: 'Much less debugging time',
      desc: 'See prioritized findings and fix the risky parts without digging through every tool path manually.',
    },
    {
      title: 'Lower token waste',
      desc: 'Reduce bad calls, failed loops, and repeated retries that quietly burn budget.',
    },
    {
      title: 'Clear visibility',
      desc: 'Understand what your tools are doing instead of guessing from sparse logs.',
    },
  ];

  const steps = [
    {
      n: '01',
      title: 'Connect GitHub',
      desc: 'One-click import of your tools and skills.',
      icon: <GitBranch className="h-5 w-5" />,
    },
    {
      n: '02',
      title: 'Get Instantly Scored',
      desc: 'See a clear Production Readiness Score and prioritized findings.',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      n: '03',
      title: '80-90% Auto-Hardened',
      desc: 'We generate validation, retries, observability, and guardrails for you.',
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      n: '04',
      title: 'Review & Export',
      desc: 'Approve changes in minutes and export hardened versions back to GitHub.',
      icon: <Download className="h-5 w-5" />,
    },
  ];

  const problemBullets = [
    {
      title: 'Hallucinated or wrong tool calls',
      desc: 'A tool can look correct in a demo and still route the wrong action, wrong arguments, or wrong side effect once real prompts hit production.',
    },
    {
      title: 'Missing validation and retry logic',
      desc: '',
    },
    {
      title: 'No visibility into what is actually happening',
      desc: '',
    },
    {
      title: 'High token waste from loops and failures',
      desc: 'Bad retries, repeated loops, and noisy fallback logic burn budget fast without improving outcomes.',
    },
  ];

  const beforeBullets = [
    'No retry logic leads to duplicate side effects',
    'Missing validation leads to invalid tool calls',
    'No observability makes debugging painful',
  ];

  const afterBullets = [
    'Retry safety and validation are added automatically',
    'Applicability constraints and observability hooks are generated',
    'Clear workflow guidance is surfaced for the team',
  ];

  const trustHighlights = [
    'OpenShell as our reference deployment platform',
    '1-click hardened and sandboxed export',
    'Pre-flight compatibility checks against OpenShell policies',
    'Policy-aware recommendations for routing and constraints',
    'Future bidirectional policy sync',
  ];

  const roadmapItems = [
    {
      id: 'now',
      content: 'Now: harden individual tools for production use.',
    },
    {
      id: 'next',
      content: (
        <>
          Next: add support for skills, including prompt hardening and
          <br />
          logic improvements.
        </>
      ),
    },
    {
      id: 'later',
      content: 'Later: expand into full agent system support.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Open Source',
      price: 'Free',
      period: '',
      best: 'Trust / Reliability Scanner',
      features: [
        'Scan for agent/tool issues',
        'Instant quality score',
        'Identifies issues and omissions',
        'Suggests remediations',
      ],
      cta: 'Start Free',
      highlight: false,
    },
    {
      name: 'Try It',
      price: 'Free',
      period: '',
      best: 'No Credit Card / No Account',
      features: [
        '1 repo',
        'GitHub connect',
        'Full auto-enrichment',
        '91–93 quality',
        'Rate limited',
      ],
      cta: 'Start Free',
      highlight: true,
    },
    {
      name: 'Builder',
      price: '$19.98',
      period: '/ user / mo',
      best: 'Serious individual builders\nDaily power users',
      features: [
        'Unlimited repos',
        'Priority Speed',
        'Advance Scoring',
        'Guided Enrichment',
        'Export Bundles',
        'Priority Support',
      ],
      cta: 'Choose Builder',
      highlight: false,
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
      a: 'Trustabl automatically hardens AI agent tools for production by generating rich, reliable metadata — including schemas, validation rules, retry policies, observability, security policies, and supply-chain attestations. It turns fragile, demo-grade tools into production-ready ones in minutes.',
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
      a: 'Yes. You can connect your GitHub repo and harden tools for free with no credit card required. Many teams start by hardening their most critical tools to see the immediate impact.',
    },
    {
      q: "What's coming next for Trustabl?",
      a: "We're actively building company policy enforcement, deeper OpenShell integration, expanded CI/CD plugins, and advanced analytics on tool usage patterns across your agent fleet.",
    },
  ];

  const renderStepVisual = (stepNumber: string) => {
    switch (stepNumber) {
      case '01':
        return (
          <div className="flex h-36 items-center justify-center gap-0 overflow-hidden rounded-2xl border border-white/8 bg-[#0A0A0C]">
            {/* Left node — Trustabl */}
            <div className="z-10 flex flex-shrink-0 items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.04] pl-3 pr-5 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
                <svg className="h-4 w-4" viewBox="0 0 612 633" fill="#2DD4BF">
                  <path d="M150.066 523.027C150.066 523.027 266.828 630.601 300.296 632.297C333.764 633.992 552.581 495.592 581.992 243.134C581.992 243.134 470.79 353.155 468.772 357.964C466.754 362.772 394.924 505.231 298.514 544.173L150.066 523.027Z"/>
                  <path d="M206.247 374.515L300.403 460.278L605.928 152.563C605.928 152.563 615.353 137.987 609.9 122.144C604.447 106.301 581.133 92.3682 581.133 92.3682C581.133 92.3682 563.895 88.6973 548.932 98.9588C533.969 109.22 298.407 349.012 298.407 349.012L206.226 374.537L206.247 374.515Z"/>
                  <path d="M393.896 3.21383C393.896 3.21383 181.819 -13.3805 133.496 28.846C133.496 28.846 101.38 53.1901 94.6396 120.104C94.6396 120.104 181.969 78.3929 268.419 83.3519C354.868 88.3109 393.918 3.21383 393.918 3.21383H393.896Z"/>
                  <path d="M186.241 8.51621C186.241 8.51621 83.1752 24.0372 13.5991 76.0958C-7.67515 92.0032 -4.69113 181.286 27.5315 209.173C46.058 225.187 206.227 374.515 206.227 374.515C206.227 374.515 246.693 379.581 275.094 368.762L298.408 348.99C298.408 348.99 97.8589 169.308 95.841 145.951C93.823 122.594 109.022 36.703 186.219 8.49475L186.241 8.51621Z"/>
                  <path d="M341.599 209.345V117.764C341.599 117.764 351.238 81.4414 387.389 86.336C423.54 91.2306 452.951 101.707 470.533 92.583C488.115 83.4593 497.732 59.8881 479.742 28.4597C461.752 -2.96868 366.179 -0.693158 344.647 11.9941C323.116 24.6814 270.37 50.2706 262.771 104.519V231.928C262.771 231.928 278.571 266.405 300.875 264.044C323.18 261.682 332.475 256.788 341.256 235.814L341.599 209.366V209.345Z"/>
                  <path d="M298.516 544.173C298.516 544.173 181.067 467.126 143.22 375.696C143.22 375.696 122.44 329.391 82.5531 353.735C82.5531 353.735 48.4198 371.317 67.0107 404.098C85.6015 436.878 125.896 502.118 150.863 523.736C150.863 523.736 214.363 578.821 298.516 544.173Z"/>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold leading-none text-white">Trustabl</p>
                <p className="mt-1 text-[10px] leading-none text-gray-500">AI Hardening</p>
              </div>
            </div>

            {/* Curved connector — 160px fixed width, trail via staggered dots */}
            <div className="relative h-full w-40 flex-shrink-0">
              <svg width="160" height="144" viewBox="0 0 160 144" className="absolute inset-0">
                {/* Track */}
                <path
                  d="M0,72 C40,108 120,36 160,72"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* End anchors */}
                <circle cx="0"   cy="72" r="2.5" fill="rgba(255,255,255,0.16)" />
                <circle cx="160" cy="72" r="2.5" fill="rgba(255,255,255,0.16)" />

                {/* Solid comet trail — 8 tightly-spaced dots behind main (positive begin = behind) */}
                {[
                  { begin: '0.35s', r: 0.8,  op: 0.04 },
                  { begin: '0.28s', r: 1.2,  op: 0.09 },
                  { begin: '0.22s', r: 1.6,  op: 0.17 },
                  { begin: '0.16s', r: 2.0,  op: 0.28 },
                  { begin: '0.11s', r: 2.3,  op: 0.42 },
                  { begin: '0.07s', r: 2.6,  op: 0.58 },
                  { begin: '0.03s', r: 2.8,  op: 0.75 },
                ].map(({ begin, r, op }, i) => (
                  <circle key={i} r={r} fill="#2DD4BF" opacity={op}>
                    <animateMotion dur="3.2s" begin={begin} repeatCount="indefinite"
                      calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"
                      path="M0,72 C40,108 120,36 160,72" />
                  </circle>
                ))}
                {/* Glow halo */}
                <circle r="6" fill="rgba(45,212,191,0.16)">
                  <animateMotion dur="3.2s" begin="0s" repeatCount="indefinite"
                    calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"
                    path="M0,72 C40,108 120,36 160,72" />
                </circle>
                {/* Main dot */}
                <circle r="3" fill="#2DD4BF">
                  <animateMotion dur="3.2s" begin="0s" repeatCount="indefinite"
                    calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"
                    path="M0,72 C40,108 120,36 160,72" />
                </circle>
              </svg>
            </div>

            {/* Right node — GitHub */}
            <div className="z-10 flex flex-shrink-0 items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.04] pl-3 pr-5 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="rgb(209,213,219)">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold leading-none text-white">GitHub</p>
                <p className="mt-1 text-[10px] leading-none text-gray-500">Repository</p>
              </div>
            </div>
          </div>
        );
      case '02': {
        const findings = [
          { icon: '✗', label: 'Missing retry logic',    badge: 'HIGH', cls: 'text-red-400',    badgeCls: 'bg-red-500/15 text-red-400' },
          { icon: '⚠', label: 'No input validation',    badge: 'MED',  cls: 'text-yellow-400', badgeCls: 'bg-yellow-500/15 text-yellow-400' },
          { icon: '✓', label: 'Schema structure OK',     badge: null,   cls: 'text-[#2DD4BF]',  badgeCls: '' },
        ];
        return (
          <div key={scanTick} className="flex h-36 flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0A0A0C] px-4 py-3">
            {/* Findings */}
            <div className="space-y-1.5">
              {findings.map((f, i) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 opacity-0"
                  style={{ animation: 'fadeSlideIn 0.5s cubic-bezier(0.25,0.1,0.25,1) forwards', animationDelay: `${0.25 + i * 0.38}s` }}
                >
                  <span className={`text-sm font-bold ${f.cls}`}>{f.icon}</span>
                  <span className="flex-1 truncate text-xs text-gray-300">{f.label}</span>
                  {f.badge && (
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${f.badgeCls}`}>
                      {f.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Score */}
            <div
              className="flex items-center gap-2 border-t border-white/8 pt-2 opacity-0"
              style={{ animation: 'fadeSlideIn 0.5s cubic-bezier(0.25,0.1,0.25,1) forwards', animationDelay: '1.85s' }}
            >
              <span className="text-xs text-gray-500">Score</span>
              <span className="text-sm font-bold text-red-400">38%</span>
              <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 uppercase tracking-wide">High Risk</span>
            </div>
          </div>
        );
      }
      case '03':
        return <ScoreRing tick={scanTick} />;
      default:
        return (
          <div className="flex h-36 items-center justify-center gap-5 overflow-hidden rounded-2xl border border-white/8 bg-[#0A0A0C]">
            {/* Approved */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10">
                <span className="text-xl font-black text-[#2DD4BF]">✓</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#2DD4BF]">Approved</span>
            </div>
            {/* Arrow — pulsates continuously */}
            <div className="flex items-center gap-0.5"
              style={{ animation: 'arrowPulse 1.4s ease-in-out infinite' }}>
              <div className="h-px w-10 bg-[#2DD4BF]/40" />
              <svg className="h-3 w-3 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            {/* GitHub */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="rgba(209,213,219,0.85)">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">GitHub</span>
            </div>
          </div>
        );
    }
  };

  const renderValuePropIcon = (index: number) => {
    const cls = 'h-4 w-4';
    switch (index) {
      case 0:
        return <ShieldCheck className={cls} />;
      case 1:
        return <Clock className={cls} />;
      case 2:
        return <TrendingDown className={cls} />;
      default:
        return <Eye className={cls} />;
    }
  };

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
                <a key={link.label} href={link.href} className="block text-sm text-gray-300 hover:text-white">
                  {link.label}
                </a>
              ))}
              <a href={githubRepoUrl} className="block rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-center text-sm font-medium text-[#08121F]">
                Try It
              </a>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* ── ANNOUNCEMENT ── */}
        <div className="mt-16 border-b border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.06] px-4 py-2.5 text-center">
          <p className="text-xs font-medium text-[#2DD4BF]">
            <span className="mr-2 inline-flex items-center rounded-md border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Pre-release</span>
            Some features are still in development and will be available soon.
          </p>
        </div>

        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050506]">
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

                <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  Most agent tools work in demos.{' '}
                  <span className="text-[#2DD4BF]">They break in production.</span>
                </h1>

                <p className="text-xl font-light leading-relaxed text-gray-300 sm:whitespace-nowrap">
                  Average Production Readiness Score goes from{' '}
                  <span className="whitespace-nowrap">
                    <span className="font-semibold tracking-[0.02em] text-red-400">38%</span>
                    <span className="mx-2 text-gray-500">→</span>
                    <span className="font-semibold tracking-[0.02em] text-[#2DD4BF]">91%</span>
                  </span>
                  .
                </p>

                <div className="flex gap-3 pt-2">
                  <a
                    href={githubRepoUrl}
                    className="inline-flex items-center gap-2 bg-[#2DD4BF] text-[#0A0F1E] font-medium px-5 py-2 rounded-xl hover:bg-[#22B8A6] transition-all hover:scale-105 text-sm"
                  >
                    Try It — Connect GitHub
                  </a>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end items-start h-full">
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

        {/* ── BENEFITS ── */}
        <section className="bg-[#050506] py-28 lg:py-32 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Benefits</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Why Teams Use Trustabl</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: <Zap className="h-5 w-5" />,
                  title: 'Higher Agent Success Rate',
                  desc: <>Agents complete tasks more <span className="text-[#2DD4BF]">reliably</span> by using the <span className="text-[#2DD4BF]">right tools at the right time</span>.</>,
                },
                {
                  icon: <DollarSign className="h-5 w-5" />,
                  title: 'Lower Token & API Costs',
                  desc: <>Reduce <span className="text-[#2DD4BF]">wasted tokens</span> and <span className="text-[#2DD4BF]">expensive retries</span> through <span className="text-[#2DD4BF]">smarter tool definitions</span>.</>,
                },
                {
                  icon: <Activity className="h-5 w-5" />,
                  title: 'Faster Debugging & Observability',
                  desc: <>Turn agent behavior from a <span className="text-[#2DD4BF]">black box</span> into something you can actually <span className="text-[#2DD4BF]">trace and debug</span>.</>,
                },
                {
                  icon: <Clock className="h-5 w-5" />,
                  title: 'Less Manual Hardening Work',
                  desc: <>Automatically generate <span className="text-[#2DD4BF]">production-grade metadata</span> that would otherwise take <span className="text-[#2DD4BF]">hours or days</span> to create manually.</>,
                },
                {
                  icon: <ShieldCheck className="h-5 w-5" />,
                  title: 'Stronger Security & Compliance',
                  desc: <>Get <span className="text-[#2DD4BF]">least-privilege policies</span>, <span className="text-[#2DD4BF]">audit trails</span>, and <span className="text-[#2DD4BF]">supply chain attestations</span> by default.</>,
                },
                {
                  icon: <Settings2 className="h-5 w-5" />,
                  title: 'Future-Proof Integrations',
                  desc: <>Works seamlessly with <span className="text-[#2DD4BF]">modern agent frameworks and runtimes</span> out of the box.</>,
                },
                {
                  icon: <TrendingUp className="h-5 w-5" />,
                  title: 'Continuous Improvement',
                  desc: <>Tools get better over time using <span className="text-[#2DD4BF]">real runtime feedback</span>.</>,
                },
              ].map((card) => (
                <div key={card.title} className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-[#2DD4BF]/30">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                    {card.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-400">{card.desc}</p>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-[#2DD4BF] transition-colors hover:text-white">
                    Learn how
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Summary CTA card */}
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.04] p-6 text-center">
                <h3 className="text-base font-semibold text-white">See everything Trustabl generates</h3>
                <p className="text-sm text-gray-400">See the complete list of metadata fields Trustabl generates</p>
                <a href="/products" className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-[#2DD4BF]/30 px-4 py-2 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF]/10">
                  View Products
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">How it works</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Four steps. Minutes, not days.</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="space-y-4 md:col-span-2 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                {steps.map((step) => (
                  <div key={step.n} className="rounded-3xl border border-white/8 bg-[#131317] p-5">
                    <div className="mb-4">
                      {renderStepVisual(step.n)}
                    </div>
                    <div className="mb-4 flex min-w-0 items-baseline gap-2">
                      <span className="text-sm font-medium tracking-[0.12em] text-[#2DD4BF]">{step.n}</span>
                      <span className="text-sm font-medium tracking-[0.06em] text-gray-500">—</span>
                      <h3 className="min-w-0 truncate text-sm font-medium text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <section className="bg-[#050506] py-28 lg:py-32" id="outcomes">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-5xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">What you actually get</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                The output is smaller risk, clearer behavior, and less time lost to{' '}
                <span className="whitespace-nowrap">broken tools.</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-400 lg:whitespace-nowrap">
                Trustabl is built to make AI tools production-ready without slowing your team down or burying them in manual review.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
              <div className="h-full">
                <FlowPurification />
              </div>

              <div className="grid h-full gap-4 md:grid-cols-2 md:items-stretch">
                {valueProps.map((card, index) => (
                  <div key={card.title} className="flex h-full min-h-[176px] flex-col rounded-3xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-[#2DD4BF]/30">
                    <div className="space-y-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                        {renderValuePropIcon(index)}
                      </div>
                      <h3 className="text-base font-bold leading-snug">{card.title}</h3>
                      <p className="text-sm leading-snug text-gray-400">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">The problem</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Your tools work in demos. They break in production.</h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-400">
                Most AI tools and skills are built quickly and lack the operational hardening needed for real use.{' '}
                <span className="font-inherit text-red-400">Result: Most agent projects never make it to production.</span>
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-[2.2fr_1fr]">
              <article className="overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.03] p-5 lg:p-6">
                <h3 className="text-base font-medium text-white">{problemBullets[0].title}</h3>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                  {/* Intent vs Actual mismatch table */}
                  <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#0D0D10]">
                    <div className="p-4">
                      <div className="mb-3 grid grid-cols-2 gap-2">
                        <div className="flex min-h-[42px] items-center px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2DD4BF]">Intent</p>
                        </div>
                        <div className="flex min-h-[42px] items-center px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Actual</p>
                        </div>
                      </div>
                      {[ 
                        ['create_invoice()', 'refund_invoice() ✗'],
                        ['customer_id: 482', 'invoice_id: 7821 ✗'],
                        ['amount: $150', '— ✗'],
                      ].map(([intent, actual]) => (
                        <div key={intent} className="mb-2 grid grid-cols-2 gap-2">
                          <div className="flex min-h-[42px] items-center rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 font-mono text-xs text-gray-300">{intent}</div>
                          <div className="flex min-h-[42px] items-center rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 font-mono text-xs text-gray-500">{actual}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk signals — clean row list */}
                  <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#0D0D10]">
                    <div className="space-y-2.5 p-5">
                      {['Wrong tool routed', 'Wrong parameters', 'No applicability check', 'Side effect triggered'].map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                          <span className="text-sm font-bold text-gray-600">!</span>
                          <span className="text-xs text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-[30px] border border-white/8 bg-white/[0.03] p-5 lg:p-6">
                <h3 className="text-base font-medium text-white">{problemBullets[1].title}</h3>
                <div className="mt-5 overflow-hidden rounded-[22px] border border-white/8 bg-[#050506]">
                  <div className="space-y-2.5 p-5">
                    {[
                      { label: 'Schema validation',  present: false },
                      { label: 'Input validation',   present: false },
                      { label: 'Retry wrapper',      present: false },
                      { label: 'Base execution',     present: true  },
                    ].map(({ label, present }) => (
                      <div key={label} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-bold ${present ? 'text-gray-600' : 'text-gray-700'}`}>{present ? '✓' : '⊘'}</span>
                          <span className={`text-xs ${present ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
                        </div>
                        <span className={`text-[9px] font-medium uppercase tracking-wider ${present ? 'text-gray-600' : 'text-gray-700'}`}>{present ? 'present' : 'missing'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
              <div className="grid gap-5 lg:col-span-2 lg:grid-cols-[0.78fr_1.22fr]">
              <article className="rounded-[30px] border border-white/8 bg-white/[0.03] p-5 lg:p-6">
                <h3 className="text-base font-medium text-white">{problemBullets[2].title}</h3>
                <div className="mt-5 overflow-hidden rounded-[22px] border border-white/8 bg-[#0D0D10]">
                  <div className="grid grid-cols-2 gap-2 px-4 pt-4 pb-2">
                    {[{ label: 'Latency' }, { label: 'Error rate' }].map(({ label }) => (
                      <div key={label} className="rounded-xl border border-white/8 bg-[#111114] p-3">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">{label}</p>
                        <p className="mt-2 text-xl font-bold text-gray-700">—</p>
                      </div>
                    ))}
                  </div>
                  <div className="mx-4 mb-4 rounded-xl border border-white/8 bg-[#111114] p-3">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">Last trace</p>
                    <p className="mt-2 text-xs text-gray-700">No data available</p>
                    <div className="mt-3 space-y-1.5">
                      {[60, 80, 45].map((w, i) => (
                        <div key={i} className="h-2 rounded-full bg-white/5" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              <article className="overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.03] p-5 lg:p-6">
                <div className="flex flex-col">
                  <h3 className="text-base font-medium text-white">{problemBullets[3].title}</h3>
                </div>

                <div className="mt-5">
                  <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr] xl:items-stretch">
                      <div className="space-y-4 rounded-[20px] border border-white/8 bg-[#0D0D10] p-4">
                        {[
                          ['Loop retries', '68%'],
                          ['Invalid calls', '52%'],
                          ['Context overflow', '44%'],
                          ['Fallback noise', '31%'],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="text-white/80">{label}</span>
                              <span className="text-red-300">{value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/8">
                              <div className="h-2 rounded-full bg-red-400/40" style={{ width: value }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex h-full rounded-[20px] border border-white/8 bg-[#0D0D10] p-4">
                        <div className="relative flex h-full min-h-[168px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#0D0D10]">
                          <div className="relative h-[190px] w-[88%] max-w-[360px]">
                          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {[
                              { d: 'M16 23 C24 25, 28 28, 35 37', stroke: 'rgba(248,113,113,0.65)' },
                              { d: 'M42 38 C50 32, 56 29, 66 25', stroke: 'rgba(248,113,113,0.65)' },
                              { d: 'M69 30 C74 38, 77 47, 76 61', stroke: 'rgba(248,113,113,0.65)' },
                              { d: 'M68 65 C60 70, 48 73, 33 72', stroke: 'rgba(250,204,21,0.55)' },
                              { d: 'M31 68 C22 58, 18 44, 16 23', stroke: 'rgba(250,204,21,0.55)' },
                            ].map(({ d, stroke }, i) => (
                              <path
                                key={i}
                                d={d}
                                fill="none"
                                stroke={stroke}
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeDasharray="3 3"
                                style={{ animation: `streamDash ${1.6 + i * 0.2}s linear ${i * 0.3}s infinite` }}
                              />
                            ))}
                          </svg>
                          <div className="absolute left-[23%] top-[13%] -translate-x-1/2 rounded-full border border-red-500/30 bg-[#0D0D10] px-3 py-2 text-xs text-red-200">bad input</div>
                          <div className="absolute left-[46%] top-[36%] -translate-x-1/2 rounded-full border border-white/10 bg-[#0D0D10] px-3 py-2 text-xs text-gray-200">retry loop</div>
                          <div className="absolute left-[73%] top-[16%] -translate-x-1/2 whitespace-nowrap rounded-full border border-red-500/30 bg-[#0D0D10] px-3 py-2 text-xs text-red-200">invalid tool</div>
                          <div className="absolute left-[75%] top-[62%] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0D0D10] px-3 py-2 text-xs text-gray-200">fallback call</div>
                          <div className="absolute left-[34%] top-[73%] -translate-x-1/2 rounded-full border border-yellow-500/25 bg-[#0D0D10] px-3 py-2 text-xs text-yellow-200">token drain</div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </article>
              </div>
            </div>
          </div>
        </section>

        <section id="before-after" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Before vs after</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                The score changes because the
                <br />
                <span className="whitespace-nowrap">system is actually hardened.</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-7">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-red-400">Before</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-4xl font-semibold tracking-[0.02em] text-red-400 lg:text-5xl">38%</span>
                  <span className="pb-2 text-sm font-medium uppercase tracking-[0.24em] text-red-300">High Risk</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-300">
                  {beforeBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[28px] border border-[#2DD4BF]/20 bg-[#2DD4BF]/6 p-7">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">After Trustabl</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-4xl font-semibold tracking-[0.02em] text-[#2DD4BF] lg:text-5xl">91%</span>
                  <span className="pb-2 text-sm font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Production Ready</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-300">
                  {afterBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#2DD4BF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="why-trustabl" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Why Trustabl?</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Trustabl = Trustworthy + Reliable</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
                We exist to make the tools and skills that power AI agents worthy of real production environments, not just demos.
              </p>
            </div>
          </div>
        </section>

        <section id="openshell" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[32px] border border-[#2DD4BF]/20 bg-white/[0.03] p-8 lg:p-12">
              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="flex flex-col">
                  <span className="inline-flex w-fit self-start rounded-full border border-[#76b900]/30 bg-[#76b900]/10 px-4 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#76b900]">
                    Perfect Partner to OpenShell
                  </span>
                  <h2 className="mt-5 text-4xl font-semibold leading-tight lg:text-5xl">
                    Built for production.
                    <span className="block text-white">
                      Designed to work with <span className="text-[#2DD4BF]">NVIDIA OpenShell.</span>
                    </span>
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
                    We’re working with NVIDIA to make Trustabl the natural bridge to secure, governed deployment.
                  </p>
                </div>
                <div className="grid gap-3">
                  {trustHighlights.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Agents &amp; skills coming soon</p>
                <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                  We start with tools. Skills and agents <span className="whitespace-nowrap">come next.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
                  Trustabl is rolling out in layers so hardening stays reliable before we expand into broader agent workflows.
                </p>
              </div>
              <div className="max-w-[560px] rounded-[28px] border border-white/8 bg-white/[0.03] p-6 text-sm text-gray-300 lg:justify-self-end">
                <p className="font-medium text-white">Roadmap</p>
                <ul className="mt-4 space-y-3">
                  {roadmapItems.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#2DD4BF]" />
                      <span>{item.content}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="mt-5 inline-flex items-center gap-2 border border-[#2DD4BF]/35 text-[#2DD4BF] font-medium px-5 py-2 rounded-xl hover:bg-[#2DD4BF]/10 transition-all text-sm"
                >
                  Join the waitlist for early access
                </a>
              </div>
            </div>
          </div>
        </section>


        <section id="pricing" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Pricing</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Start free. Upgrade when you are ready.</h2>
            </div>

            <div className="mt-14 mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex h-full flex-col rounded-3xl p-7 ${
                    tier.highlight
                      ? 'border-2 border-[#2DD4BF] bg-[#0D1614]'
                      : 'border border-white/8 bg-[#0D0D10]'
                  }`}
                >
                  <div className="mb-2">
                    <h3 className={`text-base font-bold ${tier.highlight ? 'text-[#2DD4BF]' : 'text-white'}`}>{tier.name}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-400">{tier.best}</p>
                  </div>

                  <div className="my-6">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    {tier.period && <span className="ml-1.5 text-sm text-gray-500">{tier.period}</span>}
                  </div>

                  <ul className="mb-8 flex-1 space-y-2.5 text-sm text-gray-300">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-[#2DD4BF]">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={githubRepoUrl}
                    className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all ${
                      tier.highlight
                        ? 'bg-[#2DD4BF] text-[#08121F] hover:bg-[#22B8A6]'
                        : 'bg-white/8 text-white hover:bg-white/12'
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ATM Diagram Section */}
        <section id="atm" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Agentic Tool Metadata</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">ATM makes every layer of the stack better</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
                Rich, production-grade metadata doesn&apos;t just describe your tools — it makes every system that uses them smarter, safer, and faster.
              </p>
            </div>

            {/* Desktop diagram */}
            <div className="hidden lg:block">
              {(() => {
                // Layout (px): 3 cards h-[120px], gap-5 (20px) between rows
                // Total H = 3×120 + 2×20 = 400. Row midpoints: 60, 200, 340.
                // cardW=340, 20px gap to rail, center channel=180px.
                // leftRail=360, rightRail=540, cx=450
                const W = 900, H = 400;
                const cardW = 340;
                const leftRailX = cardW + 20;      // 360
                const rightRailX = W - cardW - 20; // 540
                const cx = W / 2;                  // 450
                const logoSize = 60;
                const logoX = cx - logoSize / 2;   // 420
                const logoY = 200 - logoSize / 2;  // 170
                const rows = [60, 200, 340];
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
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                          <Link2 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Supply Chain</p>
                          <p className="text-[11px] text-gray-500">SLSA + Sigstore attestations</p>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-[#2DD4BF]/25" />
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
                          <div key={node.id} className="flex h-[120px] flex-col gap-2 rounded-2xl border border-white/8 bg-[#0D0D10] p-5 transition-colors hover:border-[#2DD4BF]/30">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF]">{node.icon}</div>
                              <span className="text-sm font-semibold text-white">{node.title}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-400">{node.desc}</p>
                            <button type="button" onClick={() => setAtmModal(node.id)} className="self-start text-xs font-medium text-[#2DD4BF] hover:underline">See more</button>
                          </div>
                        ))}
                      </div>

                      {/* Center logo */}
                      <div className="absolute z-10" style={{ left: logoX, top: logoY, width: logoSize, height: logoSize }}>
                        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-[#2DD4BF]/30 bg-[#0B0B0D]" style={{ animation: 'coreGlow 2s ease-in-out infinite' }}>
                          <svg className="h-8 w-8" viewBox="0 0 612 633" fill="#2DD4BF">
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
                          <div key={node.id} className="flex h-[120px] flex-col gap-2 rounded-2xl border border-white/8 bg-[#0D0D10] p-5 transition-colors hover:border-[#2DD4BF]/30">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF]">{node.icon}</div>
                              <span className="text-sm font-semibold text-white">{node.title}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-400">{node.desc}</p>
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
                <div key={comp.id} className="flex flex-col rounded-3xl border border-white/8 bg-[#141419] p-6">
                  <h3 className="mb-1 font-bold text-white">{comp.title}</h3>
                  <p className="mb-4 text-sm text-gray-400">{comp.tagline}</p>
                  <button type="button" onClick={() => setAtmModal(comp.id)} className="mt-auto self-start text-xs font-medium text-[#2DD4BF] hover:underline">more&hellip;</button>
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
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-[#2DD4BF]">Agentic Tool Metadata</p>
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
        <section id="faq" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">FAQ</p>
              <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">Common questions</h2>
            </div>
            <div className="mt-12 divide-y divide-white/8">
              {faqItems.map((item, i) => (
                <div key={i} className="py-5">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 text-left"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <span className="font-medium text-white">{item.q}</span>
                    <span className="mt-0.5 flex-shrink-0 text-[#2DD4BF]">
                      {faqOpen === i ? '−' : '+'}
                    </span>
                  </button>
                  {faqOpen === i && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="share" className="bg-[#050506] py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-[32px] border border-white/8 bg-white/[0.03] p-8 lg:p-12">
              <div className="grid lg:grid-cols-[1fr_auto] lg:items-center gap-10">
                {/* Left — headline + CTA */}
                <div className="flex flex-col">
                  <h2 className="text-3xl font-semibold leading-tight lg:text-4xl">
                    Make your AI tools<br className="hidden lg:block" /> production-ready today.
                  </h2>
                  <p className="mt-3 text-sm text-gray-500">No credit card required. Connect GitHub in under a minute.</p>
                </div>
                {/* Right — share icons */}
                <div className="flex w-full flex-col items-center gap-3 lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:gap-6">
                  <div className="flex w-full justify-center lg:w-auto">
                    <a
                      href={githubRepoUrl}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-2.5 text-sm font-medium text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6]"
                    >
                      Try It Free — Connect GitHub
                    </a>
                  </div>
                  <div className="flex flex-col items-center gap-2 lg:items-start">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Just found Trustabl — it automatically hardens my AI tools. Improved scores from 38% → 91%. Try it free: trustabl.ai')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition-colors hover:border-[#2DD4BF]/30 hover:text-[#2DD4BF]"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://trustabl.ai')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition-colors hover:border-[#2DD4BF]/30 hover:text-[#2DD4BF]"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <button
                        type="button"
                        onClick={copyLink}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-500 transition-colors hover:border-[#2DD4BF]/30 hover:text-[#2DD4BF]"
                      >
                        {copied
                          ? <svg className="h-4 w-4 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Newsletter */}
      <section className="bg-[#050506] py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">Stay Updated</p>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Product updates, delivered.</h2>
          <p className="mb-8 text-base text-gray-400">New features, security guides, and early access drops — straight to your inbox. No spam.</p>
          {newsletterSubmitted ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-6 py-4 text-[#2DD4BF]">
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
              className="flex flex-col gap-3 sm:flex-row sm:gap-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2DD4BF]/40 focus:ring-1 focus:ring-[#2DD4BF]/20"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-medium text-[#08121F] transition-all hover:scale-105 hover:bg-[#22B8A6] active:scale-100"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-[#050506] py-12">
        <div className="mx-auto max-w-7xl px-4 text-gray-500 sm:px-6">
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/5 pt-8 text-center md:flex-row md:justify-between md:text-left">
            <a href="#" className="inline-flex items-center">
              <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} className="h-6 w-auto opacity-80" />
            </a>
            <p className="text-xs text-gray-700">Trustabl © 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

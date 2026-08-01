export type ScanJob = {
  createdAt: number;
  repoUrl: string;
  email: string;
};

// In-memory placeholder store. Real scan orchestration lives in a separate
// backend service; this simulates queue/scan/sent timing until that's wired up.
// Keyed on globalThis so the Map survives Next.js dev-mode module re-evaluation
// across separate route handler compilations.
const globalForJobs = globalThis as unknown as { __scanJobs?: Map<string, ScanJob> };

export const jobs = globalForJobs.__scanJobs ?? (globalForJobs.__scanJobs = new Map<string, ScanJob>());

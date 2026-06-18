'use client';

import { useEffect, useState } from 'react';

const CACHE_KEY = 'trustabl-gh-downloads';

function readCache(): number | null {
  const raw = window.localStorage.getItem(CACHE_KEY);
  return raw ? Number(raw) : null;
}

export function useGithubDownloads(repo = 'trustabl/trustabl') {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached !== null) setDownloadCount(cached);

    fetch(`https://api.github.com/repos/${repo}/releases`)
      .then(r => r.json())
      .then(releases => {
        if (!Array.isArray(releases)) return;
        const total = releases.reduce((sum: number, release: { assets?: { download_count?: number }[] }) => {
          if (!release.assets) return sum;
          return sum + release.assets.reduce((s: number, a: { download_count?: number }) => s + (a.download_count ?? 0), 0);
        }, 0);
        setDownloadCount(total);
        window.localStorage.setItem(CACHE_KEY, String(total));
      })
      .catch(() => {});
  }, [repo]);

  return downloadCount;
}

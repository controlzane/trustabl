'use client';

import { useEffect, useState } from 'react';

const CACHE_KEY = 'trustabl-gh-stars';

function readCache(): number | null {
  const raw = window.localStorage.getItem(CACHE_KEY);
  return raw ? Number(raw) : null;
}

export function useGithubStars(repo = 'trustabl/trustabl') {
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached !== null) setStarCount(cached);

    fetch(`https://api.github.com/repos/${repo}`)
      .then(r => r.json())
      .then(d => {
        if (typeof d.stargazers_count === 'number') {
          setStarCount(d.stargazers_count);
          window.localStorage.setItem(CACHE_KEY, String(d.stargazers_count));
        }
      })
      .catch(() => {});
  }, [repo]);

  return starCount;
}

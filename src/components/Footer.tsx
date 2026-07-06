import Image from 'next/image';
import Link from 'next/link';

const githubRepoUrl = 'https://github.com/trustabl';

export default function Footer() {
  return (
    <footer className="border-t border-white/8 pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} className="h-6 w-auto opacity-60" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-500">
              Reliability scans, fixes, and guardrails for AI agents — in your IDE.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Sitemap</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Product</Link></li>
              <li><Link href="/agents" className="transition-colors hover:text-white">Agents</Link></li>
              <li><Link href="/docs" className="transition-colors hover:text-white">Docs</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Plugins</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><a href={`${githubRepoUrl}/trustabl-action`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">GitHub Actions</a></li>
              <li><a href="https://marketplace.visualstudio.com/items?itemName=Trustabl.trustabl-azure-devops-extension" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">MS Azure DevOps Marketplace</a></li>
              <li><a href="https://gitlab.com/explore/catalog/trustabl-ai/components?tab=components" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">GitLab Catalog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Socials</h3>
            <div className="mt-3 flex items-center gap-3">
              <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-500 transition-colors hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="https://x.com/Trustablai" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-gray-500 transition-colors hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://discord.gg/27sdvYnZ5" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-gray-500 transition-colors hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c1.9952 1.4651 3.9282 2.3534 5.8275 2.9419a.0777.0777 0 00.0842-.0276c.4448-.6099.8408-1.2535 1.1885-1.9295a.076.076 0 00-.0416-.1057c-.6328-.2401-1.2349-.5341-1.8112-.8746a.0777.0777 0 01-.0076-.1288c.1216-.0911.2436-.1858.3592-.2814a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1156.0966.2376.1923.3602.2834a.0777.0777 0 01-.0066.1288 12.2986 12.2986 0 01-1.8123.8736.0766.0766 0 00-.0407.1067c.3477.6749.7437 1.3184 1.1875 1.9283a.0776.0776 0 00.0842.0286c1.9108-.5886 3.8438-1.4769 5.8392-2.9419a.0793.0793 0 00.0313-.0552C24.5 13.6004 23.7 9.8 20.0317 4.3698zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.211 0 2.1758 1.0958 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.211 0 2.1758 1.0958 2.1568 2.419 0 1.3332-.945 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
              <a href="https://youtube.com/@trustabl" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-500 transition-colors hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a2.99 2.99 0 00-2.106-2.116C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.392.525A2.99 2.99 0 00.502 6.186 31.06 31.06 0 000 12a31.06 31.06 0 00.502 5.814 2.99 2.99 0 002.106 2.116c1.887.525 9.392.525 9.392.525s7.505 0 9.392-.525a2.99 2.99 0 002.106-2.116A31.06 31.06 0 0024 12a31.06 31.06 0 00-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.272 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">© 2026 Trustabl. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/telemetry" className="transition-colors hover:text-white">Telemetry</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

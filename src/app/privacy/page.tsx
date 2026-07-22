'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

const GITHUB_URL = 'https://github.com/trustabl/trustabl';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/products' },
  { label: 'Docs', href: 'https://trustabl.github.io/trustabl-docs/' },
  { label: 'Blog', href: '/blog' },
];

export default function PrivacyPage() {
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
            </a>
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
        <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#2DD4BF]">Legal</p>
          <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: June 11, 2026</p>

          <div className="mt-10 space-y-8 text-gray-400 leading-relaxed">
            <p>
              Trustabl.ai and its corporate entity Stable Innovations Inc. (&ldquo;Trustabl,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect personal information in connection with the Services. It applies to trustabl.ai and related services. For California/Texas/other rights, see below.
            </p>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">1. Information We Collect</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li><span className="text-white">Account/Profile:</span> Name, email, company, payment info, credentials.</li>
                <li><span className="text-white">Usage/Product Data:</span> Logs, agent interactions, inputs/outputs (for hardening/RAG/policy enforcement), telemetry (anonymized/pseudonymized where possible), IP/device info, cookies.</li>
                <li><span className="text-white">Customer Data:</span> Code, configs, data processed in Services (you control what you input).</li>
                <li><span className="text-white">Automatically:</span> Analytics, error logs, cookies/tracking (see Cookie Policy).</li>
                <li><span className="text-white">Third Parties:</span> From integrations, sign-ins, or partners (with consent where required).</li>
              </ul>
              <p className="mt-3">
                We minimize collection to what&apos;s necessary for Services, compliance, and improvement. No sensitive data (health, etc.) unless you provide it and we have safeguards/DPA in place.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">2. How We Use Information</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide, secure, improve Services (hardening, analytics, support).</li>
                <li>Billing, communications, marketing (opt-out available).</li>
                <li>Legal compliance, fraud prevention.</li>
                <li>Aggregate/anonymize for research/product development.</li>
                <li>AI: Process inputs for features; no training on Customer Data without opt-in. Outputs are not guaranteed accurate or bias-free.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">3. Sharing and Disclosure</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Service providers/subprocessors (bound by agreements; list available in Trust Center).</li>
                <li>Affiliates, legal requirements, business transfers.</li>
                <li>No sale of personal data (per TDPSA/CCPA definitions). Opt-outs for targeted ads/sharing where applicable.</li>
              </ul>
              <p className="mt-3">We do not share Customer Data for third-party marketing.</p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">4. Data Security</h2>
              <p>
                We maintain reasonable technical and organizational measures (SOC2-aligned). You are responsible for your end (configs, access controls). Breach notification per applicable law.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">5. Data Retention</h2>
              <p>
                We retain data as long as needed for the purposes described and to meet legal requirements. We delete data upon request, subject to certain exceptions.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">6. Your Rights (GDPR, CCPA, TDPSA, etc.)</h2>
              <p>
                You may have rights to access, correct, delete, and opt out of sale/targeting/profiling of your personal information. Submit requests via email: <a href="mailto:privacy@trustabl.ai" className="text-[#2DD4BF] hover:underline">privacy@trustabl.ai</a>. Texas residents have rights under TDPSA, including an appeals process. We respond in a timely manner and verify identity. We do not discriminate against anyone for exercising these rights.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">7. International Transfers</h2>
              <p>
                Where personal information is transferred across borders, we apply adequate safeguards (such as Standard Contractual Clauses).
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">8. Children&apos;s Privacy</h2>
              <p>
                Our Services are not directed to children under 13 (or 16 where applicable under COPPA/GDPR), and we do not knowingly collect their information.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">9. Changes</h2>
              <p>
                We may update this Privacy Policy from time to time. Updated versions will be posted here, and continued use of the Services constitutes acceptance. We will notify you of material changes.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">10. Contact</h2>
              <p>
                Questions about this Privacy Policy can be directed to <a href="mailto:privacy@trustabl.ai" className="text-[#2DD4BF] hover:underline">privacy@trustabl.ai</a>. A Data Processing Addendum is available for enterprise customers.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

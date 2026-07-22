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

export default function TermsPage() {
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
          <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: June 11, 2026</p>

          <div className="mt-10 space-y-8 text-gray-400 leading-relaxed">
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of Trustabl.ai websites, platforms, open-core software, services, tools, and features (collectively, the &ldquo;Services&rdquo;) provided by Trustabl.ai, and/or its corporate entity Stable Innovations, Inc. or its affiliates (&ldquo;Trustabl,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;). By accessing or using the Services, you agree to these Terms. If you use the Services on behalf of an entity, you represent that you are authorized to bind that entity.
            </p>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">1. Eligibility and Accounts</h2>
              <p>
                You must be at least 18 (or the age of legal majority) and provide accurate information. You are responsible for your account security and all activity under your account. Notify us immediately of any breach.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">2. Services and Licensing</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li><span className="text-white">Open-Core:</span> Certain components are available under open-source licenses (e.g., Apache 2.0). Enterprise/pro features require a subscription. See our Licensing page for details. You may not remove notices or use components in violation of their licenses.</li>
                <li><span className="text-white">SaaS/Hosted:</span> Subject to subscription. We grant a limited, non-exclusive, non-transferable license during the term for internal use.</li>
                <li><span className="text-white">Restrictions:</span> No reverse engineering, decompiling, reselling, or using the Services to build competing services. No high-risk uses (e.g., without proper hardening). You must comply with our Acceptable Use Policy.</li>
                <li><span className="text-white">Beta/Preview:</span> Provided &ldquo;AS IS,&rdquo; with no SLAs, and may change or be discontinued at any time.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">3. Your Data and Inputs</h2>
              <p>
                You retain ownership of your data, code, agents, configurations, and inputs (&ldquo;Customer Data&rdquo;). You grant us a limited, worldwide, royalty-free license to host, process, analyze, and use Customer Data solely to provide, improve, and secure the Services (including hardening, testing, RAG, and policy enforcement). We will not use Customer Data to train external models without your explicit opt-in consent. For AI features, outputs are provided &ldquo;AS IS&rdquo;; you are responsible for validation, compliance, and any agent actions.
              </p>
              <p className="mt-3">
                You warrant that Customer Data does not violate any laws or IP rights and complies with your own privacy obligations (e.g., no unconsented PII in public repos).
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">4. Payments and Subscriptions</h2>
              <p>
                Fees are as posted or agreed. Billing is recurring and auto-renews unless canceled. Late payments accrue interest, and taxes are extra. No refunds except as required by law. We may suspend the Services for non-payment.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">5. Intellectual Property</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Trustabl owns the Services, proprietary code, improvements, feedback (you assign us rights to feedback), and trademarks.</li>
                <li>Open-core components remain under their respective licenses. No transfer of ownership occurs.</li>
                <li>You may not use our IP except as expressly permitted.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">6. Confidentiality and Security</h2>
              <p>
                We maintain reasonable security measures. You are responsible for your own configurations and backups. See our Privacy Policy for further details.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">7. Termination</h2>
              <p>
                We may suspend or terminate the Services for breach, non-payment, or risk to the Services. You may cancel per your plan. Upon termination, outstanding fees become due, access ends, and we may delete data after a retention period, subject to legal holds.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">8. Disclaimers</h2>
              <p>
                The Services are provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE.&rdquo; We disclaim all warranties, including merchantability, fitness for a particular purpose, non-infringement, and accuracy of AI outputs. We do not guarantee against vulnerabilities, agent failures, or compliance &mdash; hardening and auditing remain your responsibility. Open-core/community features have no SLA.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Trustabl&apos;s total liability shall not exceed the fees paid in the 12 months preceding the claim. We are not liable for indirect, consequential, incidental, or punitive damages, including data loss, business interruption, or AI-related harms. This does not limit liability for gross negligence or willful misconduct, or where prohibited by law.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">10. Indemnification</h2>
              <p>
                You indemnify us against claims arising from your Customer Data, your use of the Services or agents, or your breach of these Terms. We indemnify you for IP claims on our proprietary code, subject to standard exceptions.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">11. Governing Law</h2>
              <p>
                These Terms are governed by Texas law (excluding conflicts-of-law principles), with venue in Houston, TX. Binding arbitration applies.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">12. Modifications</h2>
              <p>
                We may update these Terms by posting an updated version, effective on notice or continued use. We will notify you of material changes via email or on our site.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">13. Miscellaneous</h2>
              <p>
                These Terms are subject to severability, no waiver, and assignment restrictions, and remain subject to force majeure and export compliance requirements. Contact: <a href="mailto:legal@trustabl.ai" className="text-[#2DD4BF] hover:underline">legal@trustabl.ai</a>.
              </p>
              <p className="mt-3">
                Our Acceptable Use Policy, SLAs, DPA, and other supplements are incorporated into these Terms by reference.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

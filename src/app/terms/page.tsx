import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050506] text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#050506]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center">
            <Image src="/trustabl-logo.svg" alt="Trustabl" width={1236} height={295} priority className="h-7 w-auto" />
          </Link>
        </div>
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

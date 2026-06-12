import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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

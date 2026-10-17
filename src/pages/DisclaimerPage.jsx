import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Info,
  Scale,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function DisclaimerPage({ isDark, onNavigateHome, onOpenAudit }) {
  return (
    <div className="pt-24 sm:pt-32 pb-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between pb-8 border-b border-current/10 mb-10 sm:mb-14">
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] opacity-75 hover:opacity-100 hover:text-[#FF6B1A] transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Homepage</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B1A]">
            <span>SEARCH &amp; SERVICE</span>
            <span>•</span>
            <span>DISCLAIMER</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] mb-4 border border-amber-500/30 bg-amber-500/10 text-amber-500">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Performance &amp; Algorithm Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Earnings &amp; Performance Disclaimer.
          </h1>
          <p className="mt-4 text-sm sm:text-base opacity-80 leading-relaxed font-normal">
            Last Updated: <strong>October 2026</strong>. This disclaimer provides transparent, professional disclosures regarding the marketing telemetry, case study metrics, revenue projections, and third-party platform algorithms referenced across SearchandService Agency LLC.
          </p>
        </div>

        {/* Highlight Callout Box */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border mb-12 sm:mb-16 ${
            isDark
              ? 'bg-[#0D0D0D] border-amber-500/30'
              : 'bg-white border-amber-500/30 shadow-md'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 mt-1 border border-amber-500/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Summary of Professional Intent
              </h3>
              <p className="mt-2 text-xs sm:text-sm opacity-85 leading-relaxed">
                SearchandService operates as a strategic engineering and marketing partner for established local service companies. We provide white-hat local SEO, modern web development, and AI speed-to-lead automations. While we consistently engineer systems designed for top Map Pack visibility and high conversion rates, we do not promise &ldquo;instant overnight riches&rdquo; or unearned algorithmic miracles.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Sections */}
        <div className="space-y-10 sm:space-y-12 text-sm sm:text-base leading-relaxed opacity-90">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>1. Case Studies &amp; Historical Performance Telemetry</span>
            </h2>
            <p>
              The case studies, performance metrics, and client quotes featured across this website (including references to &ldquo;+25% Inbound Calls in 90 Days&rdquo;, &ldquo;+$4,000/mo Added Revenue&rdquo;, and &ldquo;Position 8–12 to 3–5&rdquo;) represent real historical telemetry documented for specific past and active clients.
            </p>
            <p>
              These outcomes are illustrative of what is possible when our complete systems are correctly deployed alongside an established service business with strong local reputation, adequate operational capacity, and consistent customer service. They do not constitute an explicit or implied guarantee that every client will achieve identical or equivalent financial results. Local market competition, geographic density, ticket pricing, and seasonal demand significantly influence individual outcomes.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>2. Interactive ROI Calculator &amp; Revenue Projections</span>
            </h2>
            <p>
              The interactive growth and revenue projection calculator provided on our website is designed purely as an illustrative modeling tool. Calculations rely upon user-adjusted inputs (such as estimated monthly leads, average customer ticket size, and conversion rate presets).
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#FF6B1A]">
              <li>Projections generated by the calculator do not represent actual earnings statements, legally binding promises, or balance sheet guarantees.</li>
              <li>Actual closed revenue depends entirely upon your internal sales processes, technician dispatched close rates, dispatch scheduling efficiency, and customer fulfillment.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>3. Independent Search Engine &amp; Third-Party Platform Policies</span>
            </h2>
            <p>
              SearchandService is an independent agency and is not affiliated with, endorsed by, or sponsored by Google LLC, Alphabet Inc., Meta Platforms Inc., or Cloudflare Inc.
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#FF6B1A]">
              <li>
                <strong>Algorithmic Variations:</strong> Google’s local search algorithms, Google Business Profile ranking signals, and geo-grid evaluation models update continually at Google’s sole discretion. SearchandService deploys rigorous, sustainable white-hat techniques strictly aligned with Google’s Webmaster and GBP Quality Guidelines.
              </li>
              <li>
                <strong>No Proprietary Algorithm Control:</strong> No agency or consultant can buy or guarantee a specific organic or map pack ranking on Google. Any firm guaranteeing an instantaneous permanent #1 ranking regardless of competition is deceptive.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>4. Speed-to-Lead &amp; TCPA Telecommunications Compliance</span>
            </h2>
            <p>
              Automated missed-call text-back workflows, appointment reminders, and SMS review request systems engineered by SearchandService must be utilized in strict compliance with the Telephone Consumer Protection Act (TCPA), state telemarketing statutes, and carrier A2P 10DLC registration requirements.
            </p>
            <p>
              Clients are responsible for ensuring that customer phone numbers entered into their CRM or contacted via automation workflows have initiated communication or granted express consent where legally required.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>5. Territory Exclusivity Disclaimers</span>
            </h2>
            <p>
              Submission of a Free Local Growth Audit form or diagnostic inquiry does not automatically reserve, lock in, or guarantee territory exclusivity. Territory exclusivity is formally granted only upon the mutual execution of an official Statement of Work and receipt of the initial deployment retainer. SearchandService reserves the right to decline inquiries in territories already under contract with an active partner.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>6. No Professional Legal or Tax Advice</span>
            </h2>
            <p>
              Information presented on this website, in our blog playbooks, or during growth audit consultations is for informational and strategic marketing purposes only. It does not constitute legal, tax, accounting, or professional trade licensing advice. You should consult licensed professional advisors regarding specific legal or tax considerations for your business operations.
            </p>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-14 pt-8 border-t border-current/10 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="text-xs font-mono uppercase tracking-widest text-[#FF6B1A] hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
          <button
            onClick={onOpenAudit}
            className="text-xs font-mono uppercase tracking-widest opacity-80 hover:text-[#FF6B1A] transition-colors"
          >
            Claim Free Local Growth Audit →
          </button>
        </div>
      </div>
    </div>
  );
}

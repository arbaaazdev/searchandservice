import React from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Workflow
} from 'lucide-react';

export default function TermsPage({ isDark, onNavigateHome, onOpenAudit }) {
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
            <span>TERMS OF SERVICE</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] mb-4 border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 text-[#FF6B1A]">
            <Scale className="w-3.5 h-3.5" />
            <span>Master Engagement Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Terms of Service &amp; Engagement Standards.
          </h1>
          <p className="mt-4 text-sm sm:text-base opacity-80 leading-relaxed font-normal">
            Last Updated: <strong>October 2026</strong>. These professional agency terms govern all digital architecture builds, monthly local growth retainers, Google Maps SEO campaigns, and automation workflows engineered by SearchandService Agency LLC (&ldquo;SearchandService&rdquo;, &ldquo;Company&rdquo;).
          </p>
        </div>

        {/* 3 Pillars Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {[
            {
              icon: Workflow,
              title: 'System Deployment',
              desc: 'Structured 14–21 day builds with clear milestones and client sign-off.'
            },
            {
              icon: Lock,
              title: 'Territory Exclusivity',
              desc: 'We never represent your direct local competitors in your contracted service area.'
            },
            {
              icon: CreditCard,
              title: 'Monthly Retainers',
              desc: 'Transparent flat fees, zero hidden markups, and flexible 30-day notice terms.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#FF6B1A]/10 text-[#FF6B1A] flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm">{item.title}</div>
                <div className="mt-1 text-xs opacity-75 leading-relaxed">{item.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Detailed Terms Content */}
        <div className="space-y-10 sm:space-y-12 text-sm sm:text-base leading-relaxed opacity-90">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>1. Engagement Overview &amp; Acceptance</span>
            </h2>
            <p>
              By signing a SearchandService Statement of Work (SOW), executing an electronic service agreement, or submitting payment for system deployment or monthly growth retainers, the client (&ldquo;Client&rdquo;) unconditionally agrees to be bound by these Terms of Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>2. Scope of Work &amp; Deployment Timelines</span>
            </h2>
            <p>
              SearchandService delivers specialized local business growth architectures. Standard deployment phases and delivery timelines include:
            </p>
            <div className="space-y-3 pt-1">
              {[
                {
                  phase: '01. High-Converting Web Platforms',
                  timeline: '14–21 Business Days',
                  details:
                    'Performance optimization, mobile-first click-to-call architecture, localized trust badges, quote funnels, Schema.org LocalBusiness structured data, and sub-second page speed deployment.'
                },
                {
                  phase: '02. Speed-to-Lead & AI Automation',
                  timeline: '7–10 Business Days',
                  details:
                    'Missed-call automated SMS text-back flows, conversational qualification assistants, CRM pipeline stages, and calendar integration.'
                },
                {
                  phase: '03. Google Maps #1 Ranking Engine',
                  timeline: '60–90 Day Compounding Cycle',
                  details:
                    'Complete Google Business Profile optimization, localized citation cleanups, geo-grid radius tracking, and weekly GBP updates and review velocity management.'
                }
              ].map((row, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#FF6B1A]">
                      {row.phase}
                    </span>
                    <span className="text-xs font-mono opacity-70 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {row.timeline}
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm opacity-85 leading-relaxed">{row.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>3. Guaranteed Territory Exclusivity</span>
            </h2>
            <p>
              To eliminate conflicting client interests and preserve maximum commercial advantage, SearchandService provides strict <strong>territory exclusivity</strong> for active monthly growth retainer clients:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#FF6B1A]">
              <li>We will not accept or execute marketing, SEO, or lead generation campaigns for any direct business competitor within your defined geographic service territory or postal zip code radius.</li>
              <li>Exclusivity is contingent upon the Client maintaining an active, in-good-standing monthly retainer. Should the Client pause, default on payment, or terminate services, territory exclusivity immediately lapses and the market territory opens to other qualified providers.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>4. Monthly Retainers, Fees &amp; Third-Party Costs</span>
            </h2>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#FF6B1A]">
              <li>
                <strong>Retainer Billing:</strong> Monthly retainers are invoiced and charged automatically on a recurring 30-day billing cycle via credit card or ACH bank transfer.
              </li>
              <li>
                <strong>Scope Boundaries:</strong> Services included in the monthly retainer are explicitly delineated in your SOW. Additional custom feature requests outside the agreed scope are quoted at our standard hourly engineering rate prior to commencement.
              </li>
              <li>
                <strong>Third-Party Infrastructure Fees:</strong> Direct pass-through costs (e.g., Twilio telephony usage fees for SMS and call forwarding, domain registration renewals, and ad spend paid directly to Google or Meta) remain the direct financial responsibility of the Client and are not marked up by SearchandService.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>5. Intellectual Property &amp; 100% Asset Ownership</span>
            </h2>
            <p>
              We firmly believe local operators should never be held hostage by their marketing agency:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#FF6B1A]">
              <li>Upon full receipt of project deployment fees, the Client holds 100% full legal ownership of their registered domain names, website graphics, client databases, and custom landing page code.</li>
              <li>SearchandService retains copyright in its proprietary internal automation libraries, backend workflow templates, and diagnostic tool code, granting Client an irrevocable, non-exclusive license to utilize such systems for their own operational use.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>6. Client Responsibilities &amp; Cooperation</span>
            </h2>
            <p>
              Successful system implementation requires timely collaboration. The Client agrees to:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#FF6B1A]">
              <li>Provide administrative or Manager-level access to their Google Business Profile, domain DNS records, and relevant CRM systems within 5 business days of onboarding.</li>
              <li>Designate a primary point of contact for timely approvals of website staging previews, photography assets, and service pricing schedules.</li>
              <li>Maintain accurate licensing, liability insurance, and regulatory standing applicable to their trade or profession.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>7. Retainer Cancellation &amp; 30-Day Notice Policy</span>
            </h2>
            <p>
              Monthly retainer services may be cancelled by either party upon delivering a <strong>30-day written notice</strong> via email to{' '}
              <a href="mailto:searchandservicegrowth@gmail.com" className="text-[#FF6B1A] underline">
                searchandservicegrowth@gmail.com
              </a>
              . During the 30-day notice period:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#FF6B1A]">
              <li>SearchandService completes all active optimization cycles, delivers final monthly telemetry reports, and ensures a smooth, orderly handover of all DNS records and credentials.</li>
              <li>No cancellation penalties or early-exit fees are levied. We earn your business every month through demonstrable local ROI.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FF6B1A] flex items-center gap-2">
              <span>8. Limitation of Liability &amp; Governing Law</span>
            </h2>
            <p>
              To the maximum extent permitted by applicable law, SearchandService’s aggregate liability arising out of or related to this agreement shall not exceed the total fees paid by the Client to SearchandService in the three (3) months preceding the claim. In no event shall either party be liable for consequential, incidental, or indirect damages. This agreement shall be governed by and construed in accordance with the laws of the State of Delaware without regard to conflict of law principles.
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

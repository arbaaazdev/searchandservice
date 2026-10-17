import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Filter,
  MapPin,
  Sparkles,
  Star,
  Quote,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { CASE_STUDIES_DATA, CASE_STUDY_FILTERS } from '../data/caseStudiesData';

export default function CaseStudiesPage({ isDark, onNavigateHome, onOpenAudit }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems =
    activeFilter === 'all'
      ? CASE_STUDIES_DATA
      : CASE_STUDIES_DATA.filter((item) => item.filterKey === activeFilter);

  return (
    <div className="pt-24 sm:pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10">
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
            <span>CASE STUDIES ARCHIVE</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] mb-4 border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 text-[#FF6B1A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Local Growth Deployments</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
            Proven Case Studies &amp; Performance Telemetry.
          </h1>
          <p className="mt-5 text-base sm:text-xl opacity-80 leading-relaxed font-normal">
            Real outcomes from local HVAC contractors, medical aesthetic clinics, and professional firms. Review the exact challenges, architectures deployed, and verified call lift metrics.
          </p>
        </div>

        {/* Agency High-Level Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-14">
          {[
            { metric: '+25%', label: 'Average Inbound Call Lift', sub: 'Across Home-Service Partners' },
            { metric: '< 45s', label: 'Speed-to-Lead Response', sub: '24/7 Automated Text-Back' },
            { metric: 'Top 3', label: 'Map Pack Rank Targeting', sub: 'Geo-Grid Territory Visibility' },
            { metric: '100%', label: 'Territory Exclusivity', sub: 'One Partner Per Market Radius' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10 shadow-sm'
              }`}
            >
              <div className="text-2xl sm:text-4xl font-extrabold text-[#FF6B1A] font-mono">
                {stat.metric}
              </div>
              <div className="mt-2 text-xs sm:text-sm font-bold">{stat.label}</div>
              <div className="mt-1 text-[11px] opacity-60 font-mono">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 sm:mb-14 pb-4 border-b border-current/10">
          <span className="text-xs font-mono uppercase tracking-widest opacity-60 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter Discipline:
          </span>
          {CASE_STUDY_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeFilter === f.key
                  ? 'bg-[#FF6B1A] text-white font-bold shadow-md shadow-[#FF6B1A]/20 scale-105'
                  : isDark
                  ? 'bg-white/5 border border-white/10 hover:border-[#FF6B1A] text-neutral-300'
                  : 'bg-black/5 border border-black/10 hover:border-[#FF6B1A] text-neutral-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Case Studies Deep Dive List */}
        <div className="space-y-12 sm:space-y-16 mb-20">
          {filteredItems.map((study) => (
            <div
              key={study.id}
              className={`rounded-3xl border p-6 sm:p-10 lg:p-12 transition-all duration-300 hover:shadow-2xl ${
                isDark
                  ? 'bg-[#0A0A0A] border-white/10 hover:border-[#FF6B1A]/40 shadow-black'
                  : 'bg-white border-black/10 hover:border-[#FF6B1A]/40 shadow-black/5'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Context, Challenge, Solution */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className="px-3 py-1 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold border border-[#FF6B1A]/20 tracking-wider">
                      {study.category}
                    </span>
                    <span className="flex items-center gap-1 opacity-70">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" /> {study.location}
                    </span>
                    <span className="opacity-60">• {study.clientType}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    {study.title}
                  </h2>

                  <p className="text-sm sm:text-base opacity-80 leading-relaxed font-medium">
                    {study.summary}
                  </p>

                  {/* Challenge & Solution Breakdown */}
                  <div className="space-y-4 pt-2">
                    <div
                      className={`p-4 rounded-xl border ${
                        isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
                      }`}
                    >
                      <div className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-bold mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Initial Bottleneck &amp; Challenge:
                      </div>
                      <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-xl border ${
                        isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
                      }`}
                    >
                      <div className="text-[11px] font-mono uppercase tracking-widest text-[#10B981] font-bold mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Growth Engine Deployed:
                      </div>
                      <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="pt-2">
                    <div className="text-xs font-mono uppercase tracking-widest text-[#FF6B1A] font-bold mb-3">
                      KEY DELIVERABLES &amp; AUTOMATIONS DEPLOYED:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {study.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs opacity-90">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Telemetry Stats & Testimonial */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  {/* Primary Lift Badge */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FF6B1A] to-[#ff4800] text-white shadow-xl shadow-[#FF6B1A]/20">
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-85">
                      VERIFIED OUTCOME
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold mt-1">
                      {study.metricBadge}
                    </div>
                    <div className="text-xs opacity-90 mt-2 font-mono">
                      Timeline: {study.timeline}
                    </div>
                  </div>

                  {/* Detailed Stats Grid */}
                  <div
                    className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
                      isDark ? 'bg-[#0D0D0D] border-white/10' : 'bg-[#F7F6F2] border-black/10'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                      TELEMETRY BEFORE VS. AFTER:
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {study.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="border-l-2 border-[#FF6B1A] pl-3">
                          <div className="text-[10px] uppercase tracking-wider opacity-60">
                            {stat.label}
                          </div>
                          <div className="text-sm sm:text-base font-bold font-mono text-[#FF6B1A] mt-0.5">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  {study.testimonial && (
                    <div
                      className={`rounded-2xl border p-5 sm:p-6 relative ${
                        isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-0.5 text-[#FBBC05] mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC05]" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm italic leading-relaxed opacity-90">
                        {study.testimonial.quote}
                      </p>
                      <div className="mt-3 pt-3 border-t border-current/10 text-xs">
                        <div className="font-bold">{study.testimonial.author}</div>
                        <div className="opacity-60 text-[10px]">{study.testimonial.role}</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onOpenAudit && onOpenAudit(study)}
                    className="w-full py-3.5 bg-[#FF6B1A] hover:bg-[#ff5500] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#FF6B1A]/20 flex items-center justify-center gap-2 group"
                  >
                    <span>Request Territory Audit for This System</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-[#0D0D0D] to-[#050505] border-white/15'
              : 'bg-gradient-to-br from-white to-[#F0EFEA] border-black/15 shadow-xl'
          }`}
        >
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF6B1A] font-bold block mb-3">
              ZERO RISK MARKET DISCOVERY
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to Turn Your Local Service Area Into a High-Converting Engine?
            </h3>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              We provide a complete diagnostic audit of your Google Map Pack position, technical website speed, intake form leakage, and missed-call drop-off.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAudit}
                className="px-6 py-3.5 bg-[#FF6B1A] hover:bg-[#ff5500] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-[#FF6B1A]/25 transition-all hover:scale-[1.02]"
              >
                Claim Free Growth Audit →
              </button>
              <button
                onClick={onNavigateHome}
                className="px-6 py-3.5 border border-current/20 hover:border-[#FF6B1A] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

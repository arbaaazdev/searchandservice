import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  Sparkles,
  Star,
  Quote,
  ShieldCheck,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { CASE_STUDIES_DATA, CASE_STUDY_FILTERS } from '../data/caseStudiesData';

export default function CaseStudiesPage({ isDark, onNavigateHome, onOpenAudit }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [expandedStoryId, setExpandedStoryId] = useState(null);

  const filteredItems =
    activeFilter === 'all'
      ? CASE_STUDIES_DATA
      : CASE_STUDIES_DATA.filter((item) => item.filterKey === activeFilter);

  const toggleCard = (id) => {
    setExpandedCardId((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) {
        // Reset story expansion to collapsed 2-3 lines when opening a new card
        setExpandedStoryId(null);
        setTimeout(() => {
          const el = document.getElementById(`case-study-card-${id}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < 80 || rect.top > window.innerHeight - 120) {
              el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }, 120);
      }
      return next;
    });
  };

  const toggleStory = (id, e) => {
    if (e) e.stopPropagation();
    setExpandedStoryId((prev) => (prev === id ? null : id));
  };

  // Helper to parse **bold** markers inside story paragraphs
  const renderFormattedStory = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={i}
            className={`font-bold ${isDark ? 'text-white' : 'text-[#0A0A0A]'}`}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

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
          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] ${
              isDark ? 'text-white' : 'text-[#0A0A0A]'
            }`}
          >
            Proven Case Studies &amp; Performance Telemetry.
          </h1>
          <p className="mt-5 text-base sm:text-xl opacity-80 leading-relaxed font-normal">
            Real outcomes from local HVAC contractors, medical aesthetic clinics, and professional firms. Click on any case study below to reveal our hands-on agency story, technical challenges, and verified call lift metrics.
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
              onClick={() => {
                setActiveFilter(f.key);
                setExpandedCardId(null);
                setExpandedStoryId(null);
              }}
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

        {/* Case Studies Grid: 
            - Compact cards identical to Homepage
            - Only ONE card in expanded position at a time (prior folds back)
            - Expanded card takes md:col-span-2, ensuring any cards below move down cleanly without hiding or overlapping
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start mb-20 relative">
          {filteredItems.map((study) => {
            const isExpanded = expandedCardId === study.id;
            const isStoryExpanded = expandedStoryId === study.id;
            const paragraphs = study.storyParagraphs || [study.story];

            return (
              <div
                key={study.id}
                id={`case-study-card-${study.id}`}
                className={`group w-full rounded-2xl sm:rounded-3xl border transition-all duration-300 relative flex flex-col ${
                  isExpanded
                    ? 'md:col-span-2 ring-1 ring-[#FF6B1A]/40 shadow-2xl'
                    : 'md:col-span-1 hover:-translate-y-1 hover:shadow-lg'
                } ${
                  isDark
                    ? 'bg-[#0F0F0F] border-white/10 hover:border-[#FF6B1A]/60'
                    : 'bg-white border-black/10 hover:border-[#FF6B1A]/60 shadow-md'
                }`}
                style={{ zIndex: isExpanded ? 20 : 1 }}
              >
                {/* Browser-style Top Header Bar */}
                <div
                  onClick={() => toggleCard(study.id)}
                  className={`px-3.5 sm:px-5 py-2.5 sm:py-3 border-b flex items-center justify-between gap-2 text-[10px] sm:text-[11px] cursor-pointer select-none transition-colors ${
                    isDark
                      ? 'border-white/10 bg-black/40 hover:bg-black/60'
                      : 'border-black/10 bg-neutral-100 hover:bg-neutral-200/70'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCard(study.id);
                    }
                  }}
                  title={isExpanded ? 'Click to collapse case study' : 'Click to expand case study'}
                >
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/70 flex-shrink-0" />
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/70 flex-shrink-0" />
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/70 flex-shrink-0" />
                    <span className="ml-1.5 sm:ml-2 font-mono opacity-60 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF6B1A]" />
                      <span>{study.location}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#FF6B1A]/20 text-[#FF6B1A] font-bold truncate">
                      {study.metricBadge}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#FF6B1A] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Card Interior */}
                <div className="p-5 sm:p-7 space-y-5">
                  {/* Category & Title */}
                  <div
                    onClick={() => toggleCard(study.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold">
                          {study.category}
                        </div>
                        <h3
                          className={`text-lg sm:text-2xl font-extrabold mt-1 tracking-tight group-hover:text-[#FF6B1A] transition-colors ${
                            isDark ? 'text-white' : 'text-[#0A0A0A]'
                          }`}
                        >
                          {study.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs opacity-60 font-mono mt-0.5">
                          {study.clientType}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCard(study.id);
                        }}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-transform ${
                          isDark
                            ? 'border-white/15 text-neutral-300 hover:text-white hover:border-[#FF6B1A]'
                            : 'border-black/15 text-neutral-600 hover:text-black hover:border-[#FF6B1A]'
                        } ${isExpanded ? 'rotate-180 bg-[#FF6B1A]/10 text-[#FF6B1A]' : ''}`}
                        aria-label={isExpanded ? 'Collapse case study' : 'Expand case study'}
                      >
                        <ChevronDown className="w-4 h-4 text-[#FF6B1A]" />
                      </button>
                    </div>

                    <p
                      className={`mt-3 text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      {study.summary}
                    </p>
                  </div>

                  {/* 3 Quick Telemetry Stats */}
                  <div
                    onClick={() => toggleCard(study.id)}
                    className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 cursor-pointer"
                  >
                    {study.stats.slice(0, 3).map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className={`p-2.5 sm:p-3 rounded-xl border ${
                          isDark
                            ? 'bg-white/[0.03] border-white/10'
                            : 'bg-black/[0.02] border-black/10'
                        }`}
                      >
                        <div className="text-[9px] sm:text-[10px] opacity-60 truncate">
                          {st.label}
                        </div>
                        <div className="text-[11px] sm:text-sm font-extrabold text-[#FF6B1A] mt-0.5 truncate font-mono">
                          {st.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* EXPANDED DETAILED SECTION */}
                  {isExpanded && (
                    <div className="pt-6 border-t border-current/10 space-y-6">
                      {/* IMPROVEMENT NO 4: Multi-Paragraph Agency Story with Formatted Typography & Bold Highlights */}
                      <div
                        className={`p-5 sm:p-6 rounded-2xl border-l-4 border-l-[#FF6B1A] border transition-all ${
                          isDark
                            ? 'bg-gradient-to-br from-[#141414] via-[#0E0E0E] to-[#080808] border-white/10 shadow-lg'
                            : 'bg-gradient-to-br from-[#FFF9F5] via-[#FCF8F3] to-[#F7F3EC] border-black/10 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3.5">
                          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-[#FF6B1A] font-bold">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>AGENCY EXECUTION STORY • BEHIND THE SCENES</span>
                          </div>
                          <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:inline">
                            Hands-On Playbook
                          </span>
                        </div>

                        {/* Collapsed vs Expanded Story View */}
                        {!isStoryExpanded ? (
                          <div>
                            <p
                              className={`text-xs sm:text-sm leading-relaxed line-clamp-2 lg:line-clamp-3 ${
                                isDark ? 'text-neutral-300' : 'text-neutral-700'
                              }`}
                            >
                              {renderFormattedStory(paragraphs[0])}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3.5 sm:space-y-4">
                            {paragraphs.map((para, pIdx) => (
                              <p
                                key={pIdx}
                                className={`text-xs sm:text-sm leading-relaxed ${
                                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                                }`}
                              >
                                {renderFormattedStory(para)}
                              </p>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => toggleStory(study.id, e)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B1A] hover:text-[#ff5500] transition-colors focus:outline-none"
                        >
                          <span>
                            {isStoryExpanded ? 'Show Less' : 'Read Full Agency Story'}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              isStoryExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* 2-Column Responsive Layout for Technical Breakdown */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Challenge, Solution, Key Deliverables */}
                        <div className="lg:col-span-7 space-y-4">
                          {/* Initial Bottleneck & Challenge */}
                          <div
                            className={`p-4 rounded-xl border ${
                              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
                            }`}
                          >
                            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-amber-500 font-bold mb-1.5 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5" /> Initial Bottleneck &amp; Challenge:
                            </div>
                            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {study.challenge}
                            </p>
                          </div>

                          {/* Growth Engine Deployed */}
                          <div
                            className={`p-4 rounded-xl border ${
                              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
                            }`}
                          >
                            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#10B981] font-bold mb-1.5 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Growth Engine Deployed:
                            </div>
                            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {study.solution}
                            </p>
                          </div>

                          {/* Key Deliverables & Automations */}
                          <div className="pt-2">
                            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#FF6B1A] font-bold mb-2.5">
                              KEY DELIVERABLES &amp; AUTOMATIONS DEPLOYED:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {study.deliverables.map((del, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-2 text-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                                  <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{del}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Telemetry Comparison, Quote & CTAs */}
                        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                          {/* Full Telemetry Comparison (Before vs. After) */}
                          <div
                            className={`rounded-xl border p-4 sm:p-5 space-y-3 ${
                              isDark ? 'bg-[#0D0D0D] border-white/10' : 'bg-[#F7F6F2] border-black/10'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest opacity-60">
                              <span>TELEMETRY BEFORE VS. AFTER:</span>
                              <span className="text-[#FF6B1A] font-bold">{study.timeline}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {study.stats.map((stat, sIdx) => (
                                <div key={sIdx} className="border-l-2 border-[#FF6B1A] pl-2.5">
                                  <div className="text-[9px] uppercase tracking-wider opacity-60">
                                    {stat.label}
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold font-mono text-[#FF6B1A] mt-0.5">
                                    {stat.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Testimonial Quote */}
                          {study.testimonial && (
                            <div
                              className={`rounded-xl border p-4 relative ${
                                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10 shadow-sm'
                              }`}
                            >
                              <div className="flex items-center space-x-0.5 text-[#FBBC05] mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC05]" />
                                ))}
                              </div>
                              <p className={`text-xs italic leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                {study.testimonial.quote}
                              </p>
                              <div className="mt-2.5 pt-2.5 border-t border-current/10 text-xs flex items-center justify-between">
                                <span className="font-bold">{study.testimonial.author}</span>
                                <span className="opacity-60 text-[10px] font-mono">{study.testimonial.role}</span>
                              </div>
                            </div>
                          )}

                          {/* Action CTA & Collapse Controls */}
                          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOpenAudit) onOpenAudit(study);
                              }}
                              className="flex-1 py-3 px-4 bg-[#FF6B1A] hover:bg-[#ff5500] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#FF6B1A]/20 flex items-center justify-center gap-2 group/btn"
                            >
                              <span>Request Territory Audit</span>
                              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCard(study.id);
                              }}
                              className={`py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-colors flex items-center justify-center gap-1.5 ${
                                isDark
                                  ? 'border-white/15 hover:border-[#FF6B1A] text-neutral-300 hover:text-white'
                                  : 'border-black/15 hover:border-[#FF6B1A] text-neutral-700 hover:text-black'
                              }`}
                            >
                              <span>Collapse</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Toggle Bar */}
                <div
                  onClick={() => toggleCard(study.id)}
                  className={`px-5 sm:px-6 py-3 border-t flex items-center justify-between text-xs font-mono uppercase tracking-wider cursor-pointer select-none transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-neutral-400 hover:text-white'
                      : 'border-black/10 bg-black/[0.01] hover:bg-black/[0.04] text-neutral-600 hover:text-black'
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#FF6B1A] flex items-center gap-1.5">
                    <span>
                      {isExpanded ? 'Hide Detailed Breakdown' : 'View Full Case Study & Agency Story'}
                    </span>
                  </span>
                  <div className="flex items-center gap-1 text-[10px] opacity-75">
                    <ChevronDown
                      className={`w-4 h-4 text-[#FF6B1A] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
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
            <h3
              className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-[#0A0A0A]'
              }`}
            >
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

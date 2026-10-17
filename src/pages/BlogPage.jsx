import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag
} from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogData';

export default function BlogPage({
  isDark,
  onNavigateHome,
  onSelectArticle,
  onOpenAudit,
  onExploreServices
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts =
    selectedCategory === 'all'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.filterKey === selectedCategory);

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
            <span>BLOG / INSIGHTS</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] mb-4 border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 text-[#FF6B1A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Field Notes &amp; Growth Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
            Battle-Tested Local Marketing Playbooks.
          </h1>
          <p className="mt-5 text-base sm:text-xl opacity-80 leading-relaxed font-normal">
            No generic agency theory. Concrete frameworks, local conversion psychology, and algorithmic blueprints engineered to help local service businesses generate more inbound calls and capture high-margin jobs.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 sm:mb-14 pb-4 border-b border-current/10">
          <span className="text-xs font-mono uppercase tracking-widest opacity-60 mr-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Filter by:
          </span>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat.key
                  ? 'bg-[#FF6B1A] text-white font-bold shadow-md shadow-[#FF6B1A]/20 scale-105'
                  : isDark
                  ? 'bg-white/5 border border-white/10 hover:border-[#FF6B1A] text-neutral-300'
                  : 'bg-black/5 border border-black/10 hover:border-[#FF6B1A] text-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid - Whole Card is Clickable as a Link */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectArticle(post.slug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectArticle(post.slug);
                }
              }}
              className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] ${
                isDark
                  ? 'bg-[#0A0A0A] border-white/10 hover:border-[#FF6B1A]/50 shadow-black'
                  : 'bg-white border-black/10 hover:border-[#FF6B1A]/50 shadow-black/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 text-[11px] font-mono uppercase tracking-widest">
                  <span className="px-2.5 py-1 rounded-md bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold border border-[#FF6B1A]/20">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-3 opacity-60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.publishDate}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug group-hover:text-[#FF6B1A] transition-colors">
                  {post.title}
                </h2>

                <p className="mt-3 text-sm opacity-80 leading-relaxed line-clamp-3">
                  {post.subtitle}
                </p>

                {/* Key takeaways callout box */}
                <div
                  className={`mt-6 p-4 rounded-xl border text-xs space-y-2 ${
                    isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF6B1A] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Core Takeaways:
                  </div>
                  <ul className="space-y-1.5 opacity-90">
                    {post.takeaways.slice(0, 2).map((takeaway, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-current/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#FF6B1A]"
                  />
                  <div className="truncate text-xs">
                    <div className="font-bold truncate">{post.author.name}</div>
                    <div className="opacity-60 text-[10px] truncate">{post.author.role}</div>
                  </div>
                </div>

                <span className="px-3.5 py-2 rounded-lg bg-[#FF6B1A] text-white text-xs font-bold uppercase tracking-wider group-hover:bg-[#ff5500] transition-colors flex items-center gap-1 flex-shrink-0 shadow-md shadow-[#FF6B1A]/20 pointer-events-none">
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Local Growth CTA Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-[#0D0D0D] to-[#050505] border-white/15'
              : 'bg-gradient-to-br from-white to-[#F0EFEA] border-black/15 shadow-xl'
          }`}
        >
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold block mb-3">
              TERRITORY EXCLUSIVE DEPLOYMENT
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Want These Systems Deployed in Your Service Area?
            </h3>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              We engineer complete local growth systems for one business per category per geographic radius. Book a 100% free technical audit to analyze your local map rankings, site speed, and missed-call leakage.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAudit}
                className="px-6 py-3.5 bg-[#FF6B1A] hover:bg-[#ff5500] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-[#FF6B1A]/25 transition-all hover:scale-[1.02]"
              >
                Claim Free Growth Audit →
              </button>
              <button
                onClick={onExploreServices || (() => onNavigateHome && onNavigateHome('services'))}
                className="px-6 py-3.5 border border-current/20 hover:border-[#FF6B1A] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
              >
                Explore All Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

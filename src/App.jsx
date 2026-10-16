import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Star,
  ShieldCheck,
  Calculator,
  Zap,
  Clock,
  Users,
  BarChart3,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Mail,
  ExternalLink,
  Globe,
  Building2,
  ChevronDown,
  Check,
  AlertCircle,
  MessageSquare,
  Award,
  Layers
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [caseStudyFilter, setCaseStudyFilter] = useState('all');

  // ROI Calculator States
  const [monthlyLeads, setMonthlyLeads] = useState(35);
  const [avgTicket, setAvgTicket] = useState(1400);
  const [closeRate, setCloseRate] = useState(25);

  // Audit Form States
  const [auditForm, setAuditForm] = useState({
    businessName: '',
    website: '',
    city: '',
    bottleneck: 'Need More Calls & #1 Google Maps Ranking',
    name: '',
    phone: '',
    workEmail: '',
    company_fax_hp: '' // Honeypot
  });
  const [auditStatus, setAuditStatus] = useState({ loading: false, success: false, error: null });

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ loading: false, success: false, error: null });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  // Calculator calculations
  const calcResults = useMemo(() => {
    const currentCustomers = Math.round((monthlyLeads * closeRate) / 100);
    const currentRevenue = currentCustomers * avgTicket;

    // SearchandService projected 2.8x - 3.4x lift via Maps #1 + Instant AI Speed-to-lead
    const projectedLeads = Math.round(monthlyLeads * 2.8);
    // Speed to lead increases close rate by ~35%
    const projectedCloseRate = Math.min(Math.round(closeRate * 1.35), 65);
    const projectedCustomers = Math.round((projectedLeads * projectedCloseRate) / 100);
    const projectedRevenue = projectedCustomers * avgTicket;
    const additionalMonthly = projectedRevenue - currentRevenue;
    const additionalYearly = additionalMonthly * 12;

    return {
      currentCustomers,
      currentRevenue,
      projectedLeads,
      projectedCloseRate,
      projectedCustomers,
      projectedRevenue,
      additionalMonthly,
      additionalYearly
    };
  }, [monthlyLeads, avgTicket, closeRate]);

  // Handle Audit Submission
  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    setAuditStatus({ loading: true, success: false, error: null });

    try {
      let web = auditForm.website.trim();
      if (!web.startsWith('http://') && !web.startsWith('https://')) {
        web = 'https://' + web;
      }

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...auditForm,
          website: web
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Unable to submit audit request.');
      }

      setAuditStatus({ loading: false, success: true, error: null });
      setAuditForm({
        businessName: '',
        website: '',
        city: '',
        bottleneck: 'Need More Calls & #1 Google Maps Ranking',
        name: '',
        phone: '',
        workEmail: '',
        company_fax_hp: ''
      });
    } catch (err) {
      setAuditStatus({ loading: false, success: false, error: err.message });
    }
  };

  // Handle Newsletter Submission
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to subscribe.');
      }

      setNewsletterStatus({ loading: false, success: true, error: null });
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus({ loading: false, success: false, error: err.message });
    }
  };

  const caseStudies = [
    {
      category: 'trades',
      niche: 'HVAC & Plumbing Co.',
      market: 'Austin, TX',
      metric: '+318% Inbound Calls',
      detail: 'Ranked #1 for 19 high-ticket local search terms in 74 days.',
      revLift: '+$142,000/mo',
      tags: ['Google 3-Pack', 'Speed-To-Lead AI', 'Reviews']
    },
    {
      category: 'contractors',
      niche: 'Commercial & Residential Roofing',
      market: 'Denver, CO',
      metric: '#1 Map Pack Across 14 Zip Codes',
      detail: 'Eliminated wasted $8k/mo pay-per-click spend with organic local search dominance.',
      revLift: '+$210,000/mo',
      tags: ['Geo-Grid Dominance', 'Reputation Engine']
    },
    {
      category: 'home-services',
      niche: 'Elite Landscaping & Hardscapes',
      market: 'Charlotte, NC',
      metric: '68 Exclusive Booked Estimates/mo',
      detail: 'Converted sub-second mobile website with automated 60-second SMS quote engine.',
      revLift: '+$94,000/mo',
      tags: ['Sub-Second Web', 'Missed Call Text Back']
    },
    {
      category: 'medical',
      niche: 'Private Dental & Orthodontic Practice',
      market: 'Scottsdale, AZ',
      metric: '4.9 Stars Across 420+ Reviews',
      detail: 'Autonomous post-appointment review system boosting high-value implant consultations.',
      revLift: '+$115,000/mo',
      tags: ['5-Star Review Funnel', 'High-Converting Web']
    }
  ];

  const filteredCaseStudies = caseStudyFilter === 'all'
    ? caseStudies
    : caseStudies.filter(item => item.category === caseStudyFilter);

  const pillars = [
    {
      icon: <MapPin className="w-8 h-8 text-[#FF6B1A]" />,
      num: '01',
      title: 'Google Maps #1 Local 3-Pack Dominance',
      description:
        'When local homeowners need emergency help or high-ticket services, 78% call one of the top 3 Google Maps listings. We optimize local entity signals, citations, geo-tagged authority, and proximity algorithms to put your business at #1.'
    },
    {
      icon: <Zap className="w-8 h-8 text-[#FF6B1A]" />,
      num: '02',
      title: 'Sub-Second High-Conversion Web Architecture',
      description:
        'No bloated page-builders or slow templates. We engineer hyper-fast, mobile-first web platforms designed with psychological conversion triggers, instant tap-to-call, and frictionless quote requests that turn visitors into booked jobs.'
    },
    {
      icon: <Clock className="w-8 h-8 text-[#FF6B1A]" />,
      num: '03',
      title: 'Under-60-Second AI Speed-to-Lead Engine',
      description:
        '73% of customers hire whichever contractor answers first. Our automated workflows instantly capture missed calls, trigger customized two-way SMS dialogues within 45 seconds, and automatically sync booked jobs to your calendar.'
    },
    {
      icon: <Star className="w-8 h-8 text-[#FF6B1A]" />,
      num: '04',
      title: 'Automated 5-Star Reputation Flywheel',
      description:
        'Turn happy homeowners into your greatest sales reps. Automated post-service SMS review requests filter feedback, amplify 5-star Google ratings, and suppress negative disputes before they reach the public profile.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#FF6B1A]" />,
      num: '05',
      title: 'Exclusive Inbound Market Moat (No Shared Leads)',
      description:
        'Stop paying Angi or Thumbtack for tire-kickers shared with 6 competitors. We build dedicated client-owned assets so every phone call, form fill, and referral is 100% exclusive to your business.'
    }
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-[#0A0A0B] text-zinc-100' : 'bg-[#F8F7F4] text-zinc-900'}`}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FF6B1A] to-[#FF8844] text-white py-2 px-4 text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Accepting 2 exclusive territory partners per metro market for Q2/Q3 growth sprints.</span>
        <button
          onClick={() => setAuditModalOpen(true)}
          className="underline hover:text-black transition-colors font-bold ml-1 cursor-pointer"
        >
          Check Territory Availability &rarr;
        </button>
      </div>

      {/* Main Navigation */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${isDark ? 'bg-[#0A0A0B]/85 border-zinc-800' : 'bg-white/85 border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B1A] to-[#E05307] flex items-center justify-center shadow-lg shadow-[#FF6B1A]/20">
              <TrendingUp className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">
                Search<span className="text-[#FF6B1A]">&</span>Service
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                Local Growth Systems
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#system" className="hover:text-[#FF6B1A] transition-colors">5-Pillar System</a>
            <a href="#calculator" className="hover:text-[#FF6B1A] transition-colors">ROI Calculator</a>
            <a href="#case-studies" className="hover:text-[#FF6B1A] transition-colors">Case Studies</a>
            <a href="#guarantee" className="hover:text-[#FF6B1A] transition-colors">The Guarantee</a>
            <a href="#faq" className="hover:text-[#FF6B1A] transition-colors">FAQ</a>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-colors ${isDark ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}`}
              aria-label="Toggle Day/Night Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            <button
              onClick={() => setAuditModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-[#FF6B1A] hover:bg-[#E05307] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#FF6B1A]/25 hover:shadow-lg hover:shadow-[#FF6B1A]/35 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Free Growth Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b px-4 py-6 flex flex-col gap-4 text-base font-semibold ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <a href="#system" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6B1A]">5-Pillar System</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6B1A]">ROI Calculator</a>
            <a href="#case-studies" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6B1A]">Case Studies</a>
            <a href="#guarantee" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6B1A]">The Guarantee</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6B1A]">FAQ</a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAuditModalOpen(true);
              }}
              className="w-full text-center bg-[#FF6B1A] text-white py-3 rounded-xl font-bold mt-2"
            >
              Request Free Territory Growth Audit
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B1A]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold mb-8 backdrop-blur-sm transition-colors border-[#FF6B1A]/30 bg-[#FF6B1A]/10 text-[#FF6B1A]">
            <Award className="w-4 h-4" />
            <span>Built Exclusively for Local Service & Trade Businesses</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Stop Relying on Shared Leads.{' '}
            <span className="bg-gradient-to-r from-[#FF6B1A] via-[#FF8844] to-[#FFA066] bg-clip-text text-transparent">
              Own #1 on Google Maps
            </span>{' '}
            in Your Service Area.
          </h1>

          <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            We build predictable customer generation engines for contractors, trade pros, and local service providers. Combining <strong>#1 Google 3-Pack rankings</strong>, <strong>lightning-fast websites</strong>, and <strong>24/7 AI speed-to-lead automation</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <button
              onClick={() => setAuditModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#FF6B1A] hover:bg-[#E05307] text-white font-bold text-base px-8 py-4 rounded-xl transition-all shadow-xl shadow-[#FF6B1A]/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Get Free 48-Hr Growth Audit</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#calculator"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 border font-semibold text-base px-7 py-4 rounded-xl transition-colors ${isDark ? 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200' : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800'}`}
            >
              <Calculator className="w-4 h-4 text-[#FF6B1A]" />
              <span>Calculate Revenue Lift</span>
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B1A]">318%</div>
              <div className="text-xs text-zinc-400 font-medium mt-1">Average Call Increase</div>
            </div>
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B1A]">&lt;45s</div>
              <div className="text-xs text-zinc-400 font-medium mt-1">AI Lead Response Time</div>
            </div>
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B1A]">100%</div>
              <div className="text-xs text-zinc-400 font-medium mt-1">Exclusive Inbound Calls</div>
            </div>
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B1A]">90-Day</div>
              <div className="text-xs text-zinc-400 font-medium mt-1">ROI Performance Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Pillar System Section */}
      <section id="system" className={`py-24 border-t transition-colors ${isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-200 bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B1A]">Proprietary Framework</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-4">
              The 5-Pillar Local Market Dominance Engine
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Most agencies sell isolated services like "just SEO" or "just a new logo". We install an integrated growth infrastructure that captures, converts, and compounds local market share.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#FF6B1A]/40 hover:bg-zinc-900/70' : 'bg-white border-zinc-200 hover:border-[#FF6B1A]/40 shadow-sm hover:shadow-md'}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/20">
                      {pillar.icon}
                    </div>
                    <span className="text-2xl font-black text-zinc-500/40">{pillar.num}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{pillar.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA Card as 6th block */}
            <div className="relative rounded-3xl p-8 border border-[#FF6B1A]/40 bg-gradient-to-br from-[#FF6B1A]/15 to-[#FF6B1A]/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">Zero Risk</span>
                <h3 className="text-2xl font-black mt-2 mb-3">Claim Your Market Territory</h3>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  We never work with your direct competitors. Once you partner with SearchandService in your category and zip radius, we lock the territory for your company.
                </p>
              </div>
              <button
                onClick={() => setAuditModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B1A] hover:bg-[#E05307] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-[#FF6B1A]/30 cursor-pointer"
              >
                <span>Check Territory Exclusivity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="calculator" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B1A]">Interactive Diagnostic</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-4">
              Local Revenue & ROI Growth Simulator
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Adjust your current numbers below to estimate how much additional revenue is slipping through missed calls, poor search ranking, and slow lead response.
            </p>
          </div>

          <div className={`rounded-3xl border p-6 sm:p-10 lg:p-12 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isDark ? 'bg-zinc-900/60 border-zinc-800 shadow-2xl shadow-black/60' : 'bg-white border-zinc-200 shadow-xl'}`}>
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-8">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Current Inbound Calls & Inquiries / Month</span>
                  </label>
                  <span className="text-lg font-black text-[#FF6B1A]">{monthlyLeads} leads</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full accent-[#FF6B1A] cursor-pointer h-2 bg-zinc-700/50 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>5 leads/mo</span>
                  <span>100 leads/mo</span>
                  <span>200 leads/mo</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Average Value Per Booked Job / Client</span>
                  </label>
                  <span className="text-lg font-black text-[#FF6B1A]">${avgTicket.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="12000"
                  step="200"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-[#FF6B1A] cursor-pointer h-2 bg-zinc-700/50 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>$200 (Maintenance)</span>
                  <span>$3,500 (Trade Repair)</span>
                  <span>$12,000+ (Replacement/Install)</span>
                </div>
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Current Lead-To-Close Rate</span>
                  </label>
                  <span className="text-lg font-black text-[#FF6B1A]">{closeRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={closeRate}
                  onChange={(e) => setCloseRate(Number(e.target.value))}
                  className="w-full accent-[#FF6B1A] cursor-pointer h-2 bg-zinc-700/50 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>10% (Slow follow-up)</span>
                  <span>25% (Standard)</span>
                  <span>60% (Top 1% speed)</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Based on verified local trade benchmark datasets across 180+ service markets.</span>
              </div>
            </div>

            {/* Results Display */}
            <div className={`lg:col-span-5 rounded-2xl p-6 sm:p-8 border flex flex-col justify-between ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF6B1A]">Projected Revenue Impact</span>
                <div className="mt-4 mb-6">
                  <div className="text-xs text-zinc-400 uppercase font-semibold">Additional Monthly Pipeline</div>
                  <div className="text-4xl font-extrabold text-[#FF6B1A] mt-1">
                    +${calcResults.additionalMonthly.toLocaleString()}
                    <span className="text-sm font-normal text-zinc-400">/mo</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800/60 pt-4 pb-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Projected Extra Booked Jobs:</span>
                    <span className="font-bold">+{calcResults.projectedCustomers - calcResults.currentCustomers} jobs/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Estimated Annual Revenue Lift:</span>
                    <span className="font-bold text-emerald-400">+${calcResults.additionalYearly.toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Response Speed Boost:</span>
                    <span className="font-bold text-blue-400">&lt; 45s SMS Auto-Engage</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setAuditModalOpen(true)}
                className="w-full mt-6 bg-[#FF6B1A] hover:bg-[#E05307] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#FF6B1A]/30 text-center cursor-pointer"
              >
                Lock In This Growth Model &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies / Proof */}
      <section id="case-studies" className={`py-24 border-t transition-colors ${isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-200 bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B1A]">Real Market Results</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-4">
              Proven Results Across Competitive Metro Markets
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Here is how local businesses exploded their inbound dispatch volume after deploying the SearchandService infrastructure.
            </p>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {['all', 'trades', 'contractors', 'home-services', 'medical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCaseStudyFilter(cat)}
                  className={`text-xs uppercase font-bold tracking-wider px-4 py-2 rounded-xl transition-all ${
                    caseStudyFilter === cat
                      ? 'bg-[#FF6B1A] text-white shadow-md shadow-[#FF6B1A]/20'
                      : isDark
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      : 'bg-white border border-zinc-300 text-zinc-600 hover:text-black'
                  }`}
                >
                  {cat === 'all' ? 'All Niches' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCaseStudies.map((study, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 border transition-all duration-300 hover:border-[#FF6B1A]/40 flex flex-col justify-between ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider">{study.market}</span>
                      <h3 className="text-2xl font-bold mt-1">{study.niche}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-400">{study.revLift}</span>
                      <span className="block text-[10px] text-zinc-500 uppercase">Tracked Growth</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl mb-6 border ${isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="text-lg font-extrabold text-[#FF6B1A]">{study.metric}</div>
                    <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{study.detail}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/50">
                  {study.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-xs px-3 py-1 rounded-lg font-medium ${isDark ? 'bg-zinc-800/60 text-zinc-300' : 'bg-zinc-100 text-zinc-700'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Guarantee Section */}
      <section id="guarantee" className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-3xl border p-8 sm:p-14 text-center relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-zinc-900/80 to-zinc-950 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl'}`}>
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-9 h-9 text-[#FF6B1A]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Our 90-Day "More Calls or You Don’t Pay" Performance Guarantee
            </h2>

            <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              We do not believe in 12-month lock-in contracts that reward agencies for doing nothing. If we don’t noticeably increase your Google Maps visibility and qualified inbound call volume within the first 90 days, we work completely free until we do.
            </p>

            <button
              onClick={() => setAuditModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#FF6B1A] hover:bg-[#E05307] text-white font-bold text-base px-8 py-4 rounded-xl transition-all shadow-xl shadow-[#FF6B1A]/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Verify Your Territory Qualification</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-24 border-t transition-colors ${isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-200 bg-zinc-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B1A]">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'How fast can our business reach the Google Maps 3-Pack?',
                a: 'Most of our clients see measurable ranking jumps in 21 to 45 days. High-competition metro markets typically achieve dominant #1 to #3 rankings within 60 to 90 days. We provide transparent weekly geo-grid ranking scans so you can see your exact rank pin by pin across town.'
              },
              {
                q: 'Do you work with our competitors in the same city?',
                a: 'Never. We uphold a strict one-partner-per-industry policy per territory radius. If we take on an HVAC or roofing contractor in North Austin, we will reject every other company in that market while you are our active partner.'
              },
              {
                q: 'How does the AI Speed-to-Lead system work?',
                a: 'When an emergency or quotation call is missed after hours or while your technicians are on a job, our system triggers an automated custom SMS within 45 seconds asking the homeowner what they need. 73% of callers respond and book right away instead of calling your competitor.'
              },
              {
                q: 'What is included in the Free 48-Hour Growth Audit?',
                a: 'We generate an in-depth diagnostic showing your exact Google 3-Pack geo-grid ranking, missed keyword revenue, website speed benchmark, and conversion leaks. We send you the video teardown with zero obligation.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 border ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}
              >
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B1A] shrink-0" />
                  <span>{item.q}</span>
                </h3>
                <p className={`text-sm leading-relaxed pl-7 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Newsletter */}
      <footer className={`border-t py-16 transition-colors ${isDark ? 'bg-black border-zinc-900 text-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-zinc-800/50">
            {/* Col 1 */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B1A] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black tracking-tight text-white">
                  Search<span className="text-[#FF6B1A]">&</span>Service
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-sm">
                Engineered growth systems for local businesses, contractors, and trades. Turning search traffic into exclusive high-ticket booked revenue.
              </p>
              <div className="text-xs space-y-1">
                <div>Email: <a href="mailto:searchandservice@gmail.com" className="text-[#FF6B1A] hover:underline">searchandservice@gmail.com</a></div>
                <div>Production Origin: <span className="text-zinc-300">https://searchandservice.pages.dev</span></div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="md:col-span-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Growth Systems</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#system" className="hover:text-[#FF6B1A] transition-colors">Google Maps 3-Pack</a></li>
                <li><a href="#system" className="hover:text-[#FF6B1A] transition-colors">Speed-To-Lead AI</a></li>
                <li><a href="#system" className="hover:text-[#FF6B1A] transition-colors">Conversion Web Platforms</a></li>
                <li><a href="#system" className="hover:text-[#FF6B1A] transition-colors">5-Star Review Engine</a></li>
              </ul>
            </div>

            {/* Col 3: Newsletter */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Local Growth Briefings</h4>
              <p className="text-xs text-zinc-400 mb-4">
                Join 1,400+ local service owners receiving weekly teardowns of high-converting marketing funnels.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="owner@yourcompany.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className={`text-sm px-4 py-2.5 rounded-xl border flex-1 outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-black'}`}
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus.loading}
                    className="bg-[#FF6B1A] hover:bg-[#E05307] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shrink-0"
                  >
                    {newsletterStatus.loading ? 'Joining...' : 'Subscribe'}
                  </button>
                </div>
                {newsletterStatus.success && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed! Check your inbox soon.
                  </p>
                )}
                {newsletterStatus.error && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {newsletterStatus.error}
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <div>&copy; {new Date().getFullYear()} SearchandService Agency. All rights reserved. Built for Cloudflare Pages.</div>
            <div className="flex gap-6">
              <a href="#system" className="hover:underline">Privacy Policy</a>
              <a href="#system" className="hover:underline">Terms of Service</a>
              <a href="#system" className="hover:underline">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Free Growth Audit Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl relative max-h-[90vh] overflow-y-auto ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}
          >
            <button
              onClick={() => setAuditModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B1A]">48-Hour Diagnostic</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Claim Your Free Local Growth Audit
              </h3>
              <p className={`text-sm mt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                We will analyze your Google 3-Pack rankings, competitor gaps, and missed call leakages, delivered directly to your inbox.
              </p>
            </div>

            {auditStatus.success ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-emerald-400 mb-1">Audit Request Received!</h4>
                <p className="text-sm text-zinc-300">
                  Our growth engineers are analyzing your territory. You will receive your custom teardown report within 48 business hours.
                </p>
                <button
                  onClick={() => {
                    setAuditStatus({ loading: false, success: false, error: null });
                    setAuditModalOpen(false);
                  }}
                  className="mt-6 bg-[#FF6B1A] text-white text-sm font-bold px-6 py-2.5 rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuditSubmit} className="space-y-4">
                {/* Honeypot field */}
                <input
                  type="text"
                  name="company_fax_hp"
                  value={auditForm.company_fax_hp}
                  onChange={(e) => setAuditForm({ ...auditForm, company_fax_hp: e.target.value })}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex HVAC Pros"
                      value={auditForm.businessName}
                      onChange={(e) => setAuditForm({ ...auditForm, businessName: e.target.value })}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                      Website URL *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="https://yourwebsite.com"
                      value={auditForm.website}
                      onChange={(e) => setAuditForm({ ...auditForm, website: e.target.value })}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-300'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                      Metro City / Territory *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Austin, TX"
                      value={auditForm.city}
                      onChange={(e) => setAuditForm({ ...auditForm, city: e.target.value })}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                      Primary Bottleneck
                    </label>
                    <select
                      value={auditForm.bottleneck}
                      onChange={(e) => setAuditForm({ ...auditForm, bottleneck: e.target.value })}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-300'}`}
                    >
                      <option>Need More Calls & #1 Google Maps Ranking</option>
                      <option>Tired of Shared Leads from Angi / HomeAdvisor</option>
                      <option>Missed Calls While Technicians Are On Jobs</option>
                      <option>Website Does Not Convert Visitors to Booked Jobs</option>
                      <option>Need More 5-Star Reviews to Beat Local Competitors</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={auditForm.name}
                      onChange={(e) => setAuditForm({ ...auditForm, name: e.target.value })}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={auditForm.phone}
                      onChange={(e) => setAuditForm({ ...auditForm, phone: e.target.value })}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="owner@company.com"
                      value={auditForm.workEmail}
                      onChange={(e) => setAuditForm({ ...auditForm, workEmail: e.target.value })}
                      className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none focus:border-[#FF6B1A] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-300'}`}
                    />
                  </div>
                </div>

                {auditStatus.error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{auditStatus.error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={auditStatus.loading}
                  className="w-full mt-2 bg-[#FF6B1A] hover:bg-[#E05307] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#FF6B1A]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {auditStatus.loading ? (
                    <span>Generating Audit Request...</span>
                  ) : (
                    <>
                      <span>Submit & Request Territory Audit</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-zinc-500 text-center">
                  Protected by 256-bit encryption. We never sell or share your contact details.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

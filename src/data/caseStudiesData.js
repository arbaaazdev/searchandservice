export const CASE_STUDIES_DATA = [
  {
    id: 1,
    title: 'Apex Climate & Mechanical',
    clientType: 'Commercial & Residential HVAC Contractor',
    category: 'WEB + GOOGLE MAPS OPTIMIZATION',
    filterKey: 'maps',
    metricBadge: '+25% Inbound Calls in 90 Days',
    location: 'Austin, TX',
    summary:
      'Website redesign, streamlined service booking funnel, and local SEO optimization across targeted service areas.',
    challenge:
      'Apex had been servicing greater Austin for 12 years with great word of mouth, but their digital footprint was stagnant. They ranked on page 2 (positions 8–12) for core HVAC repair queries and lost high-margin summer A/C replacement jobs to newly established regional franchises.',
    solution:
      'We rebuilt their website on our high-performance React architecture with sub-second loading, engineered 14 geo-targeted neighborhood landing pages (Round Rock, Pflugerville, Westlake, Cedar Park), overhauled their Google Business Profile categories and secondary services, and implemented geo-grid rank tracking.',
    stats: [
      { label: 'Map Pack Rank', value: 'Positions 8–12 → 3–5' },
      { label: 'Monthly Calls', value: '32 → 40' },
      { label: 'Added Revenue', value: '+$4,000/mo' },
      { label: 'Page Speed Index', value: '4.8s → 0.9s' }
    ],
    timeline: '60–90 Days Deployment',
    deliverables: [
      'Google Business Profile Full Overhaul',
      '14 Neighborhood Hyper-Local Pages',
      'Instant Click-to-Call Emergency Sticky Bar',
      'Automated Post-Service Review Collection Flow'
    ],
    testimonial: {
      quote:
        '“Moved into the Local Map Pack top rankings within 60 days—our inbound service calls increased steadily. The phone doesn’t stop ringing during heatwaves.”',
      author: 'Marcus Vance',
      role: 'Founder & CEO, Vance HVAC & Mechanical'
    }
  },
  {
    id: 2,
    title: 'Lumina Aesthetics & MedSpa',
    clientType: 'Boutique Medical Aesthetic Clinic',
    category: 'AUTOMATION + REVIEWS',
    filterKey: 'ai',
    metricBadge: '+20% Consultation Inquiries in 90 Days',
    location: 'Scottsdale, AZ',
    summary:
      'Automated consultation follow-ups and post-visit review requests to improve booking efficiency and local reputation.',
    challenge:
      'High client no-show rates (15%) and missed evening/weekend inquiries. Potential patients searching for aesthetic treatments were submitting consultation forms on Friday night and booking with competitors by Monday morning.',
    solution:
      'Integrated our 24/7 AI Speed-to-Lead text-back system and conversational booking assistant. Inquiries are responded to in under 45 seconds via 2-way SMS with direct calendar synchronization, followed by automated multi-channel appointment reminder sequences.',
    stats: [
      { label: '5-Star Reviews', value: '18 → 38' },
      { label: 'Monthly Inquiries', value: '25 → 30' },
      { label: 'No-Show Rate', value: '15% → 11%' },
      { label: 'Speed to Lead', value: '6 hrs → 42 sec' }
    ],
    timeline: '30 Days Integration',
    deliverables: [
      '24/7 Sub-Minute SMS Response Engine',
      'Automated Consultation Calendar Routing',
      'Smart Review Filtering & Google Sync',
      'Past-Patient Reactivation Sequence'
    ],
    testimonial: {
      quote:
        '“SearchandService streamlined our booking workflow and enhanced our local visibility across local search. Our weekend form drops are now booked appointments before Monday opens.”',
      author: 'Sophia Chen',
      role: 'Owner & Founder, Lumina MedSpa & Wellness'
    }
  },
  {
    id: 3,
    title: 'Vanguard Injury & Legal Group',
    clientType: 'Personal Injury & Civil Litigation Practice',
    category: 'HIGH-CONVERTING WEB',
    filterKey: 'web',
    metricBadge: '50% More Efficient Intake Experience',
    location: 'Chicago, IL',
    summary:
      'Professional website redesign, faster page loading, and streamlined legal intake forms to reduce friction for prospective clients.',
    challenge:
      'High cost-per-click traffic was arriving at an outdated, cluttered legal portal with a 9-field generic form. Potential plaintiffs abandoned the site on mobile devices before submitting their claim details.',
    solution:
      'Deployed an ultra-minimalist, high-authority conversion architecture. Replaced the clunky form with a 3-step conversational intake funnel, added clear attorney credibility badges, and optimized mobile page rendering to 1.2 seconds.',
    stats: [
      { label: 'Conversion Rate', value: '5.2% → 6.4%' },
      { label: 'Page Load Speed', value: '1.8 sec → 1.2 sec' },
      { label: 'Intake Tracking', value: 'Lead sources organized' },
      { label: 'Mobile Drop-Off', value: '-38% Bounce Rate' }
    ],
    timeline: '21 Days Build & Launch',
    deliverables: [
      'Mobile-First Legal Conversion UX',
      '3-Step Frictionless Case Evaluation Funnel',
      'Dynamic Call Tracking & Intake Tagging',
      'Technical Schema.org LegalService SEO'
    ],
    testimonial: {
      quote:
        '“Our local organic search presence and map visibility brought qualified consultation leads consistently. The intake flow is night-and-day superior to our old website.”',
      author: 'David Sterling',
      role: 'Managing Director, Sterling Legal Group'
    }
  },
  {
    id: 4,
    title: 'SearchAndService Command OS',
    clientType: 'Multi-Location Home Improvement Franchise',
    category: 'CUSTOM KPI DASHBOARD',
    filterKey: 'dashboard',
    metricBadge: 'Unified Reporting Across 3 Locations',
    location: 'Multi-Location Franchise',
    summary:
      'Centralized reporting dashboard combining location performance, incoming calls, and lead-source attribution.',
    challenge:
      'Leadership had no transparent attribution for marketing spend across their 3 regional branches. Inbound calls were handled across separate phone lines without call recording or lead status tracking.',
    solution:
      'Architected a single real-time executive dashboard combining Google Business Profile API metrics, dynamic call tracking, form submissions, and cost-per-acquisition analysis across all 3 locations.',
    stats: [
      { label: 'Locations Synced', value: '3 Branches' },
      { label: 'Admin Time Saved', value: '4 hrs/week' },
      { label: 'Lead Attribution', value: '90% of tracked leads' },
      { label: 'ROI Transparency', value: '100% Channel Clarity' }
    ],
    timeline: '14 Days Integration',
    deliverables: [
      'Multi-Location Executive Command Center',
      'Dynamic Number Insertion (DNI) Setup',
      'Automated Weekly KPI Email Digests',
      'Lead Quality Scoring & Outcome Tracking'
    ],
    testimonial: {
      quote:
        '“Clean website architecture and structured lead tracking saves my team valuable administrative hours weekly. I know exactly which marketing channel produces our profitable jobs.”',
      author: 'Tariq Mahmood',
      role: 'Managing Partner, PrimeLine Roofing & Exteriors'
    }
  }
];

export const CASE_STUDY_FILTERS = [
  { key: 'all', label: 'All Case Studies' },
  { key: 'maps', label: 'Google Maps & Local SEO' },
  { key: 'ai', label: 'AI Automation & Speed-to-Lead' },
  { key: 'web', label: 'High-Converting Web' },
  { key: 'dashboard', label: 'Custom KPI Dashboards' }
];

import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { faqs } from '../faqData';

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'ac' | 'ro' | 'electrical' | 'appliances'>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Handle accordion toggle
  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Filter and Search Logic
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesTab = activeTab === 'all' || faq.cat === activeTab;
      const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [searchQuery, activeTab]);

  // Schema Markup for Google rich snippets
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFaqs.slice(0, 15).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>FAQ Service Helpdesk | KS Electrical & AC Services</title>
        <meta name="description" content="Browse our complete doorstep home services FAQ. Solutions for AC installation, gas charging, RO filters, electrical short circuits, and washing machine repairs." />
        <link rel="canonical" href="https://www.kselectrical.in/faq" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'FAQs' }]} />

      <section className="max-w-6xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        
        {/* Header Block */}
        <div className="mb-10 text-center sm:text-left space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-brand-orange border border-orange-100 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} className="text-brand-orange" /> Helpdesk Directory
          </span>
          <h1 className="text-gray-900 font-black text-3xl sm:text-4xl tracking-tight leading-none">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-semibold leading-relaxed max-w-3xl">
            Have queries regarding diagnostic fees, warranties, spare parts, or appliance repair procedures? Select a category or search your query below for instant support.
          </p>
        </div>

        {/* Search Bar & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-center">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search questions (e.g. AC gas, warranty, filter, MCB)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIdx(null); // Reset open states during typing
              }}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-brand-blue rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-around text-center">
            <div>
              <span className="block text-lg font-black text-brand-blue">{faqs.length}+</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total FAQs</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="block text-lg font-black text-brand-orange">30 Days</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Job Warranty</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="block text-lg font-black text-emerald-500">Free</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Diagnosis</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-5">
          {([
            { id: 'all', label: '⚡ All Questions' },
            { id: 'general', label: '🏠 General & Booking' },
            { id: 'ac', label: '❄️ AC & Rentals' },
            { id: 'ro', label: '💧 RO Purifiers' },
            { id: 'electrical', label: '🔌 Electrical Work' },
            { id: 'appliances', label: '🧺 Home Appliances' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setOpenIdx(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3.5 max-w-4xl">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              
              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-slate-350 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(idx)}
                    className="w-full flex items-center justify-between px-5 py-4.5 font-bold text-gray-900 text-xs sm:text-sm hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3.5 pr-4">
                      <HelpCircle size={17} className="text-brand-blue shrink-0" />
                      <span className="leading-snug text-slate-800 font-extrabold">{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/20 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-300 rounded-3xl max-w-4xl space-y-3">
            <HelpCircle size={32} className="text-slate-400 mx-auto" />
            <h3 className="text-slate-700 font-bold text-base">No Matching Questions Found</h3>
            <p className="text-slate-400 text-xs font-semibold">
              Try search keywords like 'AC', 'gas', 'charge', 'warranty', 'filter', or change tabs.
            </p>
          </div>
        )}

      </section>
    </>
  );
};

export default FAQPage;

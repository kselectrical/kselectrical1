import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface FAQItem {
  q: string;
  a: string;
  cat: 'general' | 'ac' | 'ro' | 'electrical' | 'appliances';
}

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'ac' | 'ro' | 'electrical' | 'appliances'>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    // === GENERAL CATEGORY ===
    {
      cat: 'general',
      q: "How do I book a doorstep technician with KS Electrical & AC Services?",
      a: "You can book directly through our website by adding services to your cart and completing the checkout process, or you can call us directly on our hotlines +91 9582041216 / +91 8851410103. Our booking operator will schedule a technician visit immediately."
    },
    {
      cat: 'general',
      q: "Is the technician visiting or inspection fee free?",
      a: "Yes! Inspection and diagnostic visits are completely free if you proceed with any recommended repair or service. If you require inspection only with no repair work, we charge a nominal diagnostic fee of ₹99."
    },
    {
      cat: 'general',
      q: "What is your service warranty policy?",
      a: "We provide a solid 30-Day doorstep warranty on all appliance repairs, electrical troubleshooting, and AC services. If any issue recurs with the serviced part within 30 days, we fix it free of cost."
    },
    {
      cat: 'general',
      q: "What payment methods do you accept?",
      a: "We accept all digital payment methods including UPI (PhonePe, Google Pay, Paytm), net banking, credit/debit cards, and cash. You can pay the technician directly upon completion of the service."
    },
    {
      cat: 'general',
      q: "Can I reschedule or cancel my booked service slot?",
      a: "Yes, you can cancel or reschedule your slot free of charge. We request that you inform us at least 1-2 hours prior to your scheduled slot so we can redirect our technicians to other requests."
    },
    {
      cat: 'general',
      q: "Are the technicians background-verified and safe?",
      a: "Absolutely. All our technicians are certified experts with complete police verification. We prioritize your home security, and our staff wear official uniforms and carry identification cards."
    },
    {
      cat: 'general',
      q: "Do you offer emergency late-night services?",
      a: "Yes. For critical electrical breakdowns, short circuits, or server room AC failures, we provide emergency support across Gaur City, Noida Extension, and Greater Noida West. Contact us directly via phone."
    },
    {
      cat: 'general',
      q: "Do you provide physical invoices for the services?",
      a: "Yes. A digital GST/non-GST tax invoice is automatically generated and sent via SMS or WhatsApp upon completion. You can also request a printed invoice copy from our technician."
    },
    {
      cat: 'general',
      q: "What if the repaired appliance breaks down after 30 days?",
      a: "While the free warranty expires after 30 days, we continue to support our customers. If the same part fails later, we offer a discounted repair rate on subsequent visits."
    },
    {
      cat: 'general',
      q: "Do you supply spare parts, or do I need to buy them myself?",
      a: "Our technicians carry genuine, high-quality spare parts with them. You do not need to buy anything. All spares used by us come with official manufacturer/vendor warranties."
    },
    {
      cat: 'general',
      q: "How long does it take for a technician to arrive?",
      a: "Under ordinary conditions, we guarantee a technician dispatch and arrival at your doorstep within 30 to 60 minutes across Gaur City 1, Gaur City 2, and nearby areas."
    },
    {
      cat: 'general',
      q: "Are your service rates fixed or negotiable?",
      a: "Our service rates are standard and completely transparent. All pricing details are published upfront on our services list. There are no hidden fees or post-service negotiations."
    },

    // === AC SERVICES & RENTALS ===
    {
      cat: 'ac',
      q: "What is included in your AC Jet Service?",
      a: "Our premium AC Jet Service includes deep pressure jet washing of both indoor and outdoor coils, drainage tray cleaning, air filter wash, fan blade cleaning, and electrical current checking."
    },
    {
      cat: 'ac',
      q: "Why is my air conditioner blowing warm air instead of cool air?",
      a: "Warm air is typically caused by low refrigerant gas levels, a clogged air filter blocking airflow, a faulty starting capacitor, or dirt accumulation on the outdoor condenser unit."
    },
    {
      cat: 'ac',
      q: "How often should I service my Split or Window AC?",
      a: "We recommend servicing your AC twice a year: once at the beginning of the summer season (deep jet wash) and once mid-season or during monsoon to prevent dust and water clogging."
    },
    {
      cat: 'ac',
      q: "What are your AC gas charging charges?",
      a: "AC gas charging starts from ₹2500 depending on the tonnage (1.0 Ton, 1.5 Ton, 2.0 Ton) and the type of refrigerant gas (R32, R410, R22). Our gas charging process includes leak detection and pressure tests."
    },
    {
      cat: 'ac',
      q: "Do you install copper piping for new Split AC installations?",
      a: "Yes. We offer high-gauge premium copper piping, condenser mounting brackets, drain pipes, and electrical cables. Piping charges are calculated per running foot."
    },
    {
      cat: 'ac',
      q: "What documents are required to get an AC on rent?",
      a: "We require basic verification documents: a copy of your Aadhaar card and your society rent agreement or electricity bill to verify your Gaur City/Noida Extension address."
    },
    {
      cat: 'ac',
      q: "Is there a security deposit for rental ACs?",
      a: "No, we offer AC rentals without any heavy security deposits for verified residential apartments in Gaur City 1, Gaur City 2, and premium societies. You only pay the seasonal rental fee."
    },
    {
      cat: 'ac',
      q: "Who pays for the maintenance and repairs of the rented AC?",
      a: "We take full responsibility! Any repairs, fan motor failures, capacitor replacements, or gas leakages during the rental season are fixed by us free of cost within 24 hours."
    },
    {
      cat: 'ac',
      q: "What size (tonnage) AC do I need for my room?",
      a: "For rooms up to 100 sq. ft., a 1.0 Ton AC is sufficient. For rooms between 100 to 180 sq. ft., a 1.5 Ton AC is ideal. For larger master bedrooms or halls, we recommend a 2.0 Ton AC."
    },
    {
      cat: 'ac',
      q: "Do you provide a stabilizer along with the rented AC?",
      a: "Yes. A compatible automatic voltage stabilizer is provided along with the rental AC unit to prevent damage from local voltage fluctuations."
    },
    {
      cat: 'ac',
      q: "What are your charges for Split AC installation and uninstallation?",
      a: "Split AC installation is ₹1199, and uninstallation is ₹799. If you book both together, we offer special package discounts."
    },
    {
      cat: 'ac',
      q: "Can I transfer my rented AC if I shift to another society?",
      a: "Yes. If you relocate within Gaur City, Noida Extension, or Crossing Republik, we can relocate the rental unit for a nominal packing and re-installation fee."
    },
    {
      cat: 'ac',
      q: "What is your turnaround time if a rented AC stops cooling?",
      a: "We dispatch a senior technician within 4-12 hours of complaint registration. If the unit cannot be repaired on-site, we replace the entire AC unit."
    },
    {
      cat: 'ac',
      q: "Is seasonal servicing of the rented AC free?",
      a: "Yes. Before delivery, each rental AC undergoes complete chemical cleaning and checkup. We also perform a free maintenance service checkup mid-season."
    },
    {
      cat: 'ac',
      q: "Why is water leaking from my indoor Split AC unit?",
      a: "Indoor water leakage is caused by a blocked condensate drain pipe, freezing of the evaporator coils due to low gas, or improper slope leveling during installation."
    },
    {
      cat: 'ac',
      q: "Do you rent out 3-star and 5-star inverter ACs?",
      a: "Yes. We offer energy-efficient 3-Star and 5-Star Split AC units on rent to help keep your monthly electricity bills low."
    },
    {
      cat: 'ac',
      q: "Can you repair AC inverter circuit boards (PCBs)?",
      a: "Yes. Our electronics lab specializes in repairing inverter AC outdoor and indoor PCBs, saving you the high cost of buying a new board."
    },
    {
      cat: 'ac',
      q: "What causes a foul smell from the AC vents?",
      a: "Foul smells are caused by mold and bacteria breeding on the wet cooling coils and drain pans. A professional chemical jet wash removes this instantly."
    },

    // === RO WATER PURIFIERS ===
    {
      cat: 'ro',
      q: "How often should I change my RO purifier filters?",
      a: "The external sediment pre-filter should be replaced every 3-6 months depending on water quality. The internal carbon and sediment filters should be replaced every 9-12 months."
    },
    {
      cat: 'ro',
      q: "Why does my RO purified water taste bitter or strange?",
      a: "A bitter taste is often caused by a worn-out carbon filter or an incorrect setting on the TDS controller. It could also indicate that the membrane needs backwashing."
    },
    {
      cat: 'ro',
      q: "What is the recommended drinking water TDS level?",
      a: "The ideal TDS (Total Dissolved Solids) level for drinking water is between 80 to 150 mg/L. A TDS level below 50 lacks essential minerals, while a level above 300 is not recommended."
    },
    {
      cat: 'ro',
      q: "Why is my RO water purifier wasting too much water?",
      a: "All RO purifiers discharge wastewater to remove concentrated salts. However, if the reject water runs continuously even when the tank is full, it indicates a faulty Solenoid Valve (SV) or Auto-cut switch."
    },
    {
      cat: 'ro',
      q: "What is the difference between RO, UV, and UF filtration?",
      a: "RO removes dissolved chemical salts and heavy metals. UV kills bacteria and viruses using light. UF filters physical suspended particles without using electricity."
    },
    {
      cat: 'ro',
      q: "Do you offer Annual Maintenance Contracts (AMC) for RO systems?",
      a: "Yes. Our RO AMC packages include unlimited breakdown visits, two free scheduled filter replacements, and membrane replacement cover at discount rates."
    },
    {
      cat: 'ro',
      q: "How do I know if my RO membrane is damaged?",
      a: "If the output TDS of the purified water starts matching the input tap water TDS, or if the water flow rate drops to a slow drip, the RO membrane has failed."
    },
    {
      cat: 'ro',
      q: "Why is there no water flowing into the RO storage tank?",
      a: "No flow is typically caused by a choked pre-filter, a burnt booster pump, a failed SMPS adapter, or a tripped low-pressure switch due to low inlet water pressure."
    },
    {
      cat: 'ro',
      q: "Do you service all RO brands (Kent, Aquaguard, Livpure)?",
      a: "Yes. We repair and service all popular domestic RO brands, including Kent, Aquaguard, Livpure, Blue Star, Havells, and local custom-made purifiers."
    },
    {
      cat: 'ro',
      q: "Can you install a copper alkaline filter in my existing RO?",
      a: "Yes. We can upgrade your standard RO purifier by adding a multi-stage copper-alkaline bio-cartridge to enrich your water with essential minerals."
    },

    // === ELECTRICAL SERVICES ===
    {
      cat: 'electrical',
      q: "Why does my home main MCB trip repeatedly?",
      a: "Tripping is caused by overloading (running too many heavy appliances on one circuit), a short circuit (live wire touching neutral), or a faulty MCB switch itself."
    },
    {
      cat: 'electrical',
      q: "What should I do during high-voltage fluctuations?",
      a: "Immediately turn off the main double-pole switch or MCB in your distribution board to protect expensive appliances. Install a whole-house voltage protector if fluctuations are frequent."
    },
    {
      cat: 'electrical',
      q: "Do you perform complete house rewiring?",
      a: "Yes. We provide complete house wiring and rewiring services using top-grade fire-retardant copper wires (Havells, Polycab) with safe PVC conduits."
    },
    {
      cat: 'electrical',
      q: "What is the difference between Neutral and Earth wiring?",
      a: "Neutral completes the electrical circuit loop back to the mains supply. Earth is a safety line that routes leakage current safely into the ground to prevent shock."
    },
    {
      cat: 'electrical',
      q: "Can you install smart home automation switches?",
      a: "Yes. We install and configure smart Wi-Fi switch modules (Touch switches, Sonoff, Wipro, Oakter) that allow you to control lights via smartphone or Alexa."
    },
    {
      cat: 'electrical',
      q: "Why are my LED ceiling panel lights flickering?",
      a: "Flickering is caused by a failing LED driver (choke), loose connections in the junction box, or voltage fluctuations in the supply line."
    },
    {
      cat: 'electrical',
      q: "Is it safe to run a 2.0 Ton AC on a normal 16A power socket?",
      a: "Yes, but only if it's a dedicated heavy-duty power socket wired with a minimum 4.0 sq. mm copper wire and backed by a 25A MCB. Never use extension cords."
    },
    {
      cat: 'electrical',
      q: "Do you install copper plate earthing for houses?",
      a: "Yes. We install professional chemical charcoal-salt earthing systems and copper plate earthing to protect your residential building from current leakage."
    },
    {
      cat: 'electrical',
      q: "Can you install a ceiling fan or decorative chandelier?",
      a: "Yes. We perform assembly and installation of all types of ceiling fans, BLDC energy-saving fans, exhaust fans, wall fans, and designer chandeliers."
    },
    {
      cat: 'electrical',
      q: "Do you repair faulty modular switchboards?",
      a: "Yes. We replace individual modular switches, multi-plugs, regulator fan speed controllers, and indicator lights on modular boards."
    },

    // === APPLIANCE REPAIRS ===
    {
      cat: 'appliances',
      q: "Why is my washing machine not spinning or draining water?",
      a: "Drain failure is caused by a clogged drain pump filter (coins, lint), a broken drain belt, or a faulty lid switch. Spin failure can also indicate a worn-out capacitor or motor."
    },
    {
      cat: 'appliances',
      q: "What causes loud knocking noises during the spin cycle?",
      a: "Loud noises are caused by unbalanced wash loads, worn-out drum suspension springs, faulty drum bearings, or the washing machine not being leveled on the floor."
    },
    {
      cat: 'appliances',
      q: "Why is my double-door refrigerator not cooling?",
      a: "Common causes include a failed defrost timer/heater, a faulty thermostat, dirt clogging the condenser coils, a low refrigerant gas level, or a compressor failure."
    },
    {
      cat: 'appliances',
      q: "How often does a refrigerator need gas charging?",
      a: "Refrigerators operate on a sealed system and do not need regular gas charging. Gas charging is only required if a physical leak develops in the copper/steel tubes."
    },
    {
      cat: 'appliances',
      q: "Why is my geyser leaking water from the bottom?",
      a: "Leaking is caused by corrosion inside the copper/glass-lined tank, a loose heating element gasket, or excessive pressure building up due to a blocked safety valve."
    },
    {
      cat: 'appliances',
      q: "How often should I clean my kitchen chimney filters?",
      a: "Baffle filters should be washed in hot water with baking soda every 2-4 weeks. Carbon filters cannot be washed and must be replaced every 6 months."
    },
    {
      cat: 'appliances',
      q: "Why is my kitchen chimney making a loud vibrating noise?",
      a: "Vibration is caused by grease deposits on the motor blower blades causing unbalance, loose mounting bolts, or a cracked plastic fan impeller."
    },
    {
      cat: 'appliances',
      q: "Why is my microwave oven sparking inside during heating?",
      a: "Sparking is caused by placing metal utensils inside, paint peeling off the interior walls exposing metal, or a damaged/burnt mica waveguide sheet cover."
    },
    {
      cat: 'appliances',
      q: "Why is the microwave turntable glass plate not rotating?",
      a: "This is caused by a broken glass roller ring, a worn coupling gear, or a burnt turntable motor located under the oven base cavity."
    },
    {
      cat: 'appliances',
      q: "Why is my geyser taking a long time to heat water?",
      a: "This is due to heavy calcium and scale deposits coating the heating element. A descaling service restores original heating speeds."
    },
    {
      cat: 'appliances',
      q: "Do you repair both front-load and top-load washing machines?",
      a: "Yes. Our technicians are trained in fixing all semi-automatic, top-load fully automatic, and front-load washing machines (LG, Samsung, IFB, Bosch)."
    },
    {
      cat: 'appliances',
      q: "Why is my refrigerator freezing food in the fresh food section?",
      a: "This is caused by a faulty thermostat failing to cut off the cooling cycle, or a damaged damper control valve blocking air circulation."
    },
    {
      cat: 'appliances',
      q: "Do you repair gas stoves and hob cooktops?",
      a: "Yes. We repair hob burners, replace gas pipes, service ignition switches, and fix flame low-pressure issues on gas stoves."
    },
    {
      cat: 'appliances',
      q: "Why is my television (LED TV) showing pictures but no sound?",
      a: "No sound with picture is caused by faulty audio ICs on the motherboard, blown internal speakers, or incorrect audio settings on your set-top box."
    },
    {
      cat: 'appliances',
      q: "Can you fix a microwave that turns on but does not heat?",
      a: "Yes. This is a common issue caused by a failed high-voltage magnetron, a blown fuse, a faulty capacitor, or a broken door switch."
    }
  ];

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
          {[
            { id: 'all', label: '⚡ All Questions' },
            { id: 'general', label: '🏠 General & Booking' },
            { id: 'ac', label: '❄️ AC & Rentals' },
            { id: 'ro', label: '💧 RO Purifiers' },
            { id: 'electrical', label: '🔌 Electrical Work' },
            { id: 'appliances', label: '🧺 Home Appliances' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
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
                    <div className="px-5 pb-5 pt-2 text-slate-650 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/20 text-left animate-in fade-in slide-in-from-top-1 duration-150">
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

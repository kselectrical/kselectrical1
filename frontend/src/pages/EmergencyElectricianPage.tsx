import React, { useState } from 'react';
import { 
  Zap, PhoneCall, MessageSquare, ShieldAlert, AlertTriangle, 
  Clock, CheckCircle2, ShieldCheck, Flame, Power,
  ArrowRight, Phone, ChevronDown, ChevronUp
} from 'lucide-react';
import { businessConfig } from '../data';
import { saveBookingToCloud } from '../firebase';

interface EmergencyTypeOption {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  icon: React.ReactNode;
  urgency: 'HIGH' | 'CRITICAL';
}

const EMERGENCY_SERVICES: EmergencyTypeOption[] = [
  {
    id: 'power-failure',
    title: 'Complete Power Failure & Blackout',
    hindiTitle: 'पूरे घर का पावर कट / ब्लैकआउट',
    description: 'Total electricity loss in flat or house while neighbors have power. Quick meter & DB phase check.',
    icon: <Power size={26} className="text-amber-500" />,
    urgency: 'CRITICAL'
  },
  {
    id: 'short-circuit',
    title: 'Short Circuit & Burning Wire Smell',
    hindiTitle: 'शॉर्ट सर्किट और जलने की बदबू',
    description: 'Sparks, smoke, or burning plastic odor coming from switchboards, sockets, or main lines.',
    icon: <Flame size={26} className="text-red-500 animate-pulse" />,
    urgency: 'CRITICAL'
  },
  {
    id: 'mcb-tripping',
    title: 'MCB / ELCB Constant Tripping',
    hindiTitle: 'MCB बार-बार ट्रिप होना',
    description: 'Main breaker trips immediately when switched ON due to hidden neutral ground fault or overload.',
    icon: <Zap size={26} className="text-yellow-500" />,
    urgency: 'HIGH'
  },
  {
    id: 'hazard-sparking',
    title: 'Fire Hazard & Sparking Switchboard',
    hindiTitle: 'चिंगारी और स्विचबोर्ड में स्पार्किंग',
    description: 'Heavy sparking behind AC switches, water heater sockets, or main distribution breaker panel.',
    icon: <ShieldAlert size={26} className="text-orange-500" />,
    urgency: 'CRITICAL'
  },
  {
    id: 'night-emergency',
    title: 'Midnight 24x7 Night Emergency Visit',
    hindiTitle: 'रात 10 बजे से 24x7 ऑन-कॉल सर्विस',
    description: 'Urgent electrician dispatch between 10 PM to 6 AM for power restored before morning.',
    icon: <Clock size={26} className="text-blue-500" />,
    urgency: 'HIGH'
  },
  {
    id: 'db-box-failure',
    title: 'Main Meter & DB Box Overload',
    hindiTitle: 'मेन मीटर और डिस्ट्रीब्यूशन बॉक्स ब्रेकडाउन',
    description: 'Melting copper busbars, burnt main neutral lines, or tripped RCCB in high-rise apartments.',
    icon: <AlertTriangle size={26} className="text-red-500" />,
    urgency: 'CRITICAL'
  }
];

const EMERGENCY_LOCATIONS = [
  'Greater Noida West (Noida Extension)',
  'Gaur City 1 & Gaur City 2',
  'Crossing Republik & NH-24',
  'Techzone 4 & Eco Village 1/2/3',
  'Ghaziabad & Indirapuram',
  'Sector 76/78/120 Noida'
];

const EMERGENCY_FAQS = [
  {
    q: 'How fast can an emergency electrician arrive in Greater Noida West?',
    a: 'We guarantee a rapid 15 to 30-minute doorstep dispatch in Gaur City 1, Gaur City 2, Noida Extension, and Greater Noida West for power cuts, short circuits, and sparking emergencies.'
  },
  {
    q: 'Do you provide 24-hour electrician service late at night (after 10 PM)?',
    a: 'Yes! We run a 24x7 emergency response line. If your main MCB trips or wires spark at midnight, call our direct emergency line +91 96257 24903 for instant night technician dispatch.'
  },
  {
    q: 'What should I do immediately during a short circuit before electrician arrives?',
    a: '1. Switch off the main MCB breaker on your distribution board.\n2. Do NOT touch wet walls or burnt sockets with bare hands.\n3. Keep family members away from sparking switchboards.\n4. Call our 24x7 emergency helpline immediately.'
  },
  {
    q: 'Are there hidden late-night emergency surcharge fees?',
    a: 'No. We provide transparent rate cards with clear upfront estimates before starting any work, ensuring fair pricing even during midnight emergency calls.'
  }
];

export const EmergencyElectricianPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedArea, setSelectedArea] = useState(EMERGENCY_LOCATIONS[0]);
  const [address, setAddress] = useState('');
  const [selectedEmergency, setSelectedEmergency] = useState(EMERGENCY_SERVICES[0].id);
  const [problemNote, setProblemNote] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  const handleSubmitEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill your Name, Phone Number, and Address for emergency dispatch.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    const emergencyTypeObj = EMERGENCY_SERVICES.find(s => s.id === selectedEmergency);
    const emergencyTitle = emergencyTypeObj ? emergencyTypeObj.title : 'Emergency Electrical Repair';

    try {
      const saved = await saveBookingToCloud({
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        selectedLocation: selectedArea,
        dateTime: `EMERGENCY 24x7 DISPATCH (${new Date().toLocaleTimeString()})`,
        items: [{
          serviceId: selectedEmergency,
          serviceName: `🚨 EMERGENCY: ${emergencyTitle}`,
          price: 399,
          quantity: 1
        }],
        subtotal: 399,
        problemDescription: `URGENT 24x7 DISPATCH: ${problemNote.trim() || 'Electrical Emergency'}`
      });

      setSuccessBookingId(saved.id);

      // WhatsApp Emergency Alert
      const textMsg = `*🚨 24x7 EMERGENCY ELECTRICIAN DISPATCH REQUEST*
---------------------------------------
*Booking Ref:* ${saved.id}
*Customer Name:* ${name.trim()}
*Mobile:* ${phone.trim()}
*Emergency Type:* ${emergencyTitle}
*Location Area:* ${selectedArea}
*Full Address:* ${address.trim()}
${problemNote.trim() ? `*Details:* ${problemNote.trim()}\n` : ''}---------------------------------------
PLEASE DISPATCH NEAREST TECHNICIAN IMMEDIATELY!`;

      const waUrl = `https://api.whatsapp.com/send?phone=919625724903&text=${encodeURIComponent(textMsg)}`;
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error("Emergency booking failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      
      {/* Dynamic SEO JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EmergencyService",
            "name": "24x7 Emergency Electrician Greater Noida West - KS Electrical",
            "image": "https://kselectrical.in/log.webp",
            "telephone": "+91-9625724903",
            "priceRange": "₹399 - ₹999",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Gaur City 1, Greater Noida West",
              "addressLocality": "Greater Noida West",
              "addressRegion": "UP",
              "postalCode": "201301",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 28.6085,
              "longitude": 77.4262
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "00:00",
              "closes": "23:59"
            },
            "areaServed": EMERGENCY_LOCATIONS
          })
        }}
      />

      {/* Top Pulsing Emergency SOS Banner */}
      <div className="bg-red-600 text-white py-2.5 px-4 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md">
        <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        <span>24x7 Night Emergency Dispatch Active Now in Greater Noida West & Noida Extension</span>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-extrabold text-xs uppercase tracking-wider">
            <Zap size={14} className="text-red-500 animate-pulse" />
            15 - 30 Minute Doorstep Dispatch
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            24 Hour Emergency Electrician in <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400">
              Greater Noida West & Delhi NCR
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Power failure? MCB tripping? Short circuit or burning wire smell at midnight? Don’t panic. Our certified background-verified emergency electricians are on standby 24/7.
          </p>

          {/* 1-TAP EMERGENCY ACTION BUTTONS */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
            <a
              href={`tel:${businessConfig.contacts[1] || '9625724903'}`}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-black text-base uppercase tracking-wider shadow-lg shadow-red-900/50 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneCall size={22} className="animate-bounce" />
              <span>Call Emergency Hotline (+91 96257 24903)</span>
            </a>

            <a
              href={`https://api.whatsapp.com/send?phone=919625724903&text=${encodeURIComponent('*🚨 URGENT: 24x7 Emergency Electrician Required in Greater Noida West*')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageSquare size={18} />
              <span>WhatsApp Emergency</span>
            </a>
          </div>

          {/* Key Guarantee Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left text-xs font-semibold">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-300">
              <Clock size={18} className="text-red-400 shrink-0" />
              <span>15-30 Min Arrival</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-300">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span>Background Verified</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-300">
              <Zap size={18} className="text-amber-400 shrink-0" />
              <span>Insulated Safety Gear</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-300">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
              <span>Fixed Rate Cards</span>
            </div>
          </div>

        </div>
      </section>

      {/* EMERGENCY SERVICES GRID */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Emergency Electrical Repair Services (24x7)
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
              We fix critical electrical failures before they turn into major hazards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EMERGENCY_SERVICES.map((svc) => (
              <div 
                key={svc.id}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-red-500/50 transition-all duration-300 space-y-4 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform">
                    {svc.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    svc.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {svc.urgency} DISPATCH
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {svc.title}
                  </h3>
                  <span className="text-xs text-red-400 font-semibold block mt-0.5">
                    {svc.hindiTitle}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {svc.description}
                </p>

                <a
                  href={`tel:${businessConfig.contacts[1] || '9625724903'}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors pt-2 cursor-pointer"
                >
                  <span>Request Emergency Technician</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* QUICK EMERGENCY DISPATCH FORM */}
      <section id="emergency-form" className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                <Zap size={22} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  1-Minute Emergency Technician Dispatch
                </h2>
                <p className="text-slate-400 text-xs">Fill details for immediate doorstep technician allocation</p>
              </div>
            </div>

            {successBookingId ? (
              <div className="p-8 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-4">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Emergency Request Received #{successBookingId}</h3>
                <p className="text-slate-300 text-xs max-w-md mx-auto">
                  Our emergency dispatch manager is calling your phone now. Nearest technician dispatched to your location.
                </p>
                <button
                  onClick={() => setSuccessBookingId(null)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEmergency} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Your Name (आपका नाम) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kaushik Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Mobile Number (मोबाइल नंबर) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-mono font-bold text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Emergency Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Emergency Issue Type *
                    </label>
                    <select
                      value={selectedEmergency}
                      onChange={(e) => setSelectedEmergency(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      {EMERGENCY_SERVICES.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service Region */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Location Area *
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      {EMERGENCY_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Full Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Complete Doorstep Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tower/Flat No, Society Name, Landmark, Sector"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Problem Description Note */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Describe Emergency Problem (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Main switchboard sparking, burning plastic smell near AC panel..."
                    value={problemNote}
                    onChange={(e) => setProblemNote(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-medium text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black text-base uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Dispatching Technician...</span>
                  ) : (
                    <>
                      <Zap size={20} />
                      <span>🚨 Request Immediate Emergency Technician</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* SEO FAQ SECTION */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Emergency Electrician Search FAQs
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Answers to urgent questions regarding 24x7 electrical breakdown & safety
            </p>
          </div>

          <div className="space-y-3">
            {EMERGENCY_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-slate-100 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-red-400" /> : <ChevronDown size={18} className="text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900 pt-3 whitespace-pre-line">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* BOTTOM FLOATING SOS CALL BAR */}
      <div className="sticky bottom-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3.5 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2.5 text-xs">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="font-extrabold text-white">Need an Electrician Right Now?</span>
            <span className="text-slate-400">15-30 min doorstep arrival in Greater Noida West</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${businessConfig.contacts[1] || '9625724903'}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              <Phone size={14} fill="currentColor" />
              <span>Call 9625724903</span>
            </a>
            <a
              href="#emergency-form"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>Quick Form</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmergencyElectricianPage;

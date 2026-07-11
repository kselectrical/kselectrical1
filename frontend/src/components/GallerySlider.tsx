import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAssetPath } from '../firebase';

interface Slide {
  image: string;
  badge: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: '/images/slider/slide_ac_service.jpg',
    badge: '❄️ AC Service',
    title: 'High-Pressure Jet Wash AC Cleaning',
    description: 'Deep cleaning of cooling coils, drain pipes & outdoor units'
  },
  {
    image: '/images/slider/gallery_ac_1.jpg',
    badge: '❄️ AC Repair',
    title: 'Outdoor AC Unit Servicing',
    description: 'Compressor & coil cleaning for improved cooling performance'
  },
  {
    image: '/images/slider/slide_electrician.jpg',
    badge: '⚡ Electrician',
    title: 'Professional Electrical Wiring & Panel Work',
    description: 'MCB upgrades, short circuit fixes & new modular fittings'
  },
  {
    image: '/images/slider/gallery_wiring_1.jpg',
    badge: '⚡ Wiring',
    title: 'Complete Home Wiring Installation',
    description: 'PVC conduit wiring with proper earthing & circuit protection'
  },
  {
    image: '/images/slider/gallery_washing_1.jpg',
    badge: '🌀 Washing Machine',
    title: 'Washing Machine Motor & Drum Repair',
    description: 'PCB diagnostics, drum bearing replacement & drain blockage fixes'
  },
  {
    image: '/images/slider/gallery_ro_1.jpg',
    badge: '💧 RO Service',
    title: 'RO Water Purifier Complete Service',
    description: 'Filter replacement, membrane cleaning & TDS calibration'
  },
  {
    image: '/images/slider/gallery_fridge_1.jpg',
    badge: '🧊 Refrigerator',
    title: 'Refrigerator Gas Charging & Repair',
    description: 'Compressor relay, thermostat & R134a gas recharging service'
  },
  {
    image: '/images/slider/gallery_geyser_1.jpg',
    badge: '🔥 Geyser',
    title: 'Geyser Heating Element & Thermostat Service',
    description: 'Safe earthing check, leakage repair & heating element replacement'
  },
  {
    image: '/images/slider/gallery_wiring_2.jpg',
    badge: '⚡ Electrical',
    title: 'Switchboard & Junction Box Work',
    description: 'Modular switch fitting, MCB installation & safety upgrades'
  }
];

export const GallerySlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    if (isSwipeLeft) {
      handleNext();
    } else if (isSwipeRight) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md select-none mb-3">
          📸 Our Real Work
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          See Our Expert Technicians in Action
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
          Real on-site service photos from our certified team across Gaur City & Noida Extension
        </p>
      </div>

      <div 
        className="max-w-5xl mx-auto relative group overflow-hidden rounded-2xl shadow-xl aspect-[16/9] md:aspect-[21/9] bg-slate-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container */}
        <div className="w-full h-full relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={getAssetPath(slide.image)}
                alt={slide.title}
                loading="lazy"
                className="w-full h-full object-cover brightness-[0.7]"
              />
              
              {/* Bottom Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-8 text-left z-20 flex flex-col justify-end">
                <span className="bg-brand-orange text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded w-max mb-2 sm:mb-3 shadow-sm select-none">
                  {slide.badge}
                </span>
                <h3 className="text-white text-base sm:text-2xl font-black tracking-tight leading-snug">
                  {slide.title}
                </h3>
                <p className="text-slate-200 text-[11px] sm:text-sm font-semibold mt-1">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow Controls (Hidden on mobile, shows on hover/desktop) */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-xs transition z-30 opacity-0 group-hover:opacity-100 hidden md:block"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-xs transition z-30 opacity-0 group-hover:opacity-100 hidden md:block"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators/Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 bg-brand-orange' 
                  : 'w-2 bg-white/55 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

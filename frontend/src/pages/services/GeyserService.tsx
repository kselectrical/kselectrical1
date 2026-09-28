import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface GeyserServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const GeyserService: React.FC<GeyserServiceProps> = (props) => {
  const benefits = [
    "Safety Standards: Multi-point thermostat and auto-cutout calibration to prevent dry heating and electrical leakage shocks.",
    "Scale-Free Element: Professional food-grade chemical descaling to restore water heating speed and reduce power bills.",
    "Leak-Proof Seals: High-temperature CPVC thread sealing and pressure release valve checks to prevent water dripping."
  ];

  const processSteps = [
    "Thermostat Scan: Testing temperature sensor continuity and auto-cutoff tripping threshold.",
    "Tank Flushing: Draining water completely to flush out calcium flakes, rust, and heavy sediment.",
    "Element Cleaning: Scraping hard-water scale from the copper heating element and checking the sacrificial anode rod.",
    "Leakage Current Test: Verifying insulation resistance with a digital multimeter to ensure zero shock risk."
  ];

  const faqs = [
    {
      q: "Why is my geyser water not heating at all?",
      a: "This is usually due to a burnt heating element, a tripped thermostat safety cutout, or faulty power wiring. Our technicians can diagnose and replace the faulty part."
    },
    {
      q: "Why is water leaking from the bottom of my geyser?",
      a: "Water leakage is typically caused by rusted connector pipes, high tank pressure activating the release valve, or a cracked internal glass-lined tank."
    },
    {
      q: "How often should I get my geyser serviced?",
      a: "If you live in an area with hard water, we recommend descaling and anode rod inspection once every 12 months to prevent element failure and tank corrosion."
    }
  ];

  /** Point 1: Geyser-specific clickable symptoms */
  const symptoms = [
    {
      title: "Geyser Not Heating Water",
      cause: "If the indicator light is ON but water stays cold, the heating element has likely burnt out due to hard-water scale buildup. If the indicator stays OFF, check the thermostat safety cutout (it may have tripped) or the power supply at the MCB panel."
    },
    {
      title: "Water Leaking from Geyser Bottom",
      cause: "Bottom leakage usually means the pressure relief valve (PRV) is releasing excess pressure — often due to high incoming water pressure above 6 bar. It can also indicate a rusted or cracked internal tank lining that needs immediate replacement."
    },
    {
      title: "Geyser Taking Too Long to Heat",
      cause: "Slow heating is caused by thick calcium/limescale deposits on the heating element — acting as insulation and blocking heat transfer. A descaling service typically restores heating speed by 40–60%."
    },
    {
      title: "Geyser Making Popping / Sizzling Sounds",
      cause: "Popping sounds during heating are caused by steam bubbles escaping from under hard mineral deposits crusted on the heating element. This indicates an urgent need for descaling before the element burns out completely."
    },
    {
      title: "Mild Electric Shock or Tingling from Water",
      cause: "This is an electrical emergency. It means the heating element's insulation has failed, allowing live current to enter the water. Turn off the geyser MCB immediately and call us — do not use the tap until it is fixed."
    }
  ];

  /** Point 4: Related services — user can jump to installation or uninstallation in 1 click */
  const relatedServices = [
    { label: 'Geyser Installation', path: '/services/geyser-service', icon: '🔧', price: '₹349' },
    { label: 'Geyser Uninstallation', path: '/services/geyser-service', icon: '🔩', price: '₹199' },
    { label: 'Electrician Service', path: '/services/electrician-service', icon: '⚡', price: '₹49' },
    { label: 'RO Water Purifier Service', path: '/services/ro-service', icon: '💧', price: '₹299' }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="geyser-service"
      serviceName="Geyser Service & Repair"
      overviewText="Solve geyser heating issues, thermostat tripping, tank water leakage, indicator light failures, and power short circuits with our certified repair experts."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      symptoms={symptoms}
      relatedServices={relatedServices}
      catalogCategory="Appliance Repair"
      catalogSubcategory="Geyser"
    />
  );
};
export default GeyserService;


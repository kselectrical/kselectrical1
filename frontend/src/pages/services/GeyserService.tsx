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

  return (
    <BaseServicePage
      {...props}
      serviceSlug="geyser-service"
      serviceName="Geyser Service & Repair"
      overviewText="Solve geyser heating issues, thermostat tripping, tank water leakage, indicator light failures, and power short circuits with our certified repair experts."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Appliance Repair"
      catalogSubcategory="Geyser"
    />
  );
};
export default GeyserService;

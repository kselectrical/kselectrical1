import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface LightServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const LightService: React.FC<LightServiceProps> = (props) => {
  const benefits = [
    "Aesthetic Leveling: Using professional spirit bubble levels to ensure sconces, tube lights, and LED panels are perfectly straight.",
    "Secure Mounting: Drilling heavy-duty anchor fasteners to support chandeliers and heavy ceiling lights safely.",
    "LED Driver Matching: Installing precise constant-current LED drivers to eliminate light flickering and extend bulb life."
  ];

  const processSteps = [
    "Circuit Scan: Verifying switch box voltage and earthing continuity before installation.",
    "POP & False Ceiling Cut: Precision hole cutting for recessed LED panels without damaging the POP framing.",
    "Mount Installation: Securing mounting bracket and wiring connections with insulated wire nuts.",
    "Lux Level Test: Verifying illumination, zero flicker, and correct color temperature (warm, cool, or natural white)."
  ];

  const faqs = [
    {
      q: "Why is my LED ceiling light flickering?",
      a: "LED flickering is caused by a failing LED driver (choke), voltage fluctuations, or loose wire connections in the false ceiling."
    },
    {
      q: "How do you install a heavy chandelier safely?",
      a: "For heavy chandeliers, we drill a heavy-duty expansion anchor bolt directly into the concrete ceiling slab rather than relying on false ceiling POP grids, ensuring it can support up to 25-30 kg."
    },
    {
      q: "What is the difference between warm white and cool white?",
      a: "Warm white (3000K) has a cozy, yellow glow ideal for bedrooms and living areas. Cool white (6000K) is a bright, daylight white perfect for kitchens, bathrooms, and workspaces."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="light-service"
      serviceName="Lighting & Chandelier Service"
      overviewText="Mount LED tube lights, install ceiling rose bulb holders, fit false ceiling panels, and hang heavy decorative chandeliers securely with our lighting specialists."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Light Services"
    />
  );
};
export default LightService;

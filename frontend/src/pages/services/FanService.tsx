import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface FanServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const FanService: React.FC<FanServiceProps> = (props) => {
  const benefits = [
    "Balance Calibrated: Digital weight-balancing of fan blades to eliminate high-speed wobbling and ceiling vibrations.",
    "Heavy-Duty Spares: Replaced with 2.5 mfd heavy-duty capacitors and double-ball bearings for noiseless high-speed operation.",
    "Smart Receiver Pairing: Certified pairing for BLDC remote modules, receiver chips, and wall regulator bypass setups."
  ];

  const processSteps = [
    "Wobble Inspection: Checking the downrod, canopy, and blade angle alignment.",
    "Electrical Test: Measuring capacitor microfarads and motor winding resistance.",
    "Lubrication & Bearing Check: Cleaning dust and applying anti-friction grease to dual ball bearings.",
    "High-Speed Run: Checking RPM and noise levels (less than 45 dB) for a completely silent, powerful breeze."
  ];

  const faqs = [
    {
      q: "Why has my ceiling fan speed become very slow?",
      a: "A slow fan speed is almost always caused by a weak capacitor that cannot provide enough torque, or jammed motor bearings due to dust."
    },
    {
      q: "What is a BLDC fan and is it better?",
      a: "BLDC (Brushless DC) fans use advanced motors that consume up to 60-65% less electricity compared to standard induction fans. They run cooler and are controlled via remote."
    },
    {
      q: "Can you convert my normal fan wiring to BLDC?",
      a: "Yes, we install the BLDC fan, wire up the remote receiver module, bypass your traditional wall regulator, and configure the remote controller."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="fan-service"
      serviceName="Ceiling & BLDC Fan Service"
      overviewText="Hire certified professionals for ceiling fan installation, smart BLDC remote setup, capacitor changes, bearing lubrication, and wobble noise fixes."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Fan Services"
    />
  );
};
export default FanService;

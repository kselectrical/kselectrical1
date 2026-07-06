import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface MicrowaveServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const MicrowaveService: React.FC<MicrowaveServiceProps> = (props) => {
  const benefits = [
    "OEM Spares: Magnetrons, synchronous turntable motors, mica sheets, and high-voltage fuses replaced with genuine brand spares.",
    "Radiation Safety Scan: Performing professional diagnostic checkups to verify zero microwave radiation leakage after repair.",
    "Power Isolation Test: Reviewing high-voltage diodes and control board relays to prevent household MCB tripping."
  ];

  const processSteps = [
    "Electrical Diagnostics: Inspecting the door interlock switch, thermal cutouts, and power line noise filters.",
    "HV Component Check: Testing the magnetron filament resistance, high-voltage capacitor, and transformer windings.",
    "Chamber & Waveguide Review: Checking the mica sheet for carbonization spots and inspecting chamber walls for paint peeling.",
    "Full Load Test: Running a water heating audit to verify power efficiency and ensure quiet, safe operation."
  ];

  const faqs = [
    {
      q: "Why is my microwave light on and turntable spinning, but the food is not heating?",
      a: "This is a common issue typically caused by a burnt-out magnetron, a blown high-voltage fuse, or a failed high-voltage diode."
    },
    {
      q: "Why are there sparks inside my microwave during operation?",
      a: "Sparks inside the chamber are usually caused by a dirty or carbonized waveguide cover (mica sheet) or metal residue/utensils inside the microwave. We recommend replacing the mica sheet immediately to avoid magnetron damage."
    },
    {
      q: "Do you repair both solo and convection microwaves?",
      a: "Yes, our certified technicians repair all types of microwave ovens, including Solo, Grill, and Convection models from all major brands."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="microwave-service"
      serviceName="Microwave Service & Repair"
      overviewText="Fix microwave heating failure, interior sparking, turntable motor jamming, touch control pad issues, and get safe radiation diagnostics from experts."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Appliance Repair"
      catalogSubcategory="Other Appliances"
      serviceIdPrefix="app-microwave"
    />
  );
};

export default MicrowaveService;

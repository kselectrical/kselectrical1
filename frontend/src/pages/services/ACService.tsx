import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface ACServiceProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
  customServiceType?: string;
}

export const ACService: React.FC<ACServiceProps> = (props) => {
  const benefits = [
    "Certified Cooling Engineers: Highly experienced technicians trained in advanced split and window AC modules.",
    "Eco High-Pressure Jet Clean: 120-Bar pressure wash removes deep-set mold and improves cooling efficiency.",
    "Genuine OEM Spare Parts: Capacitor, relays, and copper pipe replacements include manufacturer guarantee."
  ];

  const processSteps = [
    "Diagnostics & Inspection: We check compressor pressure, electrical grid currents, and airflow temperatures.",
    "High-Pressure Jet Wash: Eco-friendly chemical sprays and water jet cleaning for indoor coils and outdoor fins.",
    "Refrigerant Charging & Weld: Nitrogen testing for leaks, copper line soldering, and gas top-up.",
    "Final Inspection: Test performance analysis registers your official 30-Day Service Warranty check."
  ];

  const faqs = [
    {
      q: "How often should I service my Split AC?",
      a: "To maintain premium cooling speeds and low power bills, a professional AC wet jet service is recommended every 6 months."
    },
    {
      q: "Is gas leak checking included in the service rate?",
      a: "Jet service covers cleaning. If gas level is low, leak testing, copper pipe welding, and gas charging are billed additionally."
    },
    {
      q: "Do you provide brackets for outdoor AC installation?",
      a: "Yes, heavy-duty galvanized steel brackets can be provided by the technicians and are billed separately."
    }
  ];

  const isRepair = props.customServiceType === 'ac-repair';
  const isInst = props.customServiceType === 'ac-installation';

  const finalSlug = props.customServiceType || "ac-service";
  const finalName = isRepair ? "AC Repair" : isInst ? "AC Installation" : "AC Service";
  const finalOverview = isRepair 
    ? "Get fast and reliable split & window AC repair, compressor diagnostic checking, fan motor replacements, and gas leak fixes at transparent rates." 
    : isInst 
      ? "Professional split and window air conditioner installation, bracket mounting, piping insulation, and safe uninstallation services by certified experts." 
      : "Get premium Split & Window AC water jet washing, capillary diagnostics, compressor relays replacements, leak welds, and expert wall installations at clear upfront rates.";

  return (
    <BaseServicePage
      {...props}
      serviceSlug={finalSlug}
      serviceName={finalName}
      overviewText={finalOverview}
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="AC Services"
    />
  );
};
export default ACService;


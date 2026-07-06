import React from 'react';
import { BaseServicePage } from './BaseServicePage';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';

interface HomeInstallationsProps {
  cityName?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

export const HomeInstallations: React.FC<HomeInstallationsProps> = (props) => {
  const benefits = [
    "HDPE Durability: Installing heavy-duty, UV-resistant HDPE nylon netting with stainless steel fasteners for long-lasting balcony protection.",
    "Pressure Tested Plumbing: Teflon tape and anaerobic sealants are used on all faucet, drain, and toilet fittings to ensure zero leaks.",
    "Soft-Close Cabinetry: Fitting premium stainless steel hydraulic soft-close hinges to realign kitchen cabinets and drawers."
  ];

  const processSteps = [
    "Consultation & Layout: Measuring balcony grids or inspecting plumbing/carpentry points to determine exact material requirements.",
    "Fastener Anchoring: Drilling wall anchors or fitting CPVC/UPVC pipes with heavy-duty sealants.",
    "Precision Alignment: Adjusting lock strikers, hinge screws, or net tension to ensure flawless operation.",
    "Leak & Stress Test: Running water pressure tests on plumbing or load stress tests on safety nets to verify strength."
  ];

  const faqs = [
    {
      q: "Do you provide warranty on balcony pigeon netting?",
      a: "Yes, our premium HDPE UV-resistant safety nets come with an official 3-year warranty against tearing, sagging, and weathering."
    },
    {
      q: "What plumbing repairs do you handle?",
      a: "We handle faucet leak repairs, sink pipe blockages, washbasin installations, flush valve replacements, and minor cpvc/upvc pipe rerouting."
    },
    {
      q: "Can you fix misaligned modular kitchen cabinet doors?",
      a: "Yes, we realign modular kitchen doors by adjusting cabinet hinges or replacing worn hinges with premium soft-close hydraulic hinges."
    }
  ];

  return (
    <BaseServicePage
      {...props}
      serviceSlug="home-installations"
      serviceName="Home Installations & Consultation"
      overviewText="Book professional technicians for balcony pigeon netting, modular kitchen hinge adjustments, doorstep plumbing leak fixes, locks replacement, and false ceiling works."
      benefits={benefits}
      processSteps={processSteps}
      faqs={faqs}
      catalogCategory="Home Installations"
    />
  );
};
export default HomeInstallations;

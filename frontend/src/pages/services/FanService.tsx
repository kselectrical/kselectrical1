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

  /** Point 1: Clickable symptoms accordion — these are the exact problems
   *  users were tapping on in session recordings, now they get a response. */
  const symptoms = [
    {
      title: "Continuous Buzzing / Humming Sound",
      cause: "A continuous buzzing or humming noise is almost always caused by a weak or swollen capacitor that is struggling to maintain motor torque. In older fans, worn-out copper coil windings or loose motor mounting screws can also create resonant vibrations at high speed."
    },
    {
      title: "Loud Grinding or Rattling Noise",
      cause: "A grinding or metal-on-metal rattling sound indicates that the dual ball bearings inside the motor have dried out or corroded due to dust accumulation. Without lubrication, the steel balls grind against the race ring causing permanent damage if not serviced immediately."
    },
    {
      title: "Fan Running Very Slow (All Speeds)",
      cause: "Slow fan operation at every speed setting is the #1 sign of a failing capacitor. The capacitor provides the initial phase-shift current needed to spin the motor — when its microfarad (mfd) rating drops, the fan loses torque and runs sluggishly even at Speed 5."
    },
    {
      title: "Fan Not Starting / Dead Fan",
      cause: "A completely dead ceiling fan (no movement, no sound) could be caused by a blown thermal fuse inside the motor, a completely failed capacitor, a burnt motor winding, or a wiring fault at the switch or regulator. Our technician will test each component with a digital multimeter on-site."
    },
    {
      title: "Fan Wobbling or Vibrating at High Speed",
      cause: "Wobble is typically caused by unbalanced fan blades (due to warping or dust accumulation on one blade), a loose canopy bracket, or a bent/damaged downrod. Severe wobble can stress the ceiling mounting box — get it checked promptly."
    },
    {
      title: "BLDC Fan Remote / Receiver Not Responding",
      cause: "BLDC fan remote issues are usually caused by a dead receiver chip, mismatched remote frequency after a power surge, or a drained remote battery. Our technicians carry replacement Atom/Orient/Havells BLDC receiver modules and can re-pair your remote on-site."
    },
    {
      title: "Ceiling Fan Giving Electric Shock",
      cause: "Any perceived tingling or mild shock from a fan body is an electrical emergency. It indicates insulation breakdown in the motor windings or a bare live wire making contact with the fan body. Switch off the fan at the MCB immediately and call us — do not touch the fan."
    }
  ];

  /** Point 4: Related services for cross-linking — shown below the FAQ section */
  const relatedServices = [
    { label: 'Ceiling Fan Installation', path: '/services/fan-service', icon: '🔧', price: '₹249' },
    { label: 'Electrician & Wiring Service', path: '/services/electrician-service', icon: '⚡', price: '₹49' },
    { label: 'Light Fitting & LED Repair', path: '/services/light-service', icon: '💡', price: '₹99' },
    { label: 'Home Installations & Nets', path: '/services/home-installations', icon: '🏠', price: '₹199' }
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
      symptoms={symptoms}
      relatedServices={relatedServices}
      catalogCategory="Fan Services"
    />
  );
};
export default FanService;


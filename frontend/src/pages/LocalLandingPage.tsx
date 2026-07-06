import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ACService } from './services/ACService';
import { ROService } from './services/ROService';
import { ElectricianService } from './services/ElectricianService';
import { WashingMachineRepair } from './services/WashingMachineRepair';
import { RefrigeratorRepair } from './services/RefrigeratorRepair';
import { ChimneyService } from './services/ChimneyService';
import { GeyserService } from './services/GeyserService';
import { FanService } from './services/FanService';
import { LightService } from './services/LightService';
import { HomeInstallations } from './services/HomeInstallations';
import { MicrowaveService } from './services/MicrowaveService';
import type { TechnicalService, CartItem } from '../types';
import type { BusinessConfig } from '../data';

interface LocalLandingPageProps {
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

const SERVICE_PREFIXES = [
  'ac-service',
  'ac-repair',
  'ac-installation',
  'ro-service',
  'electrician-service',
  'electrician',
  'washing-machine-repair',
  'refrigerator-repair',
  'chimney-service',
  'geyser-service',
  'fan-service',
  'light-service',
  'home-installations',
  'microwave-service'
];

const normalizeLocationName = (slug: string): string => {
  if (slug === 'gaur-city-1') return 'Gaur City 1';
  if (slug === 'gaur-city-2') return 'Gaur City 2';
  if (slug === 'noida-extension') return 'Noida Extension';
  if (slug === 'greater-noida-west') return 'Greater Noida West';
  
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export const LocalLandingPage: React.FC<LocalLandingPageProps> = (props) => {
  const { serviceSlug, locationSlug } = useParams<{ serviceSlug: string; locationSlug: string }>();

  if (!serviceSlug || !locationSlug) {
    return <Navigate to="/404" replace />;
  }

  const cleanService = serviceSlug.toLowerCase();
  if (!SERVICE_PREFIXES.includes(cleanService)) {
    return <Navigate to="/404" replace />;
  }

  const cityName = normalizeLocationName(locationSlug);

  // Render correct service component dynamically with city scope
  switch (cleanService) {
    case 'ac-service':
      return <ACService {...props} cityName={cityName} />;
    case 'ac-repair':
      return <ACService {...props} cityName={cityName} customServiceType="ac-repair" />;
    case 'ac-installation':
      return <ACService {...props} cityName={cityName} customServiceType="ac-installation" />;
    case 'ro-service':
      return <ROService {...props} cityName={cityName} />;
    case 'electrician-service':
    case 'electrician':
      return <ElectricianService {...props} cityName={cityName} />;
    case 'washing-machine-repair':
      return <WashingMachineRepair {...props} cityName={cityName} />;
    case 'refrigerator-repair':
      return <RefrigeratorRepair {...props} cityName={cityName} />;
    case 'chimney-service':
      return <ChimneyService {...props} cityName={cityName} />;
    case 'geyser-service':
      return <GeyserService {...props} cityName={cityName} />;
    case 'fan-service':
      return <FanService {...props} cityName={cityName} />;
    case 'light-service':
      return <LightService {...props} cityName={cityName} />;
    case 'home-installations':
      return <HomeInstallations {...props} cityName={cityName} />;
    case 'microwave-service':
      return <MicrowaveService {...props} cityName={cityName} />;
    default:
      return <Navigate to="/404" replace />;
  }
};
export default LocalLandingPage;

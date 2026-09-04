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
import { getServiceBySlug } from '../serviceCatalog';

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
  const catalogEntry = getServiceBySlug(cleanService);

  if (!SERVICE_PREFIXES.includes(cleanService) && !catalogEntry) {
    return <Navigate to="/404" replace />;
  }

  const cityName = normalizeLocationName(locationSlug);

  // Render correct service component dynamically with city scope
  if (cleanService === 'ac-service') return <ACService {...props} cityName={cityName} />;
  if (cleanService === 'ac-repair') return <ACService {...props} cityName={cityName} customServiceType="ac-repair" />;
  if (cleanService === 'ac-installation') return <ACService {...props} cityName={cityName} customServiceType="ac-installation" />;
  if (cleanService === 'ro-service') return <ROService {...props} cityName={cityName} />;
  if (cleanService === 'electrician-service' || cleanService === 'electrician') return <ElectricianService {...props} cityName={cityName} />;
  if (cleanService === 'washing-machine-repair') return <WashingMachineRepair {...props} cityName={cityName} />;
  if (cleanService === 'refrigerator-repair') return <RefrigeratorRepair {...props} cityName={cityName} />;
  if (cleanService === 'chimney-service') return <ChimneyService {...props} cityName={cityName} />;
  if (cleanService === 'geyser-service') return <GeyserService {...props} cityName={cityName} />;
  if (cleanService === 'fan-service') return <FanService {...props} cityName={cityName} />;
  if (cleanService === 'light-service') return <LightService {...props} cityName={cityName} />;
  if (cleanService === 'home-installations') return <HomeInstallations {...props} cityName={cityName} />;
  if (cleanService === 'microwave-service') return <MicrowaveService {...props} cityName={cityName} />;

  // If cleanService is a catalog entry slug, map it to its respective category page with cityName
  if (catalogEntry) {
    const cat = catalogEntry.category.toLowerCase();
    const slug = catalogEntry.slug.toLowerCase();

    if (cat.includes('ac')) {
      return <ACService {...props} cityName={cityName} />;
    }
    if (cat.includes('fan')) {
      return <FanService {...props} cityName={cityName} />;
    }
    if (cat.includes('light')) {
      return <LightService {...props} cityName={cityName} />;
    }
    if (cat.includes('electrician')) {
      return <ElectricianService {...props} cityName={cityName} />;
    }
    if (cat.includes('home installations')) {
      return <HomeInstallations {...props} cityName={cityName} />;
    }
    if (cat.includes('appliance repair') || cat.includes('appliance')) {
      if (slug.includes('ro')) return <ROService {...props} cityName={cityName} />;
      if (slug.includes('washing')) return <WashingMachineRepair {...props} cityName={cityName} />;
      if (slug.includes('geyser')) return <GeyserService {...props} cityName={cityName} />;
      if (slug.includes('refrigerator') || slug.includes('fridge')) return <RefrigeratorRepair {...props} cityName={cityName} />;
      if (slug.includes('microwave')) return <MicrowaveService {...props} cityName={cityName} />;
      if (slug.includes('chimney')) return <ChimneyService {...props} cityName={cityName} />;
      return <WashingMachineRepair {...props} cityName={cityName} />;
    }
    return <ACService {...props} cityName={cityName} />;
  }

  return <Navigate to="/404" replace />;
};

export default LocalLandingPage;

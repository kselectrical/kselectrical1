import type { ServiceCatalogEntry } from './types';

export const serviceCatalog: ServiceCatalogEntry[] = [
  {
    id: 'ac-repair',
    title: 'AC Repair & Diagnostics',
    slug: 'ac-repair',
    category: 'AC Services',
    keywords: ['ac repair', 'ac diagnostics', 'air conditioner repair', 'split ac repair'],
    aliases: ['ac service', 'air conditioner fix', 'ac not cooling']
  },
  {
    id: 'ac-installation',
    title: 'AC Installation (Split)',
    slug: 'ac-installation',
    category: 'AC Services',
    keywords: ['ac installation', 'split ac installation', 'ac install', 'ac mounting'],
    aliases: ['install ac', 'ac setup', 'ac fitting']
  },
  {
    id: 'ac-uninstallation',
    title: 'AC Uninstallation',
    slug: 'ac-uninstallation',
    category: 'AC Services',
    keywords: ['ac uninstallation', 'ac removal', 'ac dismount', 'remove split ac'],
    aliases: ['uninstall ac', 'ac take down']
  },
  {
    id: 'ac-wet-clean',
    title: 'AC Jet Wash & Service',
    slug: 'ac-jet-wash',
    category: 'AC Services',
    keywords: ['ac jet wash', 'ac cleaning', 'split ac cleaning', 'window ac cleaning'],
    aliases: ['ac deep clean', 'ac wash', 'air conditioner clean']
  },
  {
    id: 'ac-gas-refill',
    title: 'AC Gas Refill (R32/R22)',
    slug: 'ac-gas-refill',
    category: 'AC Services',
    keywords: ['ac gas refill', 'ac gas recharge', 'r32 gas refill', 'r22 gas refill'],
    aliases: ['ac gas topup', 'ac gas charging']
  },
  {
    id: 'fan-basic-install',
    title: 'Basic Fan Installation',
    slug: 'fan-installation',
    category: 'Fan Services',
    keywords: ['fan installation', 'ceiling fan installation', 'exhaust fan installation'],
    aliases: ['install fan', 'fan fitting', 'ceiling fan setup']
  },
  {
    id: 'fan-basic-uninstall',
    title: 'Basic Fan Uninstallation',
    slug: 'fan-uninstallation',
    category: 'Fan Services',
    keywords: ['fan uninstallation', 'fan removal', 'remove ceiling fan'],
    aliases: ['uninstall fan', 'fan dismount']
  },
  {
    id: 'fan-basic-repair',
    title: 'Basic Fan Repair',
    slug: 'fan-repair',
    category: 'Fan Services',
    keywords: ['fan repair', 'ceiling fan repair', 'exhaust fan repair'],
    aliases: ['fix fan', 'fan motor repair']
  },
  {
    id: 'fan-bldc-install',
    title: 'BLDC Fan Installation',
    slug: 'bldc-fan-installation',
    category: 'Fan Services',
    keywords: ['bldc fan installation', 'energy saving fan install', 'smart fan installation'],
    aliases: ['install bldc fan', 'bldc fan setup']
  },
  {
    id: 'fan-bldc-uninstall',
    title: 'BLDC Fan Uninstallation',
    slug: 'bldc-fan-uninstallation',
    category: 'Fan Services',
    keywords: ['bldc fan uninstallation', 'remove bldc fan'],
    aliases: ['uninstall bldc fan', 'bldc fan removal']
  },
  {
    id: 'fan-bldc-service',
    title: 'BLDC Fan Service Charge',
    slug: 'bldc-fan-service',
    category: 'Fan Services',
    keywords: ['bldc fan service', 'bldc fan maintenance', 'bldc fan check'],
    aliases: ['bldc fan repair', 'bldc fan cleaning']
  },
  {
    id: 'fan-fancy-install',
    title: 'Decorative Fan Installation',
    slug: 'decorative-fan-installation',
    category: 'Fan Services',
    keywords: ['decorative fan installation', 'designer fan installation', 'fancy fan install'],
    aliases: ['install designer fan', 'decorative fan setup']
  },
  {
    id: 'fan-fancy-uninstall',
    title: 'Decorative Fan Uninstallation',
    slug: 'decorative-fan-uninstallation',
    category: 'Fan Services',
    keywords: ['decorative fan uninstallation', 'designer fan removal'],
    aliases: ['remove decorative fan', 'uninstall fancy fan']
  },
  {
    id: 'fan-fancy-repair',
    title: 'Decorative Fan Repair',
    slug: 'decorative-fan-repair',
    category: 'Fan Services',
    keywords: ['decorative fan repair', 'designer fan repair', 'fancy fan repair'],
    aliases: ['fix decorative fan', 'repair fancy fan']
  },
  {
    id: 'light-bulb-install',
    title: 'Bulb Holder Installation',
    slug: 'bulb-holder-installation',
    category: 'Light Services',
    keywords: ['bulb holder installation', 'ceiling rose installation', 'batten holder install'],
    aliases: ['install bulb holder', 'holder installation']
  },
  {
    id: 'light-bulb-repair',
    title: 'Bulb Holder Repair',
    slug: 'bulb-holder-repair',
    category: 'Light Services',
    keywords: ['bulb holder repair', 'ceiling rose repair', 'batten holder repair'],
    aliases: ['fix bulb holder', 'repair bulb holder']
  },
  {
    id: 'light-tube-install',
    title: 'Tube Light / Batten Installation',
    slug: 'tube-light-installation',
    category: 'Light Services',
    keywords: ['tube light installation', 'batten installation', 'led tube install'],
    aliases: ['install tube light', 'led tube installation']
  },
  {
    id: 'light-tube-repair',
    title: 'Tube Light Repair',
    slug: 'tube-light-repair',
    category: 'Light Services',
    keywords: ['tube light repair', 'batten repair', 'led tube repair'],
    aliases: ['fix tube light', 'repair batten light']
  },
  {
    id: 'light-tube-uninstall',
    title: 'Tube Light Uninstallation',
    slug: 'tube-light-uninstallation',
    category: 'Light Services',
    keywords: ['tube light uninstallation', 'remove batten light'],
    aliases: ['uninstall tube light', 'remove led tube']
  },
  {
    id: 'light-fancy-install',
    title: 'Fancy / Wall Light Installation',
    slug: 'decorative-wall-light-installation',
    category: 'Light Services',
    keywords: ['wall light installation', 'decorative light installation', 'sconce installation'],
    aliases: ['install wall light', 'decorative light fitting']
  },
  {
    id: 'light-fancy-repair',
    title: 'Fancy Light Repair',
    slug: 'decorative-light-repair',
    category: 'Light Services',
    keywords: ['fancy light repair', 'wall light repair', 'sconce repair'],
    aliases: ['fix decorative light', 'repair wall light']
  },
  {
    id: 'light-ceiling-install',
    title: 'Ceiling / Panel Light Installation',
    slug: 'ceiling-panel-light-installation',
    category: 'Light Services',
    keywords: ['ceiling light installation', 'panel light installation', 'led panel install'],
    aliases: ['install ceiling light', 'panel light fitting']
  },
  {
    id: 'light-chandelier-install',
    title: 'Chandelier / Hanging Light Installation',
    slug: 'chandelier-installation',
    category: 'Light Services',
    keywords: ['chandelier installation', 'hanging light installation', 'light fixture installation'],
    aliases: ['install chandelier', 'hanging light setup']
  },
  {
    id: 'light-ceiling-repair',
    title: 'Ceiling Light Repair',
    slug: 'ceiling-light-repair',
    category: 'Light Services',
    keywords: ['ceiling light repair', 'panel light repair', 'hanging light repair'],
    aliases: ['fix ceiling light', 'repair panel light']
  },
  {
    id: 'elec-switch-repair',
    title: 'Switch / Socket Repair & Replacement',
    slug: 'switch-socket-repair',
    category: 'Electrician Services',
    keywords: ['switch repair', 'socket repair', 'switch replacement', 'socket replacement'],
    aliases: ['fix switch', 'fix socket', 'switch board repair']
  },
  {
    id: 'elec-switchboard-repair',
    title: 'Switchboard Repair & Replacement',
    slug: 'switchboard-repair',
    category: 'Electrician Services',
    keywords: ['switchboard repair', 'distribution board repair', 'meter board repair'],
    aliases: ['fix switchboard', 'service switchboard']
  },
  {
    id: 'elec-newbox-install',
    title: 'New Switchbox Installation',
    slug: 'new-switchbox-installation',
    category: 'Electrician Services',
    keywords: ['switchbox installation', 'new switchbox install', 'distribution box installation'],
    aliases: ['install switchbox', 'new breaker box']
  },
  {
    id: 'elec-mcb',
    title: 'MCB & Distribution Box Upgrade',
    slug: 'mcb-upgrade',
    category: 'Electrician Services',
    keywords: ['mcb upgrade', 'distribution box upgrade', 'circuit breaker upgrade'],
    aliases: ['install mcb', 'replace mcb', 'upgrade mcb']
  },
  {
    id: 'elec-wiring',
    title: 'House Wiring & Circuit Tracing',
    slug: 'house-wiring-tracing',
    category: 'Electrician Services',
    keywords: ['house wiring', 'circuit tracing', 'electrical wiring'],
    aliases: ['wire house', 'check wiring']
  },
  {
    id: 'elec-doorbell',
    title: 'Doorbell & Intercom Repair',
    slug: 'doorbell-intercom-repair',
    category: 'Electrician Services',
    keywords: ['doorbell repair', 'intercom repair', 'doorbell fixing'],
    aliases: ['fix doorbell', 'repair intercom']
  },
  {
    id: 'elec-inverter',
    title: 'Inverter & Battery Service',
    slug: 'inverter-battery-service',
    category: 'Electrician Services',
    keywords: ['inverter service', 'battery service', 'inverter repair'],
    aliases: ['invertor service', 'battery repair']
  },
  {
    id: 'app-ro-repair',
    title: 'RO Purifier Repair & Diagnostics',
    slug: 'ro-repair',
    category: 'Appliance Repair',
    keywords: ['ro repair', 'purifier repair', 'water purifier repair', 'aquaguard repair'],
    aliases: ['ro service', 'ro fixing', 'kent repair']
  },
  {
    id: 'app-ro-service',
    title: 'RO Purifier Filter Service',
    slug: 'ro-filter-service',
    category: 'Appliance Repair',
    keywords: ['ro service', 'ro filter service', 'water purifier service'],
    aliases: ['ro cleaning', 'filter service']
  },
  {
    id: 'app-ro-install',
    title: 'RO Purifier Installation',
    slug: 'ro-installation',
    category: 'Appliance Repair',
    keywords: ['ro installation', 'water purifier installation', 'aquaguard installation', 'kent installation'],
    aliases: ['install ro', 'ro setup', 'purifier installation']
  },
  {
    id: 'app-ro-uninstall',
    title: 'RO Purifier Uninstallation',
    slug: 'ro-uninstallation',
    category: 'Appliance Repair',
    keywords: ['ro uninstallation', 'ro removal', 'purifier removal'],
    aliases: ['uninstall ro', 'remove ro']
  },
  {
    id: 'app-washing-repair',
    title: 'Washing Machine Repair & Diagnostics',
    slug: 'washing-machine-repair-diagnostics',
    category: 'Appliance Repair',
    keywords: ['washing machine repair', 'washing machine diagnostics', 'washing machine not spinning'],
    aliases: ['wash machine repair', 'washing machine fix']
  },
  {
    id: 'app-washing-install',
    title: 'Washing Machine Installation',
    slug: 'washing-machine-installation',
    category: 'Appliance Repair',
    keywords: ['washing machine installation', 'washer installation', 'washing machine setup'],
    aliases: ['install washing machine', 'washing machine fitting']
  },
  {
    id: 'app-washing-uninstall',
    title: 'Washing Machine Uninstallation',
    slug: 'washing-machine-uninstallation',
    category: 'Appliance Repair',
    keywords: ['washing machine uninstallation', 'washer removal', 'remove washing machine'],
    aliases: ['uninstall washing machine', 'washing machine remove']
  },
  {
    id: 'app-washing-service',
    title: 'Washing Machine Tub Deep Clean',
    slug: 'washing-machine-deep-clean',
    category: 'Appliance Repair',
    keywords: ['washing machine deep clean', 'tub deep clean', 'washing machine cleaning'],
    aliases: ['washing machine service', 'washer clean']
  },
  {
    id: 'app-geyser-repair',
    title: 'Geyser Repair & Diagnostics',
    slug: 'geyser-repair',
    category: 'Appliance Repair',
    keywords: ['geyser repair', 'geyser diagnostics', 'water heater repair'],
    aliases: ['fix geyser', 'geyser service']
  },
  {
    id: 'app-geyser-service',
    title: 'Geyser Descaling & Maintenance',
    slug: 'geyser-maintenance',
    category: 'Appliance Repair',
    keywords: ['geyser maintenance', 'geyser descaling', 'water heater maintenance'],
    aliases: ['geyser cleaning', 'geyser service']
  },
  {
    id: 'app-geyser-install',
    title: 'Geyser Installation',
    slug: 'geyser-installation',
    category: 'Appliance Repair',
    keywords: ['geyser installation', 'water heater installation'],
    aliases: ['install geyser', 'geyser setup']
  },
  {
    id: 'app-geyser-uninstall',
    title: 'Geyser Uninstallation',
    slug: 'geyser-uninstallation',
    category: 'Appliance Repair',
    keywords: ['geyser uninstallation', 'remove geyser'],
    aliases: ['uninstall geyser', 'geyser removal']
  },
  {
    id: 'app-fridge-repair',
    title: 'Refrigerator Repair & Diagnostics',
    slug: 'refrigerator-repair-diagnostics',
    category: 'Appliance Repair',
    keywords: ['refrigerator repair', 'fridge repair', 'fridge diagnostics'],
    aliases: ['fix fridge', 'fridge not cooling']
  },
  {
    id: 'app-fridge-gas-single',
    title: 'Single-Door Refrigerator Gas Charging',
    slug: 'single-door-fridge-gas-charging',
    category: 'Appliance Repair',
    keywords: ['single door refrigerator gas charging', 'fridge gas charging', 'single door fridge gas refill'],
    aliases: ['fridge gas topup', 'single door fridge recharge']
  },
  {
    id: 'app-fridge-gas-double',
    title: 'Double-Door Refrigerator Gas Charging',
    slug: 'double-door-fridge-gas-charging',
    category: 'Appliance Repair',
    keywords: ['double door refrigerator gas charging', 'double door fridge gas refill', 'fridge gas charging'],
    aliases: ['double fridge gas topup', 'fridge gas refill']
  },
  {
    id: 'app-fridge-service',
    title: 'Refrigerator Deep Cleaning Service',
    slug: 'refrigerator-deep-cleaning',
    category: 'Appliance Repair',
    keywords: ['refrigerator deep cleaning', 'fridge deep clean', 'fridge cleaning service'],
    aliases: ['clean fridge', 'fridge service']
  },
  {
    id: 'app-microwave-repair',
    title: 'Microwave Oven Repair',
    slug: 'microwave-repair',
    category: 'Appliance Repair',
    keywords: ['microwave repair', 'oven repair', 'microwave oven repair'],
    aliases: ['fix microwave', 'repair oven']
  },
  {
    id: 'app-microwave-service',
    title: 'Microwave Deep Clean & Sanitization',
    slug: 'microwave-cleaning',
    category: 'Appliance Repair',
    keywords: ['microwave cleaning', 'microwave sanitization', 'oven cleaning'],
    aliases: ['clean microwave', 'microwave service']
  },
  {
    id: 'app-chimney-repair',
    title: 'Kitchen Chimney Repair & Diagnostics',
    slug: 'kitchen-chimney-repair',
    category: 'Appliance Repair',
    keywords: ['chimney repair', 'kitchen chimney repair', 'chimney diagnostics'],
    aliases: ['fix chimney', 'chimney service']
  },
  {
    id: 'app-chimney-install',
    title: 'Kitchen Chimney Installation',
    slug: 'kitchen-chimney-installation',
    category: 'Appliance Repair',
    keywords: ['chimney installation', 'kitchen chimney installation'],
    aliases: ['install chimney', 'chimney setup']
  },
  {
    id: 'app-chimney-uninstall',
    title: 'Kitchen Chimney Uninstallation',
    slug: 'kitchen-chimney-uninstallation',
    category: 'Appliance Repair',
    keywords: ['chimney uninstallation', 'remove chimney'],
    aliases: ['uninstall chimney', 'chimney removal']
  },
  {
    id: 'app-chimney-service',
    title: 'Kitchen Chimney Deep Service',
    slug: 'kitchen-chimney-service',
    category: 'Appliance Repair',
    keywords: ['chimney service', 'kitchen chimney service', 'chimney cleaning'],
    aliases: ['clean chimney', 'chimney maintenance']
  },
  {
    id: 'home-pigeon',
    title: 'Balcony Pigeon Net Installation',
    slug: 'balcony-pigeon-net-installation',
    category: 'Home Installations',
    keywords: ['pigeon net installation', 'balcony net installation', 'pigeon mesh installation'],
    aliases: ['install pigeon net', 'bird net installation']
  },
  {
    id: 'home-plumber',
    title: 'Doorstep Plumbing Utilities',
    slug: 'plumbing-utilities',
    category: 'Home Installations',
    keywords: ['plumbing utilities', 'plumbing service', 'doorstep plumber'],
    aliases: ['plumber service', 'pipe repair']
  },
  {
    id: 'home-carpenter',
    title: 'Carpentry Adjustments & Repairs',
    slug: 'carpentry-adjustments-repairs',
    category: 'Home Installations',
    keywords: ['carpentry repairs', 'carpenter service', 'woodwork repair'],
    aliases: ['fix carpentry', 'carpenter repair']
  },
  {
    id: 'home-ceiling',
    title: 'Gypsum False Ceiling Service',
    slug: 'gypsum-false-ceiling-service',
    category: 'Home Installations',
    keywords: ['false ceiling service', 'gypsum ceiling service', 'ceiling work'],
    aliases: ['install false ceiling', 'ceiling repair']
  }
];

export const serviceCatalogById: Record<string, ServiceCatalogEntry> = Object.fromEntries(
  serviceCatalog.map((service) => [service.id, service])
);

export const serviceCatalogBySlug: Record<string, ServiceCatalogEntry> = Object.fromEntries(
  serviceCatalog.map((service) => [service.slug, service])
);

export const getServiceById = (id: string): ServiceCatalogEntry | undefined => serviceCatalogById[id];
export const getServiceSlugById = (id: string): string | undefined => serviceCatalogById[id]?.slug;
export const getServiceBySlug = (slug: string): ServiceCatalogEntry | undefined => serviceCatalogBySlug[slug];

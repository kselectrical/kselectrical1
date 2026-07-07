import { serviceCatalog } from '../../serviceCatalog';
import type { BusinessConfig } from '../../data';
import type { TechnicalService } from '../../types';

interface AreaLink {
  label: string;
  path: string;
}

interface FactPoint {
  title: string;
  desc: string;
}

interface ServicePageSeo {
  title: string;
  description: string;
  keyword: string;
  heading: string;
  intro: string;
  whyChooseUs: FactPoint[];
  relatedServices: AreaLink[];
  areasServed: AreaLink[];
  faqList: { q: string; a: string }[];
  localHighlights: string;
  serviceSchema: Record<string, unknown>;
  faqSchema: Record<string, unknown>;
  breadcrumbSchema: Record<string, unknown>;
  localBusinessSchema: Record<string, unknown>;
}

const PRIMARY_AREAS = [
  { slug: 'gaur-city-1', label: 'Gaur City 1' },
  { slug: 'gaur-city-2', label: 'Gaur City 2' },
  { slug: 'greater-noida-west', label: 'Greater Noida West' },
  { slug: 'noida-extension', label: 'Noida Extension' },
  { slug: 'gaur-city-1', label: 'Ace City' }
];

const PRIMARY_NEIGHBORHOODS = [
  'Ace City',
  'Palm Olympia',
  'Fusion Homes',
  'Eco Village',
  'Cherry County',
  'Nirala Estate',
  'Techzone'
];

const getLocalHeadline = (serviceName: string) =>
  `${serviceName} in Greater Noida, Gaur City & Noida Extension`;

const generateMetaTitle = (serviceName: string) =>
  `${serviceName} in Gaur City & Greater Noida West | KS Electrical And AC Services`;

const generateMetaDescription = (serviceName: string) => {
  const description = `Book trusted ${serviceName.toLowerCase()} in Gaur City, Greater Noida West and Noida Extension. Call KS Electrical now for fast local repair with transparent pricing.`;
  return description.slice(0, 160);
};

const generateKeywords = (serviceName: string, catalogKeywords: string[]) => {
  const baseKeywords = [
    `${serviceName} in Gaur City`,
    `${serviceName} in Greater Noida West`,
    `${serviceName} in Noida Extension`,
    `${serviceName} near me`,
    'local electrician service',
    'doorstep repair service'
  ];
  return [...new Set([...baseKeywords, ...catalogKeywords])].join(', ');
};

const getNearbyNeighborhoodText = () =>
  `Serving homes and apartments in ${PRIMARY_NEIGHBORHOODS.slice(0, 5).join(', ')}, plus nearby sectors across Greater Noida and Noida Extension.`;

const getRelatedServices = (serviceSlug: string, category: string) => {
  const related = serviceCatalog
    .filter(entry => entry.category === category && entry.slug !== serviceSlug)
    .slice(0, 4)
    .map(entry => ({ label: entry.title, path: `/services/${entry.slug}` }));

  if (related.length >= 4) {
    return related;
  }

  return [
    ...related,
    ...serviceCatalog
      .filter(entry => entry.slug !== serviceSlug)
      .slice(0, 4 - related.length)
      .map(entry => ({ label: entry.title, path: `/services/${entry.slug}` }))
  ];
};

const getAreasServed = (serviceSlug: string) =>
  PRIMARY_AREAS.map(area => ({ label: area.label, path: `/services/${serviceSlug}/${area.slug}` }));

const getWhyChoosePoints = () => [
  {
    title: 'Experienced Technicians',
    desc: 'Our electricians and appliance engineers are background-verified, trained, and dispatched from our local Greater Noida field hub.'
  },
  {
    title: 'Genuine Spare Parts',
    desc: 'We use only manufacturer-approved spares and branded components for safe, long-lasting repairs and installations.'
  },
  {
    title: 'Doorstep Service',
    desc: 'From Gaur City 1 to Noida Extension, we reach your home quickly and complete most repairs in a single visit.'
  },
  {
    title: 'Transparent Pricing',
    desc: 'You get a clear quote before work begins, with no hidden fees so you can book with confidence.'
  },
  {
    title: 'Customer Satisfaction',
    desc: 'Every job is backed by a service warranty and our commitment to respectful, reliable workmanship.'
  }
];

const getServiceFaqs = (serviceName: string, category: string) => {
  const commonFaqs = [
    {
      q: `How fast can I get ${serviceName.toLowerCase()} in Greater Noida?`,
      a: `We dispatch local technicians from our Greater Noida hub. Most service calls in Gaur City, Noida Extension and Greater Noida West are attended within 60-90 minutes.`
    },
    {
      q: `Do you service apartments like Ace City, Fusion Homes and Eco Village?`,
      a: `Yes, our team regularly visits all major gated communities and society towers in Gaur City and Greater Noida. We ensure easy access and fast completion for every booking.`
    },
    {
      q: `Is the ${serviceName.toLowerCase()} covered by warranty?`,
      a: `Yes, all work completed by KS Electrical includes a standard warranty and quality support for 30 days after the service.`
    }
  ];

  const extraFaq = category.toLowerCase().includes('ac')
    ? {
        q: 'Does AC repair include gas top-up and leak inspection?',
        a: 'Yes, our AC service technicians check cooling pressure, inspect for leaks and recommend gas recharge only when required to restore proper cooling.'
      }
    : category.toLowerCase().includes('electrician')
    ? {
        q: 'Can you fix short circuits and upgrade MCBs in the same visit?',
        a: 'Yes, we carry the tools and safety parts needed to troubleshoot short circuits and replace circuit breakers or MCBs during one visit.'
      }
    : category.toLowerCase().includes('fan')
    ? {
        q: 'Can I get ceiling fan balancing and capacitor replacement at my apartment?',
        a: 'Absolutely, we service ceiling fans in residential towers and independent homes across Gaur City and Noida Extension with genuine capacitors and vibration checks.'
      }
    : category.toLowerCase().includes('ro')
    ? {
        q: 'Will the RO service include a membrane and filter check?',
        a: 'Yes, our RO maintenance includes filter inspection, membrane flushing, TDS review, and sanitization of water storage lines.'
      }
    : category.toLowerCase().includes('washing')
    ? {
        q: 'Do you handle washing machine drum and drain issues on doorstep service?',
        a: 'Yes, our technicians repair drum problems, unclog drains, and inspect inlet valves while working at your home.'
      }
    : category.toLowerCase().includes('geyser')
    ? {
        q: 'Can you descale a geyser and inspect heating elements during the same visit?',
        a: 'Yes, the visit includes tank inspection, scale removal, and a full safety check of heating elements and thermostats.'
      }
    : category.toLowerCase().includes('refrigerator')
    ? {
        q: 'Do you provide doorstep refrigerator gas recharge and compressor diagnosis?',
        a: 'Yes, we diagnose compressor faults and offer gas charging if needed to restore fridge cooling performance safely.'
      }
    : category.toLowerCase().includes('chimney')
    ? {
        q: 'Does kitchen chimney cleaning include motor and duct inspection?',
        a: 'Yes, our chimney service covers baffle filter degreasing, blower motor checks and duct clearance to restore suction.'
      }
    : category.toLowerCase().includes('light')
    ? {
        q: 'Can you install decorative lights and fix loose ceiling fixtures at my flat?',
        a: 'Yes, our electricians handle light installation, fixture replacement and wiring safety checks for all residential lighting.'
      }
    : category.toLowerCase().includes('installation')
    ? {
        q: 'Do you offer safe wall mounting and full testing after installation?',
        a: 'Yes, every installation includes secure mounting, wiring checks and a final functional test before we leave.'
      }
    : {
        q: `What makes ${serviceName.toLowerCase()} reliable in Greater Noida?`,
        a: `Our local technicians follow a strict quality process, use branded spare parts, and provide a standard warranty for all repairs.`
      };

  return [...commonFaqs.slice(0, 2), extraFaq];
};

const buildSchemaObjects = (
  service: TechnicalService,
  businessConfig: BusinessConfig,
  description: string,
  faqList: { q: string; a: string }[],
  canonicalUrl: string
) => {
  const siteDomain = businessConfig.website.startsWith('http')
    ? businessConfig.website
    : `https://${businessConfig.website}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.name,
    'serviceType': service.category,
    'provider': {
      '@type': 'LocalBusiness',
      'name': businessConfig.name,
      'image': `${siteDomain}${businessConfig.logoUrl}`,
      'telephone': `+91-${businessConfig.contacts[0]}`,
      'url': siteDomain,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Gaur City 1, Greater Noida West',
        'addressLocality': 'Noida Extension',
        'addressRegion': 'Uttar Pradesh',
        'postalCode': '201301',
        'addressCountry': 'IN'
      }
    },
    'areaServed': [
      { '@type': 'AdministrativeArea', 'name': 'Gaur City 1' },
      { '@type': 'AdministrativeArea', 'name': 'Gaur City 2' },
      { '@type': 'AdministrativeArea', 'name': 'Greater Noida West' },
      { '@type': 'AdministrativeArea', 'name': 'Noida Extension' }
    ],
    'description': description,
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'INR',
      'lowPrice': service.price,
      'highPrice': service.price + 1200,
      'offerCount': 1
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqList.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteDomain
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Services',
        'item': `${siteDomain}/services`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': service.name,
        'item': canonicalUrl
      }
    ]
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': businessConfig.name,
    'image': `${siteDomain}${businessConfig.logoUrl}`,
    'telephone': `+91-${businessConfig.contacts[0]}`,
    'email': businessConfig.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Gaur City 1, Greater Noida West',
      'addressLocality': 'Noida Extension',
      'addressRegion': 'Uttar Pradesh',
      'postalCode': '201301',
      'addressCountry': 'IN'
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        'opens': '08:00',
        'closes': '22:00'
      }
    ],
    'url': siteDomain,
    'areaServed': ['Gaur City 1', 'Gaur City 2', 'Greater Noida West', 'Noida Extension', 'Greater Noida', 'Noida', 'Ghaziabad']
  };

  return { serviceSchema, faqSchema, breadcrumbSchema, localBusinessSchema };
};

export const generateServicePageSeo = (
  service: TechnicalService,
  catalogEntry: { slug: string; title: string; category: string; keywords: string[] },
  businessConfig: BusinessConfig
): ServicePageSeo => {
  const title = generateMetaTitle(service.name);
  const description = generateMetaDescription(service.name);
  const keyword = generateKeywords(service.name, catalogEntry.keywords);
  const heading = getLocalHeadline(service.name);
  const intro = `Trusted ${service.name.toLowerCase()} across Gaur City, Greater Noida West and Noida Extension. Our local team makes safe doorstep repairs and installations easy for every home.`;
  const whyChooseUs = getWhyChoosePoints();
  const relatedServices = getRelatedServices(catalogEntry.slug, catalogEntry.category);
  const areasServed = getAreasServed(catalogEntry.slug);
  const faqList = getServiceFaqs(service.name, catalogEntry.category);
  const localHighlights = getNearbyNeighborhoodText();

  const canonicalUrl = `https://${businessConfig.website.replace(/^https?:\/\//, '')}/services/${catalogEntry.slug}`;
  const { serviceSchema, faqSchema, breadcrumbSchema, localBusinessSchema } = buildSchemaObjects(
    service,
    businessConfig,
    description,
    faqList,
    canonicalUrl
  );

  return {
    title,
    description,
    keyword,
    heading,
    intro,
    whyChooseUs,
    relatedServices,
    areasServed,
    faqList,
    localHighlights,
    serviceSchema,
    faqSchema,
    breadcrumbSchema,
    localBusinessSchema
  };
};

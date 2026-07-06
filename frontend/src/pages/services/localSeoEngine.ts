/**
 * Local SEO Content & Structured Data Permutation Engine
 * Generates unique, non-duplicative, natural language content (800-1200 words)
 * and rich JSON-LD schemas for any Service + Location combination.
 */

export interface GeneratedContent {
  title: string;
  description: string;
  keyword: string;
  heading: string;
  intro: string;
  longDescription: string;
  whyChooseUs: { title: string; desc: string }[];
  processSteps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  landmarksText: string;
  nearbySectorsText: string;
  societiesText: string;
  pincode: string;
}

// Deterministic hashing helper to keep content stable and avoid hydration mismatches
export const getDeterministicSeed = (serviceSlug: string, locationSlug: string): number => {
  const combined = `${serviceSlug.trim().toLowerCase()}-${locationSlug.trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = combined.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const selectOption = <T>(arr: T[], seed: number, indexOffset: number = 0): T => {
  return arr[(seed + indexOffset) % arr.length];
};

// Rich Local Area Database mapping slugs to local landmarks, societies, sectors, and details
interface LocationMeta {
  name: string;
  landmarks: string[];
  societies: string[];
  sectors: string[];
  pincode: string;
}

const LOCATION_DB: Record<string, LocationMeta> = {
  'gaur-city-1': {
    name: 'Gaur City 1',
    landmarks: ['Gaur City Mall', 'Gaur City Plaza', 'Galaxy Diamond Plaza', 'Char Murti Chowk'],
    societies: ['Gaur City 1st Avenue', 'Gaur City 4th Avenue', 'Gaur City 5th Avenue', 'Gaur City 6th Avenue', 'Gaur Cascades'],
    sectors: ['Greater Noida West', 'Noida Sector 121', 'Noida Sector 122', 'Sector 4 Greater Noida'],
    pincode: '201301'
  },
  'gaur-city-2': {
    name: 'Gaur City 2',
    landmarks: ['Gaur City Galleria', 'City Park Gaur City 2', 'Char Murti Circle', 'Gaur High Street'],
    societies: ['Gaur City 10th Avenue', 'Gaur City 11th Avenue', 'Gaur City 12th Avenue', 'Gaur City 14th Avenue', 'Gaur City 16th Avenue', 'Sanskriti Vihar'],
    sectors: ['Noida Extension', 'Sector 16C Greater Noida', 'Taj Highway Corridor'],
    pincode: '201301'
  },
  'noida-extension': {
    name: 'Noida Extension',
    landmarks: ['Ek Murti Roundabout', 'Gaur City Mall', 'Char Murti Chowk', 'Noida Extension Metro Pillar Area'],
    societies: ['Ace City', 'Ace Divino', 'Ace Aspire', 'Fusion Homes', 'Mahagun Mywoods', 'Supertech Eco Village 1', 'Supertech Eco Village 2', 'Ajnara Homes', 'Cherry County'],
    sectors: ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 10', 'Sector 16B', 'Sector 16C'],
    pincode: '201306'
  },
  'greater-noida-west': {
    name: 'Greater Noida West',
    landmarks: ['Char Murti Chowk', 'Gaur City Mall', 'Ek Murti Chowk', 'Nirala Estate Complex'],
    societies: ['La Residentia', 'Panchsheel Greens 1', 'Panchsheel Greens 2', 'Spring Meadows', 'Stellar Jeevan', 'RG Luxury Homes', 'Exotica Dreamville', 'Casa Greens'],
    sectors: ['Sector 1', 'Sector 2', 'Sector 4', 'Sector 10', 'Sector 12', 'Sector 16C', 'Bisrakh'],
    pincode: '201306'
  },
  'indirapuram': {
    name: 'Indirapuram',
    landmarks: ['Shipra Mall', 'Swarna Jayanti Park', 'Aditya Mall', 'Kala Patthar Marg', 'Jaipuria Sunrise Plaza'],
    societies: ['Shipra Sun City', 'Orange County', 'Niho Scottsdale', 'Amrapali Royal', 'GC Grand', 'Ats Advantage', 'Supertech Icon'],
    sectors: ['Ahinsa Khand 1', 'Ahinsa Khand 2', 'Niti Khand 1', 'Niti Khand 2', 'Shakti Khand', 'Gyan Khand', 'Vaibhav Khand', 'Abhay Khand'],
    pincode: '201014'
  },
  'vaishali': {
    name: 'Vaishali',
    landmarks: ['Mahagun Metro Mall', 'Vaishali Metro Station', 'Max Super Speciality Hospital', 'Shopprix Mall Vaishali'],
    societies: ['Supertech Avant Garde', 'Cloud 9 Towers', 'Vaishali Apartments', 'Rishabh Cloud 9'],
    sectors: ['Vaishali Sector 1', 'Vaishali Sector 2', 'Vaishali Sector 3', 'Vaishali Sector 4', 'Vaishali Sector 5', 'Vaishali Sector 6'],
    pincode: '201010'
  },
  'vasundhara': {
    name: 'Vasundhara',
    landmarks: ['Vasundhara Plaza', 'Maharaja Agrasen Park', 'Olive County Gate', 'Vasundhara Budh Chowk'],
    societies: ['Olive County', 'SG Homes', 'Sare Homes', 'Vasundhara Enclave'],
    sectors: ['Vasundhara Sector 1', 'Vasundhara Sector 3', 'Vasundhara Sector 5', 'Vasundhara Sector 9', 'Vasundhara Sector 10', 'Vasundhara Sector 15'],
    pincode: '201012'
  },
  'raj-nagar-extension': {
    name: 'Raj Nagar Extension',
    landmarks: ['VVIP Style Mall', 'City Forest Ghaziabad', 'KDP Roundabout', 'NH-58 Bypass Corridor'],
    societies: ['KDP Grand Savannah', 'VVIP Addresses', 'Ajnara Integrity', 'Charms Castle', 'Saviour Park', 'SG Grand', 'River Heights'],
    sectors: ['Raj Nagar', 'Kavi Nagar', 'Sanjay Nagar', 'Chiranjeev Vihar', 'Avantika'],
    pincode: '201017'
  },
  'crossings-republik': {
    name: 'Crossings Republik',
    landmarks: ['ABES Engineering College Road', 'Crossings Republik Glass Gate', 'Crossings Republik Golf Course', 'GH-7 Crossing Gate'],
    societies: ['Panchsheel Wellington', 'Saviour Greenisle', 'Supertech Livingstone', 'Arihant Amber', 'Ajnara Gen-X', 'Parameters Apartments'],
    sectors: ['NH-24 Corridor', 'Lal Kuan', 'Dundahera', 'Vijay Nagar', 'Pratap Vihar'],
    pincode: '201016'
  },
  'noida-sector-62': {
    name: 'Noida Sector 62',
    landmarks: ['Fortis Hospital Noida', 'Sector 62 Metro Station', 'Symbiosis Institute', 'Stellar IT Park'],
    societies: ['Overseas Apartments', 'Indian Oil Apartments', 'Shakti Apartments', 'Meghdootam Apartments'],
    sectors: ['Sector 62', 'Sector 63', 'Sector 59', 'Sector 61', 'Sector 22', 'Khora Colony'],
    pincode: '201301'
  }
};

const getFallbackMeta = (slug: string): LocationMeta => {
  const normalized = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return {
    name: normalized,
    landmarks: [`${normalized} Central Market`, `${normalized} Main Crossing`, `Local Landmark Area in ${normalized}`],
    societies: [`Popular residential complexes in ${normalized}`, `Local apartments in ${normalized}`],
    sectors: [`Sectors in ${normalized}`, `Surrounding blocks of ${normalized}`],
    pincode: '201301'
  };
};

export const generateLocalContent = (
  serviceSlug: string,
  locationSlug: string,
  businessConfig: { name: string; contacts: string[]; email: string }
): GeneratedContent => {
  const seed = getDeterministicSeed(serviceSlug, locationSlug);
  const locMeta = LOCATION_DB[locationSlug.toLowerCase()] || getFallbackMeta(locationSlug);

  // Normalize Service names
  let serviceName = 'Repair Service';
  if (serviceSlug.includes('ac-service')) { serviceName = 'AC Service'; }
  else if (serviceSlug.includes('ac-repair')) { serviceName = 'AC Repair'; }
  else if (serviceSlug.includes('ac-installation')) { serviceName = 'AC Installation'; }
  else if (serviceSlug.includes('ro-service')) { serviceName = 'RO Purifier Service'; }
  else if (serviceSlug.includes('electrician')) { serviceName = 'Electrician Service'; }
  else if (serviceSlug.includes('washing-machine')) { serviceName = 'Washing Machine Repair'; }
  else if (serviceSlug.includes('refrigerator')) { serviceName = 'Refrigerator Repair'; }
  else if (serviceSlug.includes('chimney')) { serviceName = 'Kitchen Chimney Service'; }
  else if (serviceSlug.includes('geyser')) { serviceName = 'Geyser Repair'; }
  else if (serviceSlug.includes('fan')) { serviceName = 'Ceiling Fan Repair'; }
  else if (serviceSlug.includes('light')) { serviceName = 'Light & Chandelier Fitting'; }
  else if (serviceSlug.includes('home-installations')) { serviceName = 'Home Installations'; }
  else if (serviceSlug.includes('microwave')) { serviceName = 'Microwave Oven Repair'; }

  // Title templates
  const titleTemplates = [
    `Best ${serviceName} in ${locMeta.name} | Certified Technician Visit`,
    `Expert ${serviceName} in ${locMeta.name} - 100% Guaranteed Repair`,
    `${serviceName} ${locMeta.name} | Doorstep Diagnostics & Fitment`,
    `Affordable ${serviceName} in ${locMeta.name} | Same Day Service`
  ];
  const title = selectOption(titleTemplates, seed, 0);

  // Meta Description templates
  const descTemplates = [
    `Book certified ${serviceName.toLowerCase()} in ${locMeta.name} at the lowest price. Get 100% safe, background-verified technicians at your doorstep within 90 minutes. 30-day warranty.`,
    `Need urgent ${serviceName.toLowerCase()} near ${locMeta.landmarks[0]} in ${locMeta.name}? We provide flat-rate repairs, original spares, and expert certified engineers. Same day visit.`,
    `No.1 rated ${serviceName.toLowerCase()} in ${locMeta.name}. Serving ${locMeta.societies[0]} and surrounding sectors. Pay exactly what is quoted. Get 30-day service warranty cover.`
  ];
  const description = selectOption(descTemplates, seed, 1);

  const keyword = `${serviceName} in ${locMeta.name}, ${serviceName.toLowerCase()} near me, local electrician in ${locMeta.name}, ${serviceName.toLowerCase()} ${locMeta.pincode}, best ${serviceName.toLowerCase()} company in Noida Extension, Gaur City ${serviceName.toLowerCase()}`;
  const heading = `Professional ${serviceName} in ${locMeta.name}`;

  // Unique intro templates
  const introTemplates = [
    `If you are looking for trusted, prompt, and high-quality ${serviceName.toLowerCase()} in ${locMeta.name}, you are at the right place. Our certified service technicians reside nearby and can reach your residence near ${locMeta.landmarks[0]} within 90 minutes. We provide standard diagnostics, spare part changes, and performance testing at direct upfront rates without any hidden dispatch costs.`,
    `We offer highly rated ${serviceName.toLowerCase()} in ${locMeta.name} for both single-unit households and large residential complexes across ${locMeta.societies[0]}. Backed by our official 30-Day Service Warranty, we guarantee premium workmanship, background-verified professionals, and standard safety precautions for every repair visit in the ${locMeta.pincode} postal region.`,
    `Get expert, quick-dispatch ${serviceName.toLowerCase()} in ${locMeta.name} to solve all appliance faults, electrical issues, or installation needs. Our team handles local service requests near ${locMeta.landmarks[1]} with high technical accuracy, utilizing digital testing tools and brand-approved OEM spare components to ensure stable post-repair performance.`
  ];
  const intro = selectOption(introTemplates, seed, 2);

  // Dynamic area landmark descriptions (~150 words)
  const landmarkTemplates = [
    `Our local service network spans the entire length of ${locMeta.name}, meaning our repair vans are always close to landmarks like ${locMeta.landmarks[0]}, ${locMeta.landmarks[1]}, and the commercial corridors near ${locMeta.landmarks[2] || 'the main crossroads'}. Whether you reside on the high-rise floors of ${locMeta.societies[0]}, ${locMeta.societies[1]}, or in independent houses around ${locMeta.sectors[0]}, our engineers can navigate local sectors to provide same-day doorstep repair services.`,
    `We actively serve household customers near ${locMeta.landmarks[0]} and the surrounding residential sectors of ${locMeta.name}. Our dispatch team regularly handles repair visits across ${locMeta.societies[0]}, ${locMeta.societies[1] || 'nearby towers'}, and ${locMeta.societies[2] || 'surrounding complexes'}. Living near ${locMeta.landmarks[1]} gives you the advantage of our express 60-minute emergency service dispatch window for any critical electrical short circuits or cooling breakdowns.`,
    `With comprehensive coverage across ${locMeta.name} (PIN: ${locMeta.pincode}), our technicians are fully equipped to serve communities surrounding ${locMeta.landmarks[0]} and ${locMeta.landmarks[1]}. We cover local addresses in ${locMeta.sectors[0]}, ${locMeta.sectors[1] || 'adjoining blocks'}, and major society developments including ${locMeta.societies[0]}, ${locMeta.societies[1]}, and ${locMeta.societies[2] || 'local housing projects'}.`
  ];
  const landmarksText = selectOption(landmarkTemplates, seed, 3);

  // Unique Why Choose Us points
  const whyChooseUsPoints = [
    [
      { title: "Licensed Neighborhood Professionals", desc: "Every dispatched technician is a certified trade specialist with over 5+ years of appliance diagnostics experience." },
      { title: "Transparent Upfront Rate Card", desc: "No surprise visit fees or hidden charges. Pay exactly what is quoted in the rate card prior to repair starting." },
      { title: "30-Day Protected Warranty Coverage", desc: "Complete peace of mind. Any issue arising in the replaced spare parts within 30 days is fixed free of cost." }
    ],
    [
      { title: "Express 90-Minute Dispatch", desc: "Located locally in Noida Extension, our mobile repair vans reach your doorstep in Gaur City and Noida Extension within 90 minutes." },
      { title: "100% Genuine OEM Spare Parts", desc: "We source capacitors, relays, fan motors, and filters directly from brand authorized distributors with invoice tags." },
      { title: "Background Verified Safety Visit", desc: "Technicians undergo biometric verification and technical safety drills to guarantee a safe domestic visit." }
    ],
    [
      { title: "Emergency Availability", desc: "Urgent appliance breakdown or electrical short circuit? Call us for immediate emergency support." },
      { title: "Advanced Calibration Tools", desc: "We use digital multimeters, anemometers, and halogen leak detectors to pinpoint technical errors accurately." },
      { title: "Eco-Friendly Cleaning Protocols", desc: "Non-toxic chemical sprays and water jet service ensure complete cleanliness without environmental damage." }
    ]
  ];
  const whyChooseUs = selectOption(whyChooseUsPoints, seed, 4);

  // Dynamic process steps
  const processStepsPoints = [
    [
      { title: "Doorstep Physical Diagnostic Scan", desc: "Our technician arrives, operates the appliance to verify the fault, and inspects wiring resistance and current load." },
      { title: "Itemized Bill Quotation", desc: "We explain the underlying error and provide a clear quotation detailing spares costs and labor before beginning." },
      { title: "Safe Technical Execution", desc: "Using insulated tools, the engineer replaces damaged components and cleans internal dust build-up." },
      { title: "Post-Repair Testing & Signature", desc: "The appliance is run for 15 minutes. Upon your full satisfaction, we issue the official digital invoice showing your warranty." }
    ],
    [
      { title: "Visual & Digital Multi-Scan", desc: "We inspect for physical damage, leakages, and check capacitor values and compressor pressure bounds." },
      { title: "Error Classification & Cost Approval", desc: "We break down the repairs needed and wait for your verbal or written consent before replacing parts." },
      { title: "Precision Spare Part Fitment", desc: "Damaged parts are swapped with original spares. Seals and gas pressures are optimized." },
      { title: "Clean Up & Warranty Registration", desc: "We clean the repair work area, perform safety checks, and register your 30-day service warranty in our database." }
    ]
  ];
  const processSteps = selectOption(processStepsPoints, seed, 5);

  // Dynamic localized FAQs
  const faqPoints = [
    [
      { q: `What are the visiting and inspection charges in ${locMeta.name}?`, a: `Our visiting charge is ₹99. However, if you proceed with the repairs, the inspection charge is adjusted to zero, and you only pay for the service and spare parts used.` },
      { q: `How quickly can a technician reach my flat in ${locMeta.societies[0]}?`, a: `Since our local service hub is stationed right at Gaur City 1, our technicians can reach ${locMeta.societies[0]} within 60 to 90 minutes of your booking confirmation.` },
      { q: `Do you supply brand original spares for repairs in ${locMeta.name}?`, a: `Yes, we only supply 100% genuine OEM spare parts with manufacturer serial stamps. All replacements are accompanied by our official 30-day warranty coverage.` }
    ],
    [
      { q: `Do you provide emergency electrical services in ${locMeta.name} at night?`, a: `Yes! For urgent issues like complete house blackouts, short circuits, or sparking distribution boxes near ${locMeta.landmarks[0]}, we offer priority emergency technician dispatch.` },
      { q: `Is the 30-day warranty applicable on all service jobs in ${locMeta.name}?`, a: `Yes, the 30-day warranty covers all diagnostic repairs, switch replacement jobs, capacitor fittings, and appliance services completed by our technicians.` },
      { q: `How can I pay for my doorstep service in ${locMeta.name}?`, a: `We support all convenient digital modes of payment including UPI (Google Pay, PhonePe, Paytm), Net Banking, Credit/Debit cards, and Cash on Delivery.` }
    ]
  ];
  const faqs = selectOption(faqPoints, seed, 6);

  // Generate 800-1200 words of rich content
  const longDescription = `
    <h3>Safe & Professional ${serviceName} in ${locMeta.name} (PIN: ${locMeta.pincode})</h3>
    <p>
      Maintaining home appliances and electrical setups in premium condition is essential for a stress-free household. If you are experiencing a technical fault or require a new setup, hiring a professional for <strong>${serviceName.toLowerCase()} in ${locMeta.name}</strong> ensures safe execution without risks of electrical fire or machine damage. At ${businessConfig.name}, we provide certified, background-checked technicians to address your specific repair requirements at the absolute lowest market prices.
    </p>
    <p>
      Our technicians are fully equipped with specialized diagnostic instruments to troubleshoot issues right at your doorstep. We recognize that home appliance failures can disrupt your daily schedule. Hence, we maintain a highly responsive localized dispatch network near <strong>${locMeta.landmarks[0]}</strong>. This enables us to schedule same-day repair visits within 90 minutes of your call, bringing rapid relief to households in <strong>${locMeta.societies[0]}</strong>, <strong>${locMeta.societies[1] || 'nearby towers'}</strong>, and adjacent blocks.
    </p>

    <h3>Why Insist on Certified Repair Technicians?</h3>
    <p>
      Attempting to resolve complex electrical line tracing, refrigerator gas leakage, or washing machine drum noise through uncertified local handymen can lead to recurring costs, voided warranties, or severe safety hazards. Our certified professionals undergo a strict vetting process and receive over 300 hours of technical training in domestic appliance repair. Whether it is trace repairs on modular switches, cleaning clogged RO water purifier membranes, descaling scale-coated geyser elements, or welding copper AC pipes, we perform the job with systematic precision.
    </p>
    <p>
      Our technician visits in <strong>${locMeta.name}</strong> prioritize safety. We check the earthing terminals of your power sockets and test for structural leakage currents using high-precision digital multimeters before handling any appliance. This extreme attention to safety prevents household shocks and safeguards your expensive household equipment.
    </p>

    <h3>Local Area Coverage and Landmarks We Serve</h3>
    <p>
      Our technicians are stationed locally to cover the entire layout of ${locMeta.name}. We frequently visit residential blocks near ${locMeta.landmarks[0]}, ${locMeta.landmarks[1]}, and the active commercial sector surrounding ${locMeta.landmarks[2] || 'the main roundabouts'}. Our vans carry complete sets of commonly required spare parts, such as heavy-duty capacitors, contactors, relays, and copper pipes, allowing us to finish the majority of repairs in a single visit without requiring multiple trips.
    </p>
    <p>
      We proudly serve resident communities inside major developments such as <strong>${locMeta.societies[0]}</strong>, <strong>${locMeta.societies[1]}</strong>, and <strong>${locMeta.societies[2] || 'surrounding apartments'}</strong>, as well as sector layouts including <strong>${locMeta.sectors[0]}</strong> and <strong>${locMeta.sectors[1] || 'nearby streets'}</strong>. By maintaining local technicians within Ghalibpur/Bisrakh corridors and Gaur City zones, we guarantee that our doorstep visits are highly efficient, reliable, and punctual.
    </p>

    <h3>Our Flat-Rate Billing & Customer Trust Commitments</h3>
    <p>
      At ${businessConfig.name}, we strongly believe in transparent pricing. We follow an itemized flat-rate catalog so you know exactly what is being charged. When our technician finishes diagnostics at your ${locMeta.name} address, you receive a clear explanation of the error and a written estimate. No work begins until you approve the quote.
    </p>
    <p>
      Every single service is backed by our official <strong>30-Day Protected Warranty</strong>. If the repaired component exhibits issues within 30 days of completion, our technicians will visit and resolve the concern at absolute zero service cost to you. This warranty is tracked digitally in our database using your registered mobile number, ensuring hassle-free support whenever you need it.
    </p>
  `;

  return {
    title,
    description,
    keyword,
    heading,
    intro,
    longDescription,
    whyChooseUs,
    processSteps,
    faqs,
    landmarksText,
    nearbySectorsText: `We cover all neighboring sectors of ${locMeta.name} including ${locMeta.sectors.join(', ')}.`,
    societiesText: `Providing doorstep convenience to residents of ${locMeta.societies.join(', ')}.`,
    pincode: locMeta.pincode
  };
};

// Generates rich JSON-LD Schemas dynamically for search engines
export const generateLocalSchemas = (
  serviceSlug: string,
  locationSlug: string,
  businessConfig: { name: string; contacts: string[]; email: string; website: string; logoUrl: string },
  content: GeneratedContent
) => {
  const locMeta = LOCATION_DB[locationSlug.toLowerCase()] || getFallbackMeta(locationSlug);
  const siteDomain = businessConfig.website.startsWith('http') ? businessConfig.website : `https://${businessConfig.website}`;
  const canonicalUrl = `${siteDomain}/services/${serviceSlug}/${locationSlug}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessConfig.name,
    "image": `${siteDomain}${businessConfig.logoUrl}`,
    "telephone": `+91-${businessConfig.contacts[0]}`,
    "email": businessConfig.email,
    "url": siteDomain,
    "priceRange": "₹99 - ₹4999",
    "logo": `${siteDomain}${businessConfig.logoUrl}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": locMeta.landmarks[0] || "Gaur City 1",
      "addressLocality": locMeta.name,
      "addressRegion": "Uttar Pradesh",
      "postalCode": locMeta.pincode,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.5997,
      "longitude": 77.4526
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "22:00"
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": locMeta.name
      },
      {
        "@type": "AdministrativeArea",
        "name": "Greater Noida West"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Noida Extension"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "reviewCount": 1250
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Jitesh Hassani"
        },
        "datePublished": "2026-05-30",
        "reviewBody": "Very professional technician. Arrived on time, completed the work efficiently.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sanitha"
        },
        "datePublished": "2026-05-28",
        "reviewBody": "The service is excellent and so genuine in feedback. Guided us honestly regarding spare parts.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5
        }
      }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": content.heading,
    "provider": localBusinessSchema,
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": locMeta.name
    },
    "description": content.description,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": 99,
      "highPrice": 4999,
      "offerCount": 12
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const breadcrumbsList = [
    { name: 'Home', item: siteDomain },
    { name: 'Services', item: `${siteDomain}/services` },
    { name: content.heading, item: canonicalUrl }
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbsList.map((b, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": b.name,
      "item": b.item
    }))
  };

  return {
    localBusinessSchema,
    serviceSchema,
    faqSchema,
    breadcrumbSchema
  };
};

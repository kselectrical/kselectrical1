import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  CheckCircle, Phone, MessageCircle, Snowflake, Wrench, Building2,
  ShoppingBag, Home, Users, Sun, RefreshCw,
  Loader2, Truck, MapPin, Zap, Menu, Gauge, BarChart2, ChevronDown,
  Activity, Headset, Repeat, DollarSign as DollarSignIcon, TrendingUp,
} from 'lucide-react';
import type { BusinessConfig } from '../data';
import { getAssetPath } from '../firebase';

// Types for our sections
interface AcType {
  id: string;
  title: string;
  description: string;
  idealRoomSize: string;
  coolingCapacity: string;
  recommendation: string;
  icon: React.ReactNode;
}

interface RentalPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface IncludedItem {
  icon: React.ReactNode;
  label: string;
}

// Default AC Types Data
const AC_ON_RENT_AC_TYPES: AcType[] = [
  {
    id: 'split-ac',
    title: 'Split AC',
    description: 'Wall-mounted indoor unit with outdoor compressor, ideal for bedrooms, living rooms, and offices.',
    idealRoomSize: 'Up to 200 sq ft',
    coolingCapacity: '1 Ton to 2 Ton',
    recommendation: 'Best for permanent installation with quiet operation and energy efficiency.',
    icon: <Building2 size={22} className="text-blue-500" />,
  },
  {
    id: 'window-ac',
    title: 'Window AC',
    description: 'All-in-one unit mounted in a window or wall opening, suitable for small to medium rooms.',
    idealRoomSize: 'Up to 150 sq ft',
    coolingCapacity: '0.8 Ton to 1.5 Ton',
    recommendation: 'Cost-effective cooling for rooms with suitable window/wall opening.',
    icon: <Menu size={22} className="text-green-500" />,
  },
  {
    id: '1-ton',
    title: '1 Ton AC',
    description: 'Suitable for small bedrooms, study rooms, or small offices.',
    idealRoomSize: 'Up to 120 sq ft',
    coolingCapacity: '3,500 BTU/hr',
    recommendation: 'Perfect for rooms up to 120 sq ft with moderate sun exposure.',
    icon: <Snowflake size={22} className="text-sky-500" />,
  },
  {
    id: '1-5-ton',
    title: '1.5 Ton AC',
    description: 'Ideal for medium-sized bedrooms, living rooms, or small offices.',
    idealRoomSize: '120-180 sq ft',
    coolingCapacity: '5,000 BTU/hr',
    recommendation: 'Most popular choice for bedrooms and living rooms in standard apartments.',
    icon: <Sun size={22} className="text-yellow-400" />,
  },
  {
    id: '2-ton',
    title: '2 Ton AC',
    description: 'Designed for large bedrooms, living rooms, conference rooms, or small shops.',
    idealRoomSize: '180-250 sq ft',
    coolingCapacity: '7,000 BTU/hr',
    recommendation: 'Best for larger spaces or rooms with high heat load due to sunlight or occupancy.',
    icon: <Gauge size={22} className="text-orange-400" />,
  },
  {
    id: 'inverter-ac',
    title: 'Inverter AC',
    description: 'Compressor adjusts speed based on cooling demand, saving energy demand temperature.',
    idealRoomSize: 'Varies by capacity (1T, 1.5T, 2T)',
    coolingCapacity: 'Same as fixed speed but more efficient',
    recommendation: 'Up to 30-50% energy savings compared to non-inverter models. Ideal for long-term usage.',
    icon: <Zap size={22} className="text-yellow-500" />,
  },
  {
    id: 'non-inverter-ac',
    title: 'Non-Inverter AC',
    description: 'Compressor runs at full speed or shuts off completely, leading to temperature fluctuations.',
    idealRoomSize: 'Varies by capacity (1T, 1.5T, 2T)',
    coolingCapacity: 'Same as inverter but less efficient',
    recommendation: 'Lower upfront cost but higher electricity bills. Suitable for short-term or occasional use.',
    icon: <BarChart2 size={22} className="text-gray-500" />,
  },
];

// Default Rental Plans Data
const DEFAULT_RENTAL_PLANS: RentalPlan[] = [
  {
    id: 'monthly',
    title: 'Monthly Plan',
    description: 'Flexible month-to-month rental with no long-term commitment.',
    price: 'Contact for Latest Price',
    features: [
      'Monthly payments',
      'No lock-in period',
      'Can cancel with 30 days notice',
      'Includes installation and maintenance',
      'Upgrade/downgrade anytime',
    ],
  },
  {
    id: 'seasonal',
    title: 'Seasonal Plan (Summer/Winter)',
    description: 'Cost-effective cooling for summer months or heating for winter months.',
    price: 'Contact for Latest Price',
    features: [
      'Fixed seasonal rate (3-4 months)',
      'Lower monthly cost than monthly plan',
      'Ideal for seasonal residents',
      'Includes installation and maintenance',
      'Equipment removed at end of season',
    ],
    popular: true,
  },
  {
    id: 'long-term',
    title: 'Long-Term Plan (Best Value)',
    description: 'Best value for extended stays with discounted rates.',
    price: 'Contact for Latest Price',
    features: [
      'Discounted monthly rate',
      'Minimum 6-month commitment',
      'Free relocation within service area',
      'Priority maintenance service',
      'Option to purchase at end of term',
    ],
  },
];

// Default Included Items Data
const DEFAULT_INCLUDED_ITEMS: IncludedItem[] = [
  { icon: <Wrench size={20} className="text-green-500" />, label: 'Installation' },
  { icon: <TrendingUp size={20} className="text-blue-500" />, label: 'Standard Copper Pipe' },
  { icon: <MapPin size={20} className="text-indigo-500" />, label: 'Outdoor Unit Mounting' },
  { icon: <Zap size={20} className="text-yellow-400" />, label: 'Testing & Commissioning' },
  { icon: <Activity size={20} className="text-violet-500" />, label: 'Remote Control' },
  { icon: <Headset size={20} className="text-pink-500" />, label: 'Support & Assistance' },
  { icon: <Repeat size={20} className="text-emerald-500" />, label: 'Maintenance Visits' },
  { icon: <Truck size={20} className="text-orange-500" />, label: 'Pickup Service' },
  { icon: <RefreshCw size={20} className="text-gray-500" />, label: 'Reinstallation (if applicable)' },
];

// Default FAQs Data
const DEFAULT_FAQS: FaqItem[] = [
  { question: 'How much does AC rent cost?', answer: 'Rental prices vary based on AC type (Split/Window), tonnage (1T/1.5T/2T), inverter/non-inverter, and rental duration (monthly/seasonal/long-term). Since prices depend on current stock, promotions, and specific requirements, we provide customized quotes after a quick assessment. Please contact us for the latest pricing and available offers.' },
  { question: 'Is installation included in the rent?', answer: 'Yes, professional installation by our certified technicians is included with all rental plans. We handle the complete setup: indoor unit mounting, outdoor unit placement, copper piping, drain pipe installation, electrical connection, gas charging, and thorough testing to ensure optimal cooling performance.' },
  { question: 'Do I need to pay a security deposit?', answer: 'A refundable security deposit may be applicable depending on your profile, rental duration, and the equipment value. The deposit amount, if any, will be clearly communicated before booking and is fully refundable after successful installation and equipment return, subject to normal wear and tear.' },
  { question: 'Which documents are required for AC rental?', answer: 'To process your AC rental, we typically require: 1) Valid government-issued photo ID (Aadhaar card, PAN card, passport, or driver’s license), 2) Proof of address (recent electricity bill, rent agreement, or Aadhaar with address), 3) Mobile number for contact and OTP verification. For corporate clients, we may additionally require company authorization and GST details.' },
  { question: 'What if the AC stops cooling during the rental period?', answer: 'If your rented AC experiences cooling issues, simply call our dedicated support line. We provide free diagnosis and repair services throughout the rental period. Our technician will visit your location to identify and fix the problem – whether it’s a gas leak, electrical issue, or component failure – at no extra cost to you.' },
  { question: 'Is maintenance free during the rental tenure?', answer: 'Yes, regular maintenance is included in your rental package. This includes periodic filter cleaning, coil inspection, gas level check, and overall performance testing. The frequency depends on usage and environmental conditions, but typically we schedule maintenance every 3-4 months for optimal efficiency and longevity.' },
  { question: 'Can I extend my rental duration?', answer: 'Absolutely! Rental extensions are subject to equipment availability and can be arranged easily. You can extend your rental period at any time by contacting our team. We’ll check availability, provide updated rates if applicable, and handle the paperwork seamlessly.' },
  { question: 'Can I change the AC model later?', answer: 'Yes, you can upgrade or downgrade your AC model during the rental period, subject to availability and possible rate adjustments. For example, you might start with a 1-ton window AC and later upgrade to a 1.5-ton split inverter AC as your needs change. Our team will assist with the exchange process.' },
  { question: 'How much electricity does a rented AC consume?', answer: 'Electricity consumption depends on the AC’s star rating, tonnage, usage patterns, and temperature settings. Inverter ACs typically consume 30-50% less power than non-inverter models of the same capacity. We provide BEE star-rated equipment and can estimate approximate monthly electricity costs based on your usage habits during consultation.' },
  { question: 'Window AC vs Split AC – which is better for renting?', answer: 'Window ACs are generally more affordable to rent and install, making them ideal for short-term stays or rooms with suitable window openings. Split ACs offer quieter operation, better aesthetics, and higher energy efficiency, preferred for longer rentals, bedrooms, and living rooms. Our technicians assess your room structure and requirements to recommend the best fit.' },
  { question: 'Do you provide ACs for commercial offices?', answer: 'Yes, we provide AC rental services for offices, shops, clinics, and other commercial establishments. We offer suitable capacities (1.5T, 2T, or higher) based on your space size, occupancy, and heat load. Commercial rentals may include additional features like stabilizers and extended warranties on compressors.' },
  { question: 'Are the ACs new or used?', answer: 'All our rental ACs are either new or like-new, well-maintained units from reputable brands (LG, Samsung, Voltas, Blue Star, Daikin, etc.). Each unit undergoes thorough inspection, sanitization, and performance testing before being rented out to ensure hygiene and optimal cooling efficiency.' },
  { question: 'How soon can I get the AC installed after booking?', answer: 'We strive for same-day or next-day installation in most cases within our service area (Gaur City, Noida Extension, Greater Noida West). After booking, our team conducts a quick site feasibility check (often virtual) and schedules the installation at your preferred time slot.' },
  { question: 'What happens if I need to relocate the AC?', answer: 'If you need to move the AC to another room within the same property, our technician can perform reinstallation for a nominal charge covering labor and materials. If you’re moving to a new address within our service area, we offer discounted relocation services as part of our customer care.' },
  { question: 'Do you provide ACs for events or temporary setups?', answer: 'Yes, we offer short-term AC rentals for events, exhibitions, temporary offices, and construction sites. Depending on the requirement, we can provide window ACs, split ACs, or even portable units with quick setup and dismantling services.' },
  { question: 'What brands of AC do you offer for rent?', answer: 'We maintain a diverse inventory of leading brands including LG, Samsung, Voltas, Blue Star, Daikin, Hitachi, Godrej, and Whirlpool. Brand availability depends on current stock, but we always ensure BEE star-rated models for energy efficiency and reliable performance.' },
  { question: 'Is there a minimum rental period?', answer: 'The minimum rental period is typically one month for our monthly plan. For seasonal plans, the minimum is usually 3 months (summer or winter season). Long-term plans require a minimum of 6 months to avail discounted rates. We offer flexibility based on availability and mutual agreement.' },
  { question: 'How do I terminate the rental agreement early?', answer: 'Early termination is possible subject to terms and conditions. You may need to provide notice (usually 15-30 days) and could be liable for early termination fees or a portion of the remaining rent, depending on how much of the rental period has elapsed. Our team will clarify the exact terms during the agreement process.' },
  { question: 'What happens at the end of the rental period?', answer: 'At the end of your rental term, our team will visit to uninstall the AC, perform a final inspection, and process any applicable security deposit refund. You have the option to renew the rental, upgrade to a different model, or return the equipment. We ensure a hassle-free pickup and site cleanup.' },
  { question: 'Do you provide ACs for hospitals or nursing homes?', answer: 'Yes, we supply ACs for healthcare facilities subject to meeting specific medical-grade air quality requirements if needed. We consult with the facility management to determine the appropriate tonnage, airflow, and filtration standards. Regular sanitization and maintenance protocols are followed for such sensitive environments.' },
  { question: 'Are there any hidden charges in AC rental?', answer: 'No, we believe in transparent pricing. The rental quote includes the equipment, standard installation, and maintenance as described. Any additional charges (such as extra copper pipe beyond standard length, wall cutting for difficult installations, or optional accessories) are clearly communicated and approved before proceeding with the installation.' },
];

export const ACOnRentPage: React.FC<{ businessConfig: BusinessConfig }> = ({ businessConfig }) => {
  const [acTypes] = useState<AcType[]>(AC_ON_RENT_AC_TYPES);
  const [rentalPlans, setRentalPlans] = useState<RentalPlan[]>([]);
  const [includedItems, setIncludedItems] = useState<IncludedItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const phone = businessConfig.contacts[0];
  const whatsappMsg = encodeURIComponent('Hello, I want to know about AC on Rent in Gaur City / Noida Extension.');
  const whatsappUrl = `https://wa.me/91${phone}?text=${whatsappMsg}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let fetchedPlans: RentalPlan[] = [];
        let fetchedIncluded: IncludedItem[] = [];
        let fetchedFaqs: FaqItem[] = [];

        // Check if cached data exists in localStorage
        const localPlans = localStorage.getItem('ks_rental_plans');
        if (localPlans) {
          try {
            const parsed = JSON.parse(localPlans);
            if (Array.isArray(parsed)) {
              fetchedPlans = parsed as RentalPlan[];
            }
          } catch (e) {
            console.warn('Failed to parse rental plans from localStorage', e);
          }
        }

        const localIncluded = localStorage.getItem('ks_ac_included_items');
        if (localIncluded) {
          try {
            const parsed = JSON.parse(localIncluded);
            if (Array.isArray(parsed)) {
              if (parsed.every(item => item.icon && item.label)) {
                fetchedIncluded = parsed as IncludedItem[];
              }
            }
          } catch (e) {
            console.warn('Failed to parse included items from localStorage', e);
          }
        }

        const localFaqs = localStorage.getItem('ks_ac_faqs');
        if (localFaqs) {
          try {
            const parsed = JSON.parse(localFaqs);
            if (Array.isArray(parsed)) {
              if (parsed.every(item => typeof item.question === 'string' && typeof item.answer === 'string')) {
                fetchedFaqs = parsed as FaqItem[];
              }
            }
          } catch (e) {
            console.warn('Failed to parse FAQs from localStorage', e);
          }
        }

        // Fallback to defaults
        if (fetchedPlans.length === 0) {
          fetchedPlans = DEFAULT_RENTAL_PLANS;
        }
        if (fetchedIncluded.length === 0) {
          fetchedIncluded = DEFAULT_INCLUDED_ITEMS;
        }
        if (fetchedFaqs.length === 0) {
          fetchedFaqs = DEFAULT_FAQS;
        }

        setRentalPlans(fetchedPlans);
        setIncludedItems(fetchedIncluded);
        setFaqs(fetchedFaqs);
        setError(null);
      } catch (err) {
        console.error('Error fetching AC rental data:', err);
        setError('Failed to load some data. Please try again later.');
        setRentalPlans(DEFAULT_RENTAL_PLANS);
        setIncludedItems(DEFAULT_INCLUDED_ITEMS);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessConfig]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Helper function to generate FAQ schema JSON-LD
  const generateFaqSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  };

  // Generate LocalBusiness schema for SEO
  const generateLocalBusinessSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: businessConfig.name,
      image: [
        getAssetPath(businessConfig.logoUrl),
        getAssetPath('/ac-rental-gaur-city.png'),
        getAssetPath('/ac-rental-noida-extension.png'),
      ],
      description: 'Professional AC rental services in Gaur City, Noida Extension, Greater Noida West. We offer Split AC, Window AC, 1Ton, 1.5Ton, 2Ton, Inverter and Non-Inverter ACs on rent with installation, maintenance, and support.',
      telephone: `+91${businessConfig.contacts[0]}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Gaur City 1',
        addressLocality: 'Greater Noida West',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201301',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '28.4744',
        longitude: '77.5040',
      },
      url: 'https://kselectrical.in',
      sameAs: [
        'https://www.facebook.com/kselectrical',
        'https://www.instagram.com/kselectrical',
        'https://twitter.com/kselectrical',
      ],
      priceRange: '₹499 - ₹4999 per month',
      servesCustomerType: 'Residential and Commercial',
      award: 'Trusted AC Rental Provider in Noida Extension',
      brand: {
        '@type': 'Brand',
        name: businessConfig.name,
      },
      offers: {
        '@type': 'Offer',
        name: 'AC on Rent',
        description: 'Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton, Inverter AC with installation, maintenance, and support.',
      },
    };
  };

  // Generate Service schema for the AC rental service
  const generateServiceSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AC Rental Service',
      provider: {
        '@type': 'LocalBusiness',
        name: businessConfig.name,
        url: 'https://kselectrical.in',
        telephone: `+91${businessConfig.contacts[0]}`,
      },
      areaServed: [
        'Gaur City 1',
        'Gaur City 2',
        'Noida Extension',
        'Greater Noida West',
        'Ghaziabad',
        'Ace City',
        'Fusion Homes',
        'Eco Village',
        'Cherry County',
        'Nirala Estate',
        'Techzone IV',
        'Siddharth Vihar',
        'Crossings Republik',
        'Sector 1',
        'Sector 4',
        'Sector 16B',
        'Bisrakh',
        'Shahberi',
      ],
      offers: {
        '@type': 'Offer',
        name: 'AC on Rent',
        description: 'Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton, Inverter AC with installation, maintenance, and support.',
      },
    };
  };

  // Generate Breadcrumb schema
  const generateBreadcrumbSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://kselectrical.in/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: 'https://kselectrical.in/services',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'AC on Rent',
          item: 'https://kselectrical.in/ac-on-rent',
        },
      ],
    };
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>AC on Rent in Gaur City | Noida Extension | Greater Noida West - KS Electrical</title>
          <meta name="description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available." />
          <link rel="canonical" href="https://kselectrical.in/ac-on-rent" />
          <meta property="og:title" content="AC on Rent in Gaur City | Noida Extension | Greater Noida West" />
          <meta property="og:description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available." />
          <meta property="og:image" content="https://kselectrical.in/ac-rental-gaur-city.png" />
          <meta property="og:url" content="https://kselectrical.in/ac-on-rent" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AC on Rent in Gaur City | Noida Extension | Greater Noida West" />
          <meta name="twitter:description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available." />
        </Helmet>

        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-8">
              <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl animate-pulse"></div>
              <div className="grid gap-6">
                <div className="h-56 bg-white rounded-xl animate-pulse"></div>
                <div className="h-56 bg-white rounded-xl animate-pulse"></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-52 bg-white rounded-xl animate-pulse"></div>
                  <div className="h-52 bg-white rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>AC on Rent in Gaur City | Noida Extension | Greater Noida West - KS Electrical</title>
          <meta name="description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available." />
          <link rel="canonical" href="https://kselectrical.in/ac-on-rent" />
          <meta property="og:title" content="AC on Rent in Gaur City | Noida Extension | Greater Noida West" />
          <meta property="og:description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available." />
          <meta property="og:image" content="https://kselectrical.in/ac-rental-gaur-city.png" />
          <meta property="og:url" content="https://kselectrical.in/ac-on-rent" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>

        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-xl p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Home size={20} />
                  <span>Go to Homepage</span>
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Loader2 size={20} className="animate-spin" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>AC on Rent in Gaur City | Noida Extension | Greater Noida West | KS Electrical</title>
        <meta name="description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available. Low upfront cost, flexible plans ideal for tenants, students, families, offices." />
        <link rel="canonical" href="https://kselectrical.in/ac-on-rent" />
        <meta property="og:title" content="AC on Rent in Gaur City | Noida Extension | Greater Noida West | KS Electrical" />
        <meta property="og:description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available. Low upfront cost, ideal for tenants, students, families, offices." />
        <meta property="og:image" content="https://kselectrical.in/ac-rental-gaur-city.png" />
        <meta property="og:url" content="https://kselectrical.in/ac-on-rent" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AC on Rent in Gaur City | Noida Extension | Greater Noida West | KS Electrical" />
        <meta name="twitter:description" content="Affordable AC on rent services in Gaur City, Noida Extension, Greater Noida West. Rent Split AC, Window AC, 1Ton, 1.5Ton, 2Ton ACs with installation, maintenance & support. Same day delivery available. Low upfront cost, ideal for tenants, students, families, offices." />
        <script type="application/ld+json">{JSON.stringify(generateLocalBusinessSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(generateServiceSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(generateBreadcrumbSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(generateFaqSchema())}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Services', path: '/services' },
            { label: 'AC on Rent' }
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-12 text-left">
            <h1 className="text-3xl font-black text-gray-900 mb-2">AC on Rent in Greater Noida West | Noida Extension | Gaur City</h1>
            <p className="text-lg text-gray-600 max-w-2xl font-medium">
              Affordable Split AC & Window AC Rental with Installation, Service & Support.
            </p>
          </div>

          {/* Hero Section with CTAs */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 sm:p-12 text-left">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Snowflake size={24} className="text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Stay Cool Without the Upfront Cost</h2>
                </div>
                <p className="text-gray-700 font-medium max-w-3xl leading-relaxed">
                  Enjoy premium cooling solutions without the burden of purchase. Our AC rental service includes delivery, professional installation, regular maintenance, and 24/7 support - all for a simple monthly fee.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href={`tel:${businessConfig.contacts[0]}`}
                    className="flex-1 md:flex-none bg-[#F97316] hover:bg-[#F97316]/90 text-white font-bold px-6 py-3.5 rounded-lg transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Phone size={14} />
                    <span>Call Now: +91 {phone}</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-lg transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Us</span>
                  </a>
                  <Link
                    to="/checkout"
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-lg transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Book AC on Rent</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Why Rent an AC? */}
          <section className="mb-16 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Choose AC on Rent?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <DollarSignIcon size={24} className="mt-1 text-blue-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Low Upfront Cost</h3>
                    <p className="text-gray-600 text-sm">No large initial investment required. Preserve your capital for other expenses while enjoying premium cooling comfort.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <Users size={24} className="mt-1 text-green-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Ideal for Tenants & Students</h3>
                    <p className="text-gray-600 text-sm">Perfect for rental homes, PG accommodations, and student housing where purchasing isn't practical or allowed.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <RefreshCw size={24} className="mt-1 text-yellow-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Flexible & Convenient</h3>
                    <p className="text-gray-600 text-sm">Upgrade, downgrade, or return anytime. Perfect for seasonal needs, temporary offices, or changing requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Available AC Types */}
          <section className="mb-16 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Available AC Types for Rent</h2>
            <p className="text-gray-600 mb-6 font-medium">
              Choose from our wide range of AC options to perfectly match your cooling needs and room size.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acTypes.map((acType) => (
                <div
                  key={acType.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:-translate-y-[2px]"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
                      {acType.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base">{acType.title}</h3>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{acType.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs pt-2 border-t border-slate-50">
                    <div className="flex items-center space-x-2">
                      <Home size={14} className="text-gray-400 shrink-0" />
                      <span className="font-bold text-gray-700">{acType.idealRoomSize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Snowflake size={14} className="text-gray-400 shrink-0" />
                      <span className="font-bold text-gray-700">{acType.coolingCapacity}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                      <span className="font-bold text-gray-700">{acType.recommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Rental Plans */}
          <section className="mb-16 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Flexible Rental Plans</h2>
            <p className="text-gray-600 mb-6 font-medium">
              Choose a plan that fits your lifestyle and budget. All plans include installation, maintenance, and support.
            </p>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              {rentalPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all transform hover:-translate-y-[2px] relative flex flex-col justify-between ${
                    plan.popular ? 'border-2 border-blue-500' : 'border-gray-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-extrabold text-gray-900 text-lg">{plan.title}</h3>
                      {plan.popular && (
                        <span className="bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{plan.description}</p>

                    {/* Price Section */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Rental Cost</p>
                      <p className="text-xl font-black text-gray-900">{plan.price}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs font-semibold">
                          <CheckCircle size={15} className="mt-0.5 text-green-500 shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`tel:${businessConfig.contacts[0]}`}
                    className="w-full inline-flex items-center justify-center space-x-2 font-bold px-4 py-3 rounded-xl transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  >
                    <Phone size={13} />
                    <span>Inquire Now</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section className="mb-16 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">What's Included in Your Rental</h2>
            <p className="text-gray-600 mb-6 font-medium">
              Enjoy peace of mind with our all-inclusive rental service. Everything you need for perfect cooling is included.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {includedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3.5 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-900 font-extrabold text-sm">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Areas We Serve */}
          <section className="mb-16 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Areas We Serve</h2>
            <p className="text-gray-600 mb-6 font-medium">
              Our AC rental services are available across Greater Noida West and surrounding areas. We provide prompt same-day service and support in all these locations:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-sm uppercase tracking-wider text-blue-600">Primary Service Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {['Gaur City 1', 'Gaur City 2', 'Noida Extension', 'Greater Noida West', 'Ghaziabad'].map((area, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-sm uppercase tracking-wider text-emerald-600">Premium Residential Societies</h3>
                <div className="flex flex-wrap gap-2">
                  {['Techzone IV', 'Sector 1', 'Sector 4', 'Sector 16B', 'Crossing Republik', 'Bisrakh', 'Shahberi', 'Ace City', 'Fusion Homes', 'Eco Village', 'Cherry County', 'Nirala Estate', 'Siddharth Vihar'].map((area, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 font-medium">
              Don't see your area listed?{' '}
              <Link to="/local-landing" className="text-blue-600 hover:text-blue-700 underline font-bold">
                View all service areas →
              </Link>
            </p>
          </section>

          {/* Frequently Asked Questions Accordion */}
          <section className="mb-16 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-8 font-medium">
              Find answers to common questions about our AC rental service. If you don't see your question here, feel free to contact us directly.
            </p>
            <div className="space-y-4 max-w-4xl">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                    >
                      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base pr-4 flex-1">{faq.question}</h3>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-brand-orange' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-${index}`}
                        className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-slate-50 pt-4"
                      >
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Rental Terms & Conditions */}
          <section className="mb-16 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Rental Terms & Conditions</h2>
            <p className="text-gray-600 mb-6 font-medium">
              Please read our rental terms carefully before booking. These terms ensure a transparent and smooth rental experience for both parties.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Eligibility */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Eligibility & Documentation</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    To avail our AC rental service, customers must provide:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Valid Government ID (Aadhaar, PAN, Passport, or Driver's License)</li>
                    <li>Proof of Address (recent utility bill, rent agreement, or Aadhaar with address)</li>
                    <li>Active Mobile Number for OTP verification and communication</li>
                    <li>Rental Agreement (if required based on duration and equipment value)</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-400 font-medium">
                    We serve both residential and commercial clients. Corporate clients may need to provide additional authorization documents.
                  </p>
                </div>
              </div>

              {/* Security Deposit */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Security Deposit</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    A refundable security deposit may be applicable based on customer profile, rental duration, and equipment value:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Deposit amount varies and is clearly communicated before booking</li>
                    <li>Fully refundable after successful equipment return and inspection</li>
                    <li>Refund processed within 7-10 business days via original payment method</li>
                    <li>Normal wear and tear (expected deterioration from proper use) is not charged</li>
                  </ul>
                </div>
              </div>

              {/* Rental Period */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Rental Period Options</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    We offer flexible rental periods to suit different needs and budgets:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li><strong>Monthly Plan:</strong> Minimum 1 month, renewable monthly with 30-day notice for termination</li>
                    <li><strong>Seasonal Plan:</strong> Minimum 3 months (summer/winter season), ideal for temporary residents</li>
                    <li><strong>Long-Term Plan:</strong> Minimum 6 months for best value pricing with additional benefits</li>
                  </ul>
                </div>
              </div>

              {/* Installation */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Installation Service</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    Professional installation is included with all rental plans:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Standard installation includes indoor unit mounting and outdoor unit placement</li>
                    <li>Extra charges may apply for: extra copper pipe, wall drilling, or specialized stands</li>
                    <li>All electrical work complies with local safety standards and regulations</li>
                    <li>System testing and demonstration completed before technician departure</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-400 font-medium">
                    Installation typically takes 2-4 hours depending on AC type and complexity.
                  </p>
                </div>
              </div>

              {/* Maintenance & Support */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Maintenance & Support</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    Regular maintenance and breakdown support are included throughout your rental period:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Scheduled maintenance every 3-4 months includes filter cleaning and coil inspection</li>
                    <li>Breakdown support: Free technician visit for any cooling issues during rental period</li>
                    <li>Gas refill and recharging included if required due to normal usage</li>
                    <li>Hotline support for urgent repair issues</li>
                  </ul>
                </div>
              </div>

              {/* Customer Responsibilities */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Customer Responsibilities</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    To ensure optimal performance and avoid unnecessary charges, customers agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Use only the specified voltage and avoid voltage fluctuations</li>
                    <li>Not relocate or reinstall the AC unit without professional assistance</li>
                    <li>Clean or wash filters regularly as instructed (typically every 2-4 weeks)</li>
                    <li>Report any issues promptly to prevent minor problems from becoming major</li>
                    <li>Ensure proper airflow around both indoor and outdoor units</li>
                  </ul>
                </div>
              </div>

              {/* Damage Policy */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Damage & Misuse Policy</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    While normal wear and tear is expected, customers are responsible for damages resulting from misuse:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Physical damage to units (dents, cracks, broken parts from impact)</li>
                    <li>Missing accessories (remotes, drain pipes, mounting kits)</li>
                    <li>Broken or damaged remote controls</li>
                    <li>Intentional misuse or tampering with equipment</li>
                    <li>Damage from unauthorized repairs or modifications</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed italic">
                    Normal wear and tear includes: fading of exterior finish, minor surface scratches, expected performance degradation over time, and component wear from proper usage.
                  </p>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Cancellation & Return Policy</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    Understand your options for ending the rental agreement:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li><strong>Before Installation:</strong> Full refund of any advance payment</li>
                    <li><strong>After Installation:</strong> Prorated refund based on unused period, subject to minimum term</li>
                    <li><strong>Early Return:</strong> Available with notice; charges may apply for unused portion of plan</li>
                    <li><strong>End of Term:</strong> Option to renew, upgrade, downgrade, or return equipment</li>
                  </ul>
                </div>
              </div>

              {/* Extension Policy */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Extension & Renewal Policy</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    Extend your rental seamlessly as your needs change or evolve:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Extensions subject to equipment availability at time of request</li>
                    <li>Can be arranged at any point during the active rental period</li>
                    <li>Rates for extension term discussed and agreed upon in advance</li>
                    <li>Option to upgrade/downgrade AC model during extension</li>
                    <li>No penalty for extending within the same plan type</li>
                  </ul>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-extrabold text-gray-900 mb-4 text-base">Payment Terms & Billing</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    Transparent and convenient payment options for hassle-free service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 text-xs font-semibold">
                    <li>Monthly billing cycle with payment due at start of each period</li>
                    <li>Accepted payment methods: UPI, bank transfer, credit/debit cards, cash</li>
                    <li>Advance payment may be required for first month or security deposit</li>
                    <li>GST invoice provided for all transactions as per applicable regulations</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-400 font-medium">
                    We send payment reminders 3 days before due date to avoid any service interruption.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="mb-16 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Stay Cool?</h2>
              <p className="text-lg text-gray-600 mb-6 font-medium max-w-2xl mx-auto">
                Experience premium cooling without the upfront investment. Our team is ready to help you choose the perfect AC solution for your needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={`tel:${businessConfig.contacts[0]}`}
                  className="flex-1 md:flex-none bg-[#F97316] hover:bg-[#F97316]/90 text-white font-bold px-6 py-3.5 rounded-lg transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Phone size={14} />
                  <span>Call Now: +91 {phone}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-lg transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Us</span>
                </a>
                <Link
                  to="/checkout"
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-lg transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>Book Your AC Rental</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ACOnRentPage;

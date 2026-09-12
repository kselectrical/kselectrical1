import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.kselectrical.in';

const staticRoutes = [
  '/',
  '/sell-old-ac',
  '/ac-on-rent',
  '/services',
  '/about',
  '/contact',
  '/faq',
  '/reviews',
  '/blog',
  '/careers',
  '/privacy-policy',
  '/terms-and-cond',
  '/anti-discrimination',
  '/emergency-electrician',
  '/we-serve',
  '/book',
  '/shop'
];

// Primary category landing routes (Rate Cards)
const serviceCategoryRoutes = [
  '/services/ac-service',
  '/services/ro-service',
  '/services/electrician-service',
  '/services/washing-machine-repair',
  '/services/refrigerator-repair',
  '/services/chimney-service',
  '/services/geyser-service',
  '/services/fan-service',
  '/services/light-service',
  '/services/home-installations',
  '/services/microwave-service'
];

// 55 Specific core service detail pages (from serviceCatalog)
const coreServiceDetailRoutes = [
  '/services/ac-uninstallation',
  '/services/ac-jet-wash',
  '/services/ac-gas-refill',
  '/services/fan-installation',
  '/services/fan-uninstallation',
  '/services/fan-repair',
  '/services/bldc-fan-installation',
  '/services/bldc-fan-uninstallation',
  '/services/bldc-fan-service',
  '/services/decorative-fan-installation',
  '/services/decorative-fan-uninstallation',
  '/services/decorative-fan-repair',
  '/services/bulb-holder-installation',
  '/services/bulb-holder-repair',
  '/services/tube-light-installation',
  '/services/tube-light-repair',
  '/services/tube-light-uninstallation',
  '/services/decorative-wall-light-installation',
  '/services/decorative-light-repair',
  '/services/ceiling-panel-light-installation',
  '/services/chandelier-installation',
  '/services/ceiling-light-repair',
  '/services/switch-socket-repair',
  '/services/switchboard-repair',
  '/services/new-switchbox-installation',
  '/services/mcb-upgrade',
  '/services/house-wiring-tracing',
  '/services/doorbell-intercom-repair',
  '/services/inverter-battery-service',
  '/services/ro-repair',
  '/services/ro-filter-service',
  '/services/ro-installation',
  '/services/ro-uninstallation',
  '/services/washing-machine-repair-diagnostics',
  '/services/washing-machine-installation',
  '/services/washing-machine-uninstallation',
  '/services/washing-machine-deep-clean',
  '/services/geyser-repair',
  '/services/geyser-maintenance',
  '/services/geyser-installation',
  '/services/geyser-uninstallation',
  '/services/refrigerator-repair-diagnostics',
  '/services/single-door-fridge-gas-charging',
  '/services/double-door-fridge-gas-charging',
  '/services/refrigerator-deep-cleaning',
  '/services/microwave-repair',
  '/services/microwave-cleaning',
  '/services/kitchen-chimney-repair',
  '/services/kitchen-chimney-installation',
  '/services/kitchen-chimney-uninstallation',
  '/services/kitchen-chimney-service',
  '/services/balcony-pigeon-net-installation',
  '/services/plumbing-utilities',
  '/services/carpentry-adjustments-repairs',
  '/services/gypsum-false-ceiling-service'
];

const blogRoutes = [
  '/blog/how-often-should-we-do-ac-service',
  '/blog/why-ac-cooling-drops',
  '/blog/ro-water-purifier-maintenance-guide',
  '/blog/summer-ac-maintenance-tips',
  '/blog/ac-gas-leakage-reasons-solutions-noida-extension',
  '/blog/best-balcony-pigeon-netting-guide-gaur-city',
  '/blog/short-circuit-mcb-tripping-prevention-tips'
];

// 11 Core Service Categories x 10 High-Intent Regional Hubs (110 curated local routes)
const localServices = [
  'ac-service',
  'ro-service',
  'electrician-service',
  'washing-machine-repair',
  'refrigerator-repair',
  'chimney-service',
  'geyser-service',
  'fan-service',
  'light-service',
  'home-installations',
  'microwave-service'
];

const localLocations = [
  'gaur-city-1',
  'gaur-city-2',
  'noida-extension',
  'greater-noida-west',
  'crossings-republik',
  'indirapuram',
  'vaishali',
  'vasundhara',
  'raj-nagar-extension',
  'noida-sector-62'
];

const localLandingRoutes = [];
localServices.forEach(srv => {
  localLocations.forEach(loc => {
    localLandingRoutes.push(`/services/${srv}/${loc}`);
  });
});

function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add service category rate card routes
  serviceCategoryRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
    xml += '  </url>\n';
  });

  // Add 55 specific core service detail routes
  coreServiceDetailRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.85</priority>\n';
    xml += '  </url>\n';
  });

  // Add blog routes
  blogRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.75</priority>\n';
    xml += '  </url>\n';
  });

  // Add local landing routes
  localLandingRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.85</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  const distDir = path.join(__dirname, '../dist');
  
  // Make sure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`Sitemap generated successfully at ${sitemapPath}!`);

  // Also write to public/sitemap.xml for development/static persistence
  const publicSitemapPath = path.join(__dirname, '../public/sitemap.xml');
  try {
    fs.writeFileSync(publicSitemapPath, xml);
    console.log(`Sitemap mirrored to ${publicSitemapPath}!`);
  } catch {
    // Ignore error if public dir not writable
  }

  // Generate 404.html routing fallback for GitHub Pages
  const indexPath = path.join(distDir, 'index.html');
  const fallbackPath = path.join(distDir, '404.html');
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, fallbackPath);
    console.log(`Routing fallback 404.html generated successfully at ${fallbackPath}!`);
  } else {
    console.warn(`Warning: index.html not found at ${indexPath}. Could not generate 404.html.`);
  }
}

generateSitemap();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.kselectrical.in';

const staticRoutes = [
  '/',
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
];

const serviceRoutes = [
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

const blogRoutes = [
  '/blog/how-often-should-we-do-ac-service',
  '/blog/why-ac-cooling-drops',
  '/blog/ro-water-purifier-maintenance-guide',
  '/blog/summer-ac-maintenance-tips',
  '/blog/ac-gas-leakage-reasons-solutions-noida-extension',
  '/blog/best-balcony-pigeon-netting-guide-gaur-city',
  '/blog/short-circuit-mcb-tripping-prevention-tips'
];

// Generate dynamic local landing routes (13 services x 38 locations)
const localServices = [
  'ac-service',
  'ac-repair',
  'ac-installation',
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
  // Greater Noida West / Gaur City priority areas
  'gaur-city-1',
  'gaur-city-2',
  'noida-extension',
  'greater-noida-west',
  'ace-city',
  'ace-divino',
  'fusion-homes',
  'mahagun-mywoods',
  'palm-olympia',
  'supertech-eco-village-1',
  'supertech-eco-village-2',
  'supertech-eco-village-3',
  'cherry-county',
  'ajnara-homes',
  'nirala-estate',
  'la-residentia',
  'panchsheel-greens',
  'stellar-jeevan',
  // Greater Noida sectors
  'alpha-1',
  'alpha-2',
  'beta-1',
  'beta-2',
  'delta-1',
  'delta-2',
  'pari-chowk',
  'surajpur',
  'dadri',
  // Noida priority sectors
  'noida-sector-62',
  'noida-sector-15',
  'noida-sector-50',
  'noida-sector-76',
  'noida-sector-137',
  // Ghaziabad priority areas
  'indirapuram',
  'vaishali',
  'vasundhara',
  'kaushambi',
  'raj-nagar-extension',
  'crossings-republik'
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

  // Add service category routes
  serviceRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
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

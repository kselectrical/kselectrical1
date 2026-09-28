import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clarity?: (...args: any[]) => void;
  }
}

// ── Admin / internal paths that should be excluded from analytics ──────────
const ANALYTICS_EXCLUDED_PATHS = ['/admin', '/customer/dashboard', '/technician/dashboard'];

const isAdminPath = (pathname: string): boolean =>
  ANALYTICS_EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

// ── Shared GA4 Lead Event Tracker ──────────────────────────────────────────
// Call this on every WhatsApp / Call / lead button click site-wide.
export const trackLeadEvent = (params: {
  method: 'whatsapp' | 'call' | 'form';
  service?: string;
  page?: string;
}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'lead',
      event_label: params.method,
      method: params.method,
      service_name: params.service ?? 'general',
      page_path: params.page ?? window.location.pathname,
    });
  }
};

// ── ScrollToTop + SPA Page View Tracker ───────────────────────────────────
export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Always scroll to top on route change
    window.scrollTo(0, 0);

    // Skip all analytics for admin / internal paths — prevents polluting
    // real user data with admin session activity.
    if (isAdminPath(pathname)) {
      // Pause Microsoft Clarity session recording on admin pages
      if (typeof window.clarity === 'function') {
        window.clarity('stop');
      }
      return;
    }

    // Send GA4 page_view event for SPA navigation
    // index.html loads gtag with send_page_view: false,
    // so we manually fire page_view on every route change (including initial load).
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pathname + search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;

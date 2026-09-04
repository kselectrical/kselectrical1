import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-ZR2NN7MKH3', {
        page_path: pathname + search,
      });
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;

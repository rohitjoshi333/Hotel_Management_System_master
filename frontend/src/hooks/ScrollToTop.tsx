import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      window.scrollTo({
        top: 0,
        behavior: isMobile ? "auto" : "smooth", // smooth for desktop, auto for mobile
      });
    };

    // Delay ensures all images and content are loaded
    const timeout = setTimeout(scrollToTop, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

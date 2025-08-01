import { useEffect, useRef } from 'react';

export const useScrollReset = (resetCallback: () => void) => {
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
      
      if (!ticking.current) {
        requestAnimationFrame(() => {
          // Reset when scrolling back to top (within 100px)
          if (lastScrollY.current < 100) {
            resetCallback();
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // Reset on page load/refresh
    resetCallback();

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [resetCallback]);
}; 
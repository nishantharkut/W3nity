import { useState, useEffect, useRef } from 'react';

interface UseCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

export const useCounter = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0,
  suffix = '',
  prefix = ''
}: UseCounterProps) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            setIsAnimating(true);
            
            setTimeout(() => {
              const startTime = Date.now();
              const animate = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentCount = Math.floor(start + (end - start) * easeOutQuart);
                
                setCount(currentCount);
                
                if (progress < 1) {
                  requestAnimationFrame(animate);
                }
              };
              
              requestAnimationFrame(animate);
            }, delay);
          }
        });
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [end, start, duration, delay, isAnimating]);

  const resetAnimation = () => {
    setCount(start);
    setIsAnimating(false);
    // Reset the observer to allow re-triggering
    if (observerRef.current && elementRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(elementRef.current);
    }
  };

  const formattedCount = `${prefix}${count.toLocaleString()}${suffix}`;

  return {
    count,
    formattedCount,
    isAnimating,
    resetAnimation,
    elementRef
  };
}; 
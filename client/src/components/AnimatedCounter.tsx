import React from 'react';
import { useCounter } from '@/hooks/useCounter';
import { LucideIcon } from 'lucide-react';

interface AnimatedCounterProps {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export const AnimatedCounter = ({
  label,
  value,
  icon: Icon,
  suffix = '',
  prefix = '',
  duration = 2000,
  delay = 0,
  className = '',
  onReset
}: AnimatedCounterProps & { onReset?: () => void }) => {
  const { formattedCount, elementRef, resetAnimation, isAnimating, count } = useCounter({
    end: value,
    duration,
    delay,
    suffix,
    prefix
  });

  // Expose reset function to parent
  React.useEffect(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  return (
    <div ref={elementRef} className={`text-center ${className}`}>
      <div className="flex justify-center mb-2">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className={`text-3xl font-bold text-gradient ${count === value ? 'counter-pulse' : ''}`}>
        {formattedCount}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}; 
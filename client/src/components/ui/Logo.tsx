import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant: 'navbar' | 'footer';
  height?: string; 
}

const Logo: React.FC<LogoProps> = ({ variant, height = 'h-10' }) => {

    const handleClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const logoSrc =
    variant === 'navbar'
      ? '/assets/w3nitylogo.png'
      : '/assets/w3nitylogo2.png';

  return (
    <Link to="/" onClick={handleClick} className="flex items-center space-x-2">
      <img
        src={logoSrc}
        alt="FinPilot Logo"
        className={`${height} w-auto object-contain transition-transform hover:scale-105 duration-200 dark:brightness-90`}
      />
    </Link>
  );
};

export default Logo;

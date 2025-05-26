
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedGigs from '@/components/home/FeaturedGigs';
import FeaturedEvents from '@/components/home/FeaturedEvents';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedGigs />
      <FeaturedEvents />
    </div>
  );
};

export default Home;

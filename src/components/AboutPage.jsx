import React, { useEffect } from 'react';
import AboutHeroSection from './AboutHeroSection';
import ValuesSection from './ValuesSection';
import LookingAheadSection from './LookingAheadSection';

const AboutPage = () => {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <AboutHeroSection />
      <ValuesSection />
      <LookingAheadSection />
    </div>
  );
};

export default AboutPage;

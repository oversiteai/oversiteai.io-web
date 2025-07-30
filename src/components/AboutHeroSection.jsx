import React from 'react';

const AboutHeroSection = () => {
  return (
    <section className="about-hero-section">
      <div className="about-hero-container">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <div className="about-hero-badge">
              <span>Built for energy. Designed for clarity.</span>
            </div>
            
            <div className="about-hero-heading">
              <h1>
                <span className="text-white">About </span>
                <span className="gradient-text">OverSiteAI</span>
              </h1>
            </div>
            
            <div className="about-hero-description">
              <p>
                We're not just building tools. We're building trust in high-risk environments. 
                OverSiteAI brings together AI, edge computing, and real-time sensor intelligence 
                to uncover blind spots in oil and gas operations. We give field teams and leaders 
                a shared view of what's really happening.
              </p>
            </div>
          </div>
        </div>
        
        <div className="about-hero-visual">
          <div className="hero-blur-effect"></div>
          <div className="hero-visual-container">
            <img 
              src="images/industrial_monitoring.png" 
              alt="Industrial monitoring" 
              className="hero-image-1"
            />
            <img 
              src="images/sensor_technology.png" 
              alt="Sensor technology" 
              className="hero-image-2"
            />
            <img 
              src="images/field_operations.png" 
              alt="Field operations" 
              className="hero-image-3"
            />
            <img 
              src="images/logo_overlay.png" 
              alt="OverSiteAI Logo" 
              className="hero-logo-overlay"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;

import React from 'react';

const LookingAheadSection = () => {
  return (
    <section className="looking-ahead-section">
      {/* Background decorative elements */}
      <div className="looking-ahead-bg">
        <img 
          src="images/bg_decoration_main.png" 
          alt="Background decoration" 
          className="bg-decoration-main"
        />
        <img 
          src="images/bg_decoration_secondary.png" 
          alt="Background decoration" 
          className="bg-decoration-secondary"
        />
        
        {/* Decorative squares */}
        <div className="bg-square bg-square-1"></div>
        <div className="bg-square bg-square-2"></div>
        <div className="bg-square bg-square-3"></div>
      </div>
      
      <div className="looking-ahead-container">
        <div className="looking-ahead-header">
          <div className="looking-ahead-badge">
            <span>Shaping the next frontier of secure intelligence</span>
          </div>
          
          <div className="looking-ahead-content">
            <div className="looking-ahead-heading">
              <h2>
                <span className="text-white">Looking </span>
                <span className="gradient-text">Ahead</span>
              </h2>
            </div>
            
            <div className="looking-ahead-description">
              <p>
                <span className="description-main">
                  At the edge of possibility is where true innovation begins. As quantum computing accelerates 
                  and threats become more advanced, we remain committed to pushing boundaries. We integrate AI, 
                  sensors, and next-generation encryption to give industries like oil and gas the visibility 
                  and protection they've never had before. Our journey doesn't end at solving today's problems 
                  — it's about futureproofing infrastructure and intelligence for decades to come.
                </span>
                <span className="description-highlight">
                  Let's build the future together.
                </span>
              </p>
            </div>
          </div>
          
          <div className="looking-ahead-visual">
            <div className="video-background">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="background-video"
              >
                <source src="/oversiteai.io-web/video/looking_ahead.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="gradient-overlay"></div>
          </div>
        </div>
        
        <div className="looking-ahead-actions">
          <button className="btn-secondary">
            Talk to Our Team
          </button>
          <button className="btn-primary">
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default LookingAheadSection;

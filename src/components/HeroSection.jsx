import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-video-background">
        <video 
          className="hero-bg-video"
          src="video/oversiteai_drone.mp4"
          autoPlay
          loop
          muted
          playsInline
        />      
      </div>
      <div className="hero-grid-overlay"></div>
      <div className="hero-background">
        <svg className="hero-bg-svg" width="1920" height="1200" viewBox="0 0 1920 1200" fill="none">
          <g clipPath="url(#clip0_4_8054)">
            <path d="M2026.67 0H-106.667V1200H2026.67V0Z" fill="#0B0D10"/>
            <path d="M2026.67 0H-106.667V1200H2026.67V0Z" fill="url(#paint0_linear_4_8054)"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear_4_8054" x1="-106.667" y1="0" x2="102445" y2="182315" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4DFFB0" stopOpacity="0.1"/>
              <stop offset="0.5" stopColor="#00AEEF" stopOpacity="0.05"/>
              <stop offset="1" stopColor="#FF3D66" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="hero-gradient-overlay"></div>
      
      <div className="hero-overlay">
      </div>
      
      <div className="hero-content">
        
        <div className="hero-badge">
          Next-Generation Energy Intelligence
        </div>
        
        <div className="drone-feed-container">

          <div className="scan-info">
            <div className="scan-item">
              <div className="status-indicator"></div>
              <span>ACTIVE SCAN</span>
            </div>
            <div className="scan-detail">SWEEP: 278°</div>
            <div className="scan-detail">RANGE: 15.2 km</div>
            <div className="scan-detail">TARGETS: 1</div>
          </div>
          
          <div className="drone-feed-card">
            <div className="card-header">
              <div className="header-left">
                <div className="status-indicator"></div>
                <span className="card-title">DRONE-CAM-01 // SECTOR-7</span>
              </div>
              <span className="timestamp">9:59:36 AM</span>
            </div>
            
            <div className="card-content">
              <video 
                className="drone-video"
                src="video/oversiteai_drone.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="feed-label">DRONE FEED</div>
              <div className="crosshair">
                <div className="crosshair-horizontal"></div>
                <div className="crosshair-vertical"></div>
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>
              
              <div className="info-panel">
                <div className="rec-indicator">
                  <div className="rec-dot"></div>
                  <span>REC</span>
                </div>
                <div className="info-item ir">IR: ON</div>
                <div className="info-item zoom">ZOOM: 2.5x</div>
              </div>
              
              <div className="target-marker"></div>
            </div>
            
            <div className="card-footer">
              <div className="footer-item">
                <div className="status-indicator"></div>
                <span>LIVE</span>
              </div>
              <span className="resolution">1920x1080</span>
              <span className="fps">30fps</span>
            </div>
          </div>
          
          
        </div>

        <h1 className="hero-title">
          <div>The Future of</div>
          <div className="gradient-text">Oil & Gas Operations</div>
        </h1>
        
        <p className="hero-description">
          From frac sites to pipelines, our intelligent systems detect, track, and secure every asset in motion. 
          We're modernizing oil and gas infrastructure from the ground up.
        </p>
        
        <div className="hero-buttons">
          <button className="btn btn-outline">Explore Solutions</button>
          <button className="btn btn-primary">Talk To Us</button>
        </div>
        
        <div className="hero-stats">
          
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Sites Monitored</div>
            <div className="stat-bar">
              <div className="stat-progress"></div>
            </div>
          </div>
          
          <div className="stat-card uptime">
            <div className="stat-number">99.7%</div>
            <div className="stat-label">Uptime</div>
            <div className="stat-bar">
              <div className="stat-progress"></div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">AI Monitoring</div>
            <div className="stat-bar">
              <div className="stat-progress"></div>
            </div>
          </div>
        </div>
        <div className="telemetry-container">
          <div className="telemetry-data">
            <div className="telemetry-section">
              <div className="section-title">&gt; WELLHEAD_TELEMETRY</div>
              <div className="data-item">├─ Production Rate: 2,847 bbl/day</div>
              <div className="data-item">├─ Wellhead Pressure: 1,247 PSI</div>
              <div className="data-item">├─ Gas Rate: 4.2 MMscf/day</div>
              <div className="data-item">├─ Water Cut: 12.4%</div>
              <div className="data-item">└─ BOP Status: OPERATIONAL</div>
            </div>
            
            <div className="telemetry-section">
              <div className="section-title pipeline">&gt; PIPELINE_MONITORING</div>
              <div className="data-item">├─ Flow Rate: 15,200 bbl/h</div>
              <div className="data-item">├─ Line Pressure: 850 PSI</div>
              <div className="data-item">├─ Temperature: 78.4°F</div>
              <div className="data-item">└─ Integrity: NOMINAL</div>
            </div>
            
            <div className="telemetry-section">
              <div className="section-title refinery">&gt; REFINERY_STATUS</div>
              <div className="data-item">├─ Crude Throughput: 95,400 bbl/day</div>
              <div className="data-item">├─ Utilization: 87.6%</div>
              <div className="data-item">└─ Units Online: 12/14</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator" onClick={() => {
        const element = document.querySelector('.comparison-section');
        if (element) {
          const headerOffset = window.innerWidth * 0.02;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset - (window.innerWidth * 0.01);
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }}>
        <div className="scroll-text">Scroll to explore</div>
        <div className="scroll-mouse">
          <div className="scroll-dot"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

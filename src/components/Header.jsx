import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-wrapper">
            <img 
              src="public/images/logo.png" 
              alt="OverSiteAI Logo" 
              className="logo-image"
            />
          </div>
          <div className="logo-text">
            <span className="oversite">OverSite</span>
            <span className="ai gradient-text">AI</span>
          </div>
        </div>
        
        <nav className="nav">
          <div className="nav-item">
            <span>About</span>
          </div>
          <div className="nav-item">
            <span>Solutions</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 0.5L5 4.5L9 0.5" stroke="#D1D5DC"/>
            </svg>
          </div>
          <div className="nav-item">
            <span>News</span>
          </div>
        </nav>
        
        <button className="contact-button">
          Contact Us
        </button>
      </div>
    </header>
  );
};

export default Header;

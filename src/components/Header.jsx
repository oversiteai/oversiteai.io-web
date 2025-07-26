import React, { useState, useRef, useEffect } from 'react';

const Header = () => {
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navRef = useRef(null);
  const navItemRefs = useRef([]);

  const handleMouseEnter = (index) => {
    const navItem = navItemRefs.current[index];
    if (navItem && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = navItem.getBoundingClientRect();
      
      setUnderlineStyle({
        width: `${itemRect.width}px`,
        transform: `translateX(${itemRect.left - navRect.left}px)`
      });
    }
  };

  const handleMouseLeave = () => {
    // Keep the underline visible until mouse leaves the nav area
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-wrapper">
            <img 
              src="images/logo.png" 
              alt="OverSiteAI Logo" 
              className="logo-image"
            />
          </div>
          <div className="logo-text">
            <span className="oversite">OverSite</span>
            <span className="ai gradient-text">AI</span>
          </div>
        </div>
        
        <nav className="nav" ref={navRef} onMouseLeave={handleMouseLeave}>
          <div className="nav-underline" style={underlineStyle} />
          <div 
            className="nav-item" 
            ref={el => navItemRefs.current[0] = el}
            onMouseEnter={() => handleMouseEnter(0)}
          >
            <span>About</span>
          </div>
          <div 
            className="nav-item"
            ref={el => navItemRefs.current[1] = el}
            onMouseEnter={() => handleMouseEnter(1)}
          >
            <span>Solutions</span>
          </div>
          <div 
            className="nav-item"
            ref={el => navItemRefs.current[2] = el}
            onMouseEnter={() => handleMouseEnter(2)}
          >
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

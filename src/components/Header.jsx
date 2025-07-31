import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navRef = useRef(null);
  const navItemRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/about';
  const isSolutionsPage = location.pathname === '/solutions';

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
        <div
          className="logo-section"
          onClick={() => {
            if (isHomePage) {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            } else {
              navigate('/');
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-wrapper">
            <img
              src="/oversiteai.io-web/images/logo.png"
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
            className={`nav-item ${isAboutPage ? 'nav-item-active' : ''}`}
            ref={el => navItemRefs.current[0] = el}
            onMouseEnter={() => handleMouseEnter(0)}
            onClick={() => navigate('/about')}
          >
            <span>About</span>
          </div>
          <div
            className={`nav-item ${isSolutionsPage ? 'nav-item-active' : ''}`}
            ref={el => navItemRefs.current[1] = el}
            onMouseEnter={() => handleMouseEnter(1)}
            onClick={() => navigate('/solutions')}
          >
            <span>Solutions</span>
          </div>
          <div
            className="nav-item"
            ref={el => navItemRefs.current[2] = el}
            onMouseEnter={() => handleMouseEnter(2)}
            onClick={() => {
              if (isHomePage) {
                const element = document.querySelector('.tech-section');
                if (element) {
                  const headerOffset = window.innerWidth * 0.02;
                  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                  const offsetPosition = elementPosition - headerOffset - (window.innerWidth * 0.01);
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              } else {
                navigate('/');
                setTimeout(() => {
                  const element = document.querySelector('.tech-section');
                  if (element) {
                    const headerOffset = window.innerWidth * 0.02;
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - (window.innerWidth * 0.01);
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }, 700);
              }
            }}
          >
            <span>Media</span>
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

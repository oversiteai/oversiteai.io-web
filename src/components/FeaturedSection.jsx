import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [videoEnded, setVideoEnded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [featuredData, setFeaturedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const isDevMode = import.meta.env.DEV;

  // Fetch featured data
  useEffect(() => {
    const loadFeaturedData = async () => {
      try {
        // For now, load the first featured item
        // Later this can be dynamic based on rotation logic
        const response = await fetch('data/featured/1.json');
        if (response.ok) {
          const data = await response.json();
          setFeaturedData(data);
        }
      } catch (error) {
        console.error('Failed to load featured data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedData();
  }, []);

  // Intersection observer for video autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible && featuredData?.terminal?.video) {
            setIsVisible(true);
            if (videoRef.current) {
              videoRef.current.play();
            }
          }
        });
      },
      { threshold: featuredData?.terminal?.video?.threshold || 0.3 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [isVisible, featuredData]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  if (loading || !featuredData) {
    return null; // Or a loading skeleton
  }

  // Helper function to render icon
  const renderIcon = (icon, className) => {
    if (!icon) return null;
    return (
      <svg className={className} viewBox={icon.viewBox} fill="none">
        <path 
          className={className} 
          d={icon.path} 
          strokeWidth={icon.strokeWidth}
        />
      </svg>
    );
  };

  // Extract highlighted text
  const renderTitle = () => {
    const { text, highlight, highlightClass } = featuredData.title;
    if (!highlight) return text;
    
    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className={highlightClass}>{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section 
      className="featured-section" 
      ref={sectionRef}
      style={{ background: featuredData.background?.gradient }}
    >
      <div className="bg-overlays">
        {featuredData.background?.circles?.map((circle, index) => (
          <div 
            key={index}
            className={`overlay-circle-${index + 1}`}
            style={{
              ...circle.position,
              width: circle.size,
              height: circle.size,
              background: circle.color
            }}
          />
        ))}
      </div>
      
      <div className="container">
        <div className="featured-content">
          <div className="featured-info">
            {featuredData.badge && (
              <div className="flagship-badge">
                {renderIcon(featuredData.badge.icon, 'icon-featured')}
                <span>{featuredData.badge.text}</span>
                {isDevMode && (
                  <EditIcon
                    onClick={() => navigate(`/admin/articles/featured/${featuredData.id}`)}
                    style={{ 
                      fontSize: '1.2em', 
                      marginLeft: '0.5em',
                      cursor: 'pointer',
                      color: 'var(--Blue)'
                    }}
                  />
                )}
              </div>
            )}
            
            <h2 className="featured-title">
              {renderTitle()}
            </h2>
            
            <p className="featured-subtitle">
              {featuredData.subtitle}
            </p>
            
            <div className="featured-features">
              {featuredData.features.map((feature) => (
                <div key={feature.id} className="feature-item">
                  <div className="feature-icon">
                    {renderIcon(feature.icon, 'icon-feature')}
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            
            {featuredData.cta && (
              <button 
                className={`btn btn-${featuredData.cta.variant || 'primary'}`}
                onClick={() => window.location.href = featuredData.cta.link}
              >
                {featuredData.cta.text}
              </button>
            )}
          </div>
          
          <div className="featured-terminal">
            <div className="terminal-header">
              <div className="terminal-dots">
                {featuredData.terminal.dots.map((dot, index) => (
                  <div key={index} className={`dot ${dot.color}`} />
                ))}
              </div>
              <span className="terminal-title">{featuredData.terminal.title}</span>
            </div>
            
            {!videoEnded && featuredData.terminal.video && (
              <video
                ref={videoRef}
                className="terminal-video"
                src={featuredData.terminal.video.src}
                onEnded={handleVideoEnd}
                muted
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 1,
                  transition: 'opacity 1s ease-out'
                }}
              />
            )}
            
            <div className={`terminal-content ${videoEnded ? 'fade-in' : ''}`}>
              {featuredData.terminal.statusLines.map((line, index) => (
                <div 
                  key={index} 
                  className={`terminal-line ${line.isCommand ? 'command' : ''}`}
                >
                  {line.prefix}
                  {line.value && (
                    <span style={{ color: line.valueColor }}>
                      {' '}{line.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className={`terminal-visualization ${videoEnded ? 'fade-in' : ''}`}>
              <img 
                src={featuredData.terminal.fallbackImage} 
                alt="Network visualization" 
                className="network-viz"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
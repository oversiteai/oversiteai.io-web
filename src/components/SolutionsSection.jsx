import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const SolutionsSection = () => {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalSolutions, setTotalSolutions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isDevMode = process.env.NODE_ENV === 'development';
  
  // Use 5 solutions per page on both mobile and desktop
  const SOLUTIONS_PER_PAGE = 5;
  const minSwipeDistance = 50;

  // Fallback data for the first 8 solutions
  const fallbackSolutions = [
    {
      id: 1,
      image: "/oversiteai.io-web/images/geofence.png",
      title: "Geofencing and GPS Precision",
      description: "Every driver route, site visit, and fluid transfer is geotagged and timestamped using high-accuracy GPS."
    },
    {
      id: 2,
      image: "/oversiteai.io-web/images/bluetooth.png",
      title: "Bluetooth Flow Meter Automation",
      description: "Integrate directly with Bluetooth-enabled flow meters for accurate volume readings at pickup and disposal points."
    },
    {
      id: 3,
      image: "/oversiteai.io-web/images/realtime.png",
      title: "Real-Time Well Verification",
      description: "Cross-reference injection sites against permitted wells database for instant verification before fluid disposal."
    },
    {
      id: 4,
      image: "/oversiteai.io-web/images/automated_uic.png",
      title: "Automated UIC Generation",
      description: "Generate UIC documentation automatically by combining flow data, GPS tracks, operator ID, and digital signatures."
    },
    {
      id: 5,
      image: "/oversiteai.io-web/images/digital_custody_chain.png",
      title: "Digital Chain of Custody",
      description: "Immutable audit logs record every step from fluid origin to disposal, tracking who handled it, when, where, and how."
    },
    {
      id: 6,
      image: "/oversiteai.io-web/images/inventory1.jpg",
      title: "Smart Inventory Management",
      description: "Track every piece of equipment and material in real-time with RFID integration and predictive restocking."
    },
    {
      id: 7,
      image: "/oversiteai.io-web/images/maintenance1.jpg",
      title: "Predictive Maintenance Analytics",
      description: "Machine learning analyzes equipment data to predict failures and optimize maintenance schedules proactively."
    },
    {
      id: 8,
      image: "/oversiteai.io-web/images/compliance1.jpg",
      title: "Environmental Compliance Suite",
      description: "Navigate environmental regulations with automated monitoring, documentation, and reporting for all major frameworks."
    }
  ];

  useEffect(() => {
    const loadSolutions = async () => {
      const loadedSolutions = [];
      let id = 1;
      let consecutiveFailures = 0;
      
      // Try to load solutions until we get 2 consecutive 404s
      while (consecutiveFailures < 2) {
        try {
          const response = await fetch(`/oversiteai.io-web/data/solutions/${id}.json`);
          if (response.ok) {
            const data = await response.json();
            
            // Only include if featured is true or undefined (for backwards compatibility)
            if (data.featured !== false) {
              // Use data from JSON if available, otherwise use fallback
              const solutionData = {
                id: data.id || id,
                title: data.title || fallbackSolutions[id - 1]?.title || `Solution ${id}`,
                description: data.teaser || data.subtitle || fallbackSolutions[id - 1]?.description || '',
                image: data.primaryImage || data.image || fallbackSolutions[id - 1]?.image || `/oversiteai.io-web/images/solution${id}.png`
              };
              loadedSolutions.push(solutionData);
            }
            consecutiveFailures = 0;
          } else {
            consecutiveFailures++;
          }
        } catch {
          consecutiveFailures++;
        }
        id++;
        
        // Safety limit to prevent infinite loop
        if (id > 20) break;
      }
      
      // If no solutions were loaded, use fallback data
      if (loadedSolutions.length === 0) {
        setSolutions(fallbackSolutions);
        setTotalSolutions(fallbackSolutions.length);
      } else {
        setSolutions(loadedSolutions);
        setTotalSolutions(loadedSolutions.length);
      }
      setLoading(false);
    };
    
    loadSolutions();
  }, []);

  const totalPages = Math.ceil(totalSolutions / SOLUTIONS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(newPage);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(0); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <section className="solutions-section">
      <div className="solutions-grid-overlay"></div>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Built to Solve Real Field Problems</div>
          <h2 className="section-title">
            Explore More <span className="gradient-text">Smart Solutions</span>
          </h2>
          <p className="section-description">
            Discover our complete suite of AI-powered solutions designed to transform every
            aspect of energy operations with intelligence and precision.
          </p>
        </div>
        
        <div 
          className="solutions-carousel-container"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="solutions-carousel-track"
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
              transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            {loading ? (
              <div style={{ width: '100%', textAlign: 'center', padding: '4vw' }}>
                <p>Loading solutions...</p>
              </div>
            ) : (
              Array.from({ length: totalPages }, (_, pageIndex) => (
                <div key={pageIndex} className="solutions-grid solutions-page">
                  {solutions
                    .slice(
                      pageIndex * SOLUTIONS_PER_PAGE,
                      (pageIndex + 1) * SOLUTIONS_PER_PAGE
                    )
                    .map((solution) => (
                      <Link 
                        key={solution.id}
                        to={`/solution/detail/${solution.id}`} 
                        className="solution-card" 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="card-image">
                          <img src={solution.image} alt={solution.title} />
                          <div className="external-link-icon">
                            <svg viewBox="0 0 14 14" fill="none">
                              <path className="icon-external-link" d="M8.75 1.75H12.25V5.25" strokeWidth="1.16667"/>
                              <path className="icon-external-link" d="M5.8335 8.16667L12.2502 1.75" strokeWidth="1.16667"/>
                              <path className="icon-external-link" d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667" strokeWidth="1.16667"/>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="card-content">
                          <h3 className="card-title">{solution.title}</h3>
                          <p className="card-description">{solution.description}</p>
                          
                          <div className="learn-more">
                            <span>Learn More</span>
                            <svg viewBox="0 0 14 15" fill="none">
                              <path className="icon-external-link" d="M2.9165 7.81006H11.0832" strokeWidth="1.16667"/>
                              <path className="icon-external-link" d="M7 3.72681L11.0833 7.81014L7 11.8935" strokeWidth="1.16667"/>
                            </svg>
                            {isDevMode && (
                              <EditIcon
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate(`/admin/articles/solutions/${solution.id}`);
                                }}
                                style={{ 
                                  fontSize: '1.2em', 
                                  marginLeft: '0.5em',
                                  cursor: 'pointer'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  {/* Add empty placeholders to maintain grid layout */}
                  {Array.from({ 
                    length: Math.max(0, SOLUTIONS_PER_PAGE - (solutions.slice(
                      pageIndex * SOLUTIONS_PER_PAGE,
                      (pageIndex + 1) * SOLUTIONS_PER_PAGE
                    ).length))
                  }).map((_, index) => (
                    <div key={`placeholder-${pageIndex}-${index}`} className="solution-card-placeholder"></div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="solutions-pagination">
            <div className="pagination-dots">
              {Array.from({ length: totalPages }, (_, index) => (
                <div 
                  key={index} 
                  className={`dot ${currentPage === index ? 'active' : ''}`}
                  onClick={() => handlePageChange(index)}
                  style={{ cursor: 'pointer' }}
                ></div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--Blue)',
                  color: currentPage === 0 ? 'var(--Gray)' : 'var(--Blue)',
                  opacity: currentPage === 0 ? 0.5 : 1,
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                  minWidth: '8vw'
                }}
              >
                Previous
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                style={{
                  background: 'transparent', 
                  border: '1px solid var(--Blue)',
                  color: currentPage >= totalPages - 1 ? 'var(--Gray)' : 'var(--Blue)',
                  opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                  cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  minWidth: '8vw'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SolutionsSection;

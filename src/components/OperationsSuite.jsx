import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useContactModal } from '../hooks/useContactModal';
import ContactModal from './ContactModal';

// Removed FeatureCard component - will use inline rendering like SolutionsSection

const OperationsSuite = () => {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDevMode = import.meta.env.DEV;
  const { isOpen, ctaId, openModal, closeModal } = useContactModal();
  
  useEffect(() => {
    const loadSolutions = async () => {
      const loadedSolutions = [];
      let id = 1;
      let consecutiveFailures = 0;
      
      // Try to load solutions until we get 2 consecutive 404s
      while (consecutiveFailures < 2) {
        try {
          const response = await fetch(`data/solutions/${id}.json`);
          if (response.ok) {
            const data = await response.json();
            
            // Include all solutions, not just featured
            // Use data from JSON if available
            const solutionData = {
              id: data.id || id,
              title: data.title || `Solution ${id}`,
              description: data.teaser || data.subtitle || '',
              image: data.cardImage || `images/solution${id}.png`,
              featured: data.featured || false
            };
            loadedSolutions.push(solutionData);
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
      
      // Set the loaded solutions
      setSolutions(loadedSolutions);
      setLoading(false);
    };
    
    loadSolutions();
  }, []);

  return (
    <>
      <div className="operations-suite">
      {/* Background blur elements */}
      <svg className="operations-blur-1" width="718" height="789" viewBox="0 0 718 789" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5" filter="url(#filter0_f_435_1197)">
          <path d="M200.6 277.556C210.871 220.97 745.49 192.895 804.763 201.54C843.992 245.623 650.697 521.69 668.5 568.844C690.754 627.788 513.009 529.835 424.636 568.844C336.262 607.854 383.557 496.73 384.413 450.647C385.269 404.564 187.761 348.288 200.6 277.556Z" fill="#2BB4C6"/>
        </g>
        <defs>
          <filter id="filter0_f_435_1197" x="0" y="0" width="1010.03" height="788.237" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_435_1197"/>
          </filter>
        </defs>
      </svg>
      
      <svg className="operations-blur-2" width="860" height="1197" viewBox="0 0 860 1197" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5" filter="url(#filter0_f_435_1195)">
          <circle cx="261.5" cy="598.5" r="198.5" fill="#2BB4C6"/>
        </g>
        <defs>
          <filter id="filter0_f_435_1195" x="-337" y="0" width="1197" height="1197" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_435_1195"/>
          </filter>
        </defs>
      </svg>

      <div className="operations-suite-content">
        <div className="operations-suite-header">
          <div className="operations-tag">
            <div className="operations-tag-container">
              <span className="operations-tag-text">Complete Field Solutions, Reimagined</span>
            </div>
          </div>
          <div className="operations-heading-section">
            <h2 className="operations-main-heading">
              <span className="operations-heading-text">Complete Field </span>
              <span className="operations-heading-gradient">Operations Suite</span>
            </h2>
          </div>
          <div className="operations-description-container">
            <p className="operations-description">
              From real-time tracking to predictive maintenance, our suite equips field teams with the tools to operate smarter, safer, and more efficiently. Every asset and action is accounted for.
            </p>
          </div>
        </div>

        <div className="operations-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
              <p style={{ color: 'var(--Text)', fontSize: '1.2rem' }}>Loading solutions...</p>
            </div>
          ) : solutions.length > 0 ? (
            solutions.map((solution) => (
              <Link 
                key={solution.id}
                to={`/solution/detail/${solution.id}`} 
                className="operations-card" 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="operations-card-image">
                  <img src={solution.image} alt={solution.title} />
                  {solution.featured && (
                    <div className="operations-featured-badge">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--Blue)" stroke="var(--Blue)" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="operations-external-link-icon">
                    <svg viewBox="0 0 14 14" fill="none">
                      <path className="icon-external-link" d="M8.75 1.75H12.25V5.25" strokeWidth="1.16667"/>
                      <path className="icon-external-link" d="M5.8335 8.16667L12.2502 1.75" strokeWidth="1.16667"/>
                      <path className="icon-external-link" d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667" strokeWidth="1.16667"/>
                    </svg>
                  </div>
                </div>
                
                <div className="operations-card-content">
                  <h3 className="operations-card-title">{solution.title}</h3>
                  <p className="operations-card-description">{solution.description}</p>
                  
                  <div className="operations-learn-more">
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
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
              <p style={{ color: 'var(--Text)', fontSize: '1.2rem' }}>No solutions available.</p>
            </div>
          )}
        </div>

        <div className="operations-cta-section">
          <div className="operations-cta-container">
            <button 
              className="operations-cta-button"
              onClick={() => openModal('operations-demo')}
            >
              <span className="operations-cta-text">Request a Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ContactModal 
      isOpen={isOpen}
      onClose={closeModal}
      ctaId={ctaId}
    />
    </>
  );
};

export default OperationsSuite;

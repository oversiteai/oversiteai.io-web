import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import './SolutionDetail.css';

function SolutionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validImages, setValidImages] = useState([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchSolution = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/oversiteai.io-web/data/solutions/${id}.json`);
        if (!response.ok) {
          throw new Error('Solution not found');
        }
        const data = await response.json();
        setSolution(data);
        
        // Check which images are valid
        if (data.images && data.images.length > 0) {
          const imageChecks = await Promise.all(
            data.images.map(async (imgSrc) => {
              try {
                const imgResponse = await fetch(imgSrc, { method: 'HEAD' });
                return imgResponse.ok ? imgSrc : null;
              } catch {
                return null;
              }
            })
          );
          setValidImages(imageChecks.filter(img => img !== null));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !solution) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">Solution not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <div className="solution-detail-wrapper">
      <div className="solution-detail-grid-overlay"></div>
      <div className="solution-detail-container">
        <div className="navigation-buttons">
          <div 
            className="nav-button"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const element = document.querySelector('.solutions-section');
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
            }}
          >
            <svg viewBox="0 0 20 20" fill="none" style={{ width: '1.2vw', height: '1.2vw' }}>
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Solutions</span>
          </div>
        </div>
        
        <div className="solution-detail-card">
          <div className="solution-detail-header">
            <h1 className="solution-detail-title">{solution.title}</h1>
            <p className="solution-detail-subtitle">{solution.subtitle}</p>
          </div>
          
          {validImages.length > 0 && (
            <div className="solution-detail-images">
              {validImages.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`${solution.title} - ${index + 1}`}
                  className="solution-detail-image"
                  onError={(e) => {
                    // Hide image if it fails to load after initial check
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="solution-detail-body" 
               dangerouslySetInnerHTML={{ __html: solution.body }} 
          />
          
          {solution.tags && solution.tags.length > 0 && (
            <div className="solution-detail-tags">
              {solution.tags.map((tag, index) => (
                <span key={index} className="solution-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SolutionDetail;
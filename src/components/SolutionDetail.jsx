import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import './SolutionDetail.css';

function SolutionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [primaryImageValid, setPrimaryImageValid] = useState(false);
  const isDevMode = import.meta.env.DEV;

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // For Safari
    }, 0);
    
    const fetchSolution = async () => {
      try {
        setLoading(true);
        const response = await fetch(`data/solutions/${id}.json`);
        if (!response.ok) {
          throw new Error('Solution not found');
        }
        const data = await response.json();
        setSolution(data);
        
        // Check if primary image is valid
        if (data.primaryImage) {
          try {
            const imgResponse = await fetch(data.primaryImage, { method: 'HEAD' });
            setPrimaryImageValid(imgResponse.ok);
          } catch {
            setPrimaryImageValid(false);
          }
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
            onClick={() => navigate('/solutions')}
          >
            <svg viewBox="0 0 20 20" fill="none" style={{ width: '1.2vw', height: '1.2vw' }}>
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Solutions</span>
          </div>
          {isDevMode && (
            <div 
              className="nav-button nav-button-right"
              onClick={() => navigate(`/admin/articles/solutions/${id}`)}
            >
              <EditIcon style={{ fontSize: '1.2vw' }} />
              <span>Edit</span>
            </div>
          )}
        </div>
        
        <div className="solution-detail-card">
          <div className="solution-detail-header">
            <h1 className="solution-detail-title">{solution.title}</h1>
            <p className="solution-detail-subtitle">{solution.subtitle}</p>
          </div>
          
          {primaryImageValid && solution.primaryImage && (
            <div className="solution-detail-images">
              <img 
                src={solution.primaryImage} 
                alt={solution.title}
                className="solution-detail-image"
                onError={(e) => {
                  // Hide image if it fails to load after initial check
                  e.target.style.display = 'none';
                }}
              />
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
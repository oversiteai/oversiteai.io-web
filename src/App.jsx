import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ComparisonSection from './components/ComparisonSection';
import SolutionsSection from './components/SolutionsSection';
import MetricsSection from './components/MetricsSection';
import TechSection from './components/TechSection';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import SolutionDetail from './components/SolutionDetail';
import AdminPanel from './components/admin/AdminPanel';

function HomePage() {
  return (
    <>
      <HeroSection />
      <ComparisonSection />
      <SolutionsSection />
      <MetricsSection />
      <TechSection />
      <FeaturedSection />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Skip if we're already transitioning
    if (isTransitioning) return;
    
    // Skip if location hasn't actually changed
    if (location.pathname === displayLocation.pathname) return;
    
    // Determine if we need a page transition
    const needsTransition = (currentPath, previousPath) => {
      const currentParts = currentPath.split('/');
      const previousParts = previousPath.split('/');
      
      // Different base routes always transition (e.g., / to /admin)
      if (currentParts[1] !== previousParts[1]) {
        return true;
      }
      
      // Within admin routes
      if (currentParts[1] === 'admin') {
        // Check if we're in articles section
        if (currentParts[2] === 'articles' && previousParts[2] === 'articles') {
          const currentType = currentParts[3];
          const previousType = previousParts[3];
          
          // Define which content types use the same editor
          const articleEditorTypes = ['solutions', 'case-studies', 'blog', 'news', 'resources'];
          const featuredEditorTypes = ['featured'];
          
          // Check if both types use the same editor
          const currentUsesArticleEditor = articleEditorTypes.includes(currentType);
          const previousUsesArticleEditor = articleEditorTypes.includes(previousType);
          
          // Only transition if switching between different editor types
          return currentUsesArticleEditor !== previousUsesArticleEditor;
        }
        // Transition for other admin route changes
        return currentParts[2] !== previousParts[2];
      }
      
      // Default to transitioning for other route changes
      return true;
    };
    
    if (needsTransition(location.pathname, displayLocation.pathname)) {
      setIsTransitioning(true);
      setTransitionStage('exit');
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
        // Reset transitioning flag after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 600);
      }, 600);
    } else {
      // Update location without transition
      setDisplayLocation(location);
    }
  }, [location]); // Only depend on location changes
  
  return (
    <div className="App">
      <Header />
      <main>
        <div className={`page-wrapper page-transition-${transitionStage}`}>
          <Routes location={displayLocation}>
            <Route path="/" element={<HomePage />} />
            <Route path="/solution/detail/:id" element={<SolutionDetail />} />
            {/* Admin routes - only in development */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <Route path="/admin" element={<Navigate to="/admin/articles/solutions" replace />} />
                <Route path="/admin/articles" element={<Navigate to="/admin/articles/solutions" replace />} />
                <Route path="/admin/articles/:contentType" element={<AdminPanel />} />
                <Route path="/admin/articles/:contentType/:id" element={<AdminPanel />} />
              </>
            )}
          </Routes>
        </div>
      </main>
      <Footer />
      {/* <ThemeSwitcher /> */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

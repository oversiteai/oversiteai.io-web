import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ComparisonSection from './components/ComparisonSection';
import SolutionsSection from './components/SolutionsSection';
import MetricsSection from './components/MetricsSection';
import TechSection from './components/TechSection';
import DarkwaterSection from './components/DarkwaterSection';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import SolutionDetail from './components/SolutionDetail';
import AdminPanel from './components/AdminPanel';

function HomePage() {
  return (
    <>
      <HeroSection />
      <ComparisonSection />
      <SolutionsSection />
      <MetricsSection />
      <TechSection />
      <DarkwaterSection />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');
  
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('exit');
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
      }, 600);
    }
  }, [location, displayLocation]);
  
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
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/:contentType/:id" element={<AdminPanel />} />
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
    <Router basename="/oversiteai.io-web/">
      <AppContent />
    </Router>
  );
}

export default App;

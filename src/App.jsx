import React from 'react';
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

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HeroSection />
        <ComparisonSection />
        <SolutionsSection />
        <MetricsSection />
        <TechSection />
        <DarkwaterSection />
      </main>
      <Footer />
      {/* <ThemeSwitcher /> */}
    </div>
  );
}

export default App;

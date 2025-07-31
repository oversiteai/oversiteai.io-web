import React, { useEffect } from 'react';
import SolutionsHeader from './SolutionsHeader';
import OperationsSuite from './OperationsSuite';

const SolutionsPage = () => {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="solutions-page-wrapper">
      <SolutionsHeader />
      <OperationsSuite />
    </div>
  );
};

export default SolutionsPage;

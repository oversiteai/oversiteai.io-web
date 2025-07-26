import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-logo">
              <img 
                src="/images/logo.png" 
                alt="OverSiteAI Logo" 
                className="footer-logo"
              />
              <span className="brand-name">OverSiteAI</span>
            </div>
            
            <p className="brand-description">
              Transforming oil and gas operations
              with cutting-edge AI technology,
              autonomous monitoring, and quantum-
              ready security solutions.
            </p>
            
            <div className="social-links">
              <a href="#" aria-label="LinkedIn">
                <svg className="icon-social" viewBox="0 0 18 19" fill="none">
                  <path d="M11.6665 6.8125C12.8268 6.8125 13.9396 7.27344 14.7601 8.09391C15.5806 8.91438 16.0415 10.0272 16.0415 11.1875V16.2917H13.1248V11.1875C13.1248 10.8007 12.9712 10.4298 12.6977 10.1563C12.4242 9.88281 12.0533 9.72917 11.6665 9.72917C11.2797 9.72917 10.9088 9.88281 10.6353 10.1563C10.3618 10.4298 10.2082 10.8007 10.2082 11.1875V16.2917H7.2915V11.1875C7.2915 10.0272 7.75244 8.91438 8.57291 8.09391C9.39338 7.27344 10.5062 6.8125 11.6665 6.8125Z" strokeWidth="1.45833"/>
                  <path d="M4.37516 7.5415H1.4585V16.2915H4.37516V7.5415Z" strokeWidth="1.45833"/>
                  <path d="M2.91683 5.35417C3.72224 5.35417 4.37516 4.70125 4.37516 3.89583C4.37516 3.09042 3.72224 2.4375 2.91683 2.4375C2.11141 2.4375 1.4585 3.09042 1.4585 3.89583C1.4585 4.70125 2.11141 5.35417 2.91683 5.35417Z" strokeWidth="1.45833"/>
                </svg>
              </a>
              
              <a href="#" aria-label="Twitter">
                <svg className="icon-social" viewBox="0 0 18 19" fill="none">
                  <path d="M16.5418 3.89585C16.5418 3.89585 16.0314 5.4271 15.0835 6.37502C16.2502 13.6667 8.22933 18.9896 1.9585 14.8334C3.56266 14.9063 5.16683 14.3959 6.3335 13.375C2.68766 12.2813 0.864746 7.97918 2.68766 4.62502C4.29183 6.52085 6.771 7.6146 9.25016 7.54168C8.59391 4.47918 12.1668 2.72918 14.3543 4.77085C15.1564 4.77085 16.5418 3.89585 16.5418 3.89585Z" strokeWidth="1.45833"/>
                </svg>
              </a>
              
              <a href="#" aria-label="GitHub">
                <svg className="icon-social" viewBox="0 0 18 19" fill="none">
                  <path d="M10.9374 17.0208V14.1042C11.0389 13.1907 10.777 12.274 10.2083 11.5521C12.3958 11.5521 14.5833 10.0938 14.5833 7.54167C14.6416 6.63021 14.3864 5.73333 13.8541 4.98958C14.0583 4.15104 14.0583 3.27604 13.8541 2.4375C13.8541 2.4375 13.1249 2.4375 11.6666 3.53125C9.7416 3.16667 7.75826 3.16667 5.83326 3.53125C4.37493 2.4375 3.64576 2.4375 3.64576 2.4375C3.42701 3.27604 3.42701 4.15104 3.64576 4.98958C3.11484 5.73033 2.85715 6.63224 2.9166 7.54167C2.9166 10.0938 5.1041 11.5521 7.2916 11.5521C7.00722 11.9094 6.79576 12.3177 6.67181 12.7552C6.54785 13.1927 6.51139 13.6521 6.56243 14.1042V17.0208" strokeWidth="1.45833"/>
                  <path d="M6.56266 14.1038C3.27412 15.5622 2.91683 12.6455 1.4585 12.6455" strokeWidth="1.45833"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-solutions">
            <div className="footer-solutions-wrapper">
              <div className="footer-section">
                <h3 className="footer-title">Field Operations</h3>
                <ul className="footer-links">
                  <li><a href="#">GPS Tracking</a></li>
                  <li><a href="#">Geofencing</a></li>
                  <li><a href="#">Spill & HSE Detection</a></li>
                  <li><a href="#">Smart Field Tickets</a></li>
                  <li><a href="#">Flow Meter Automation</a></li>
                  <li><a href="#">Well Verification</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3 className="footer-title">Compliance & Safety</h3>
                <ul className="footer-links">
                  <li><a href="#">UIC Compliance</a></li>
                  <li><a href="#">Vision Gate Control</a></li>
                  <li><a href="#">Incident Auto-Logging</a></li>
                  <li><a href="#">Inventory Monitoring</a></li>
                  <li><a href="#">Tank Integration</a></li>
                  <li><a href="#">Predictive Maintenance</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">News</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-partners">
          <h4 className="partners-title">Trusted Partners</h4>
          <div className="partners-list">
            <div className="partner">
              <div className="partner-icon green">S</div>
              <span>SensorOps</span>
            </div>
            <div className="partner">
              <div className="partner-icon blue">I</div>
              <span>IntegratedSecure</span>
            </div>
            <div className="partner">
              <div className="partner-icon red">Q</div>
              <span>QuantumGuard</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            © 2025 OverSiteAI. All rights reserved.
          </div>
          
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
            <a href="#">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

const ComparisonSection = () => {
  const traditionalItems = [
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-traditional" fillRule="evenodd" clipRule="evenodd" d="M10.5 2.25C15.3317 2.25 19.25 6.16822 19.25 11C19.25 15.8317 15.3317 19.75 10.5 19.75C5.66822 19.75 1.75 15.8317 1.75 11C1.75 6.16822 5.66822 2.25 10.5 2.25ZM10.5 4.00001C6.64042 4.00001 3.50001 7.14038 3.50001 11C3.50001 14.8596 6.64038 18 10.5 18C14.3596 18 17.5 14.8596 17.5 11C17.5 7.14038 14.3596 4.00001 10.5 4.00001ZM12.5064 7.75639L13.7436 8.99362L11.7373 11L13.7436 13.0064L12.5064 14.2436L10.5 12.2373L8.49362 14.2436L7.25639 13.0064L9.26275 11L7.25639 8.99362L8.49362 7.75639L10.5 9.76275L12.5064 7.75639Z"/>
        </svg>
      ),
      title: "Manual, Error-Prone Field Tickets",
      description: "Most field tickets are written by hand or in spreadsheets. They're often submitted late, contain mistakes, and are hard to verify."
    },
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-traditional-stroke" d="M8.3125 9.25C8.3125 9.71413 8.49687 10.1592 8.82506 10.4874C9.15325 10.8156 9.59837 11 10.0625 11C10.5266 11 10.9717 10.8156 11.2999 10.4874C11.6281 10.1592 11.8125 9.71413 11.8125 9.25C11.8125 8.78587 11.6281 8.34075 11.2999 8.01256C10.9717 7.68437 10.5266 7.5 10.0625 7.5C9.59837 7.5 9.15325 7.68437 8.82506 8.01256C8.49687 8.34075 8.3125 8.78587 8.3125 9.25Z" strokeWidth="1.5"/>
          <path className="icon-traditional-stroke" d="M3.99875 12.75C3.38498 11.6858 3.06209 10.4788 3.0625 9.25033C3.06291 8.02184 3.38662 6.81509 4.00111 5.75132C4.61559 4.68756 5.49921 3.80424 6.56318 3.19011C7.62715 2.57599 8.83401 2.25269 10.0625 2.25269C11.291 2.25269 12.4978 2.57599 13.5618 3.19011C14.6258 3.80424 15.5094 4.68756 16.1239 5.75132C16.7384 6.81509 17.0621 8.02184 17.0625 9.25033C17.0629 10.4788 16.74 11.6858 16.1263 12.75" strokeWidth="1.5"/>
        </svg>
      ),
      title: "Disconnected Tools and Software",
      description: "Field data is scattered across different tools with no central platform. GPS, sensors, and logs operate in silos, making it difficult to track and manage operations in real time."
    },
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-traditional-stroke" d="M19.0139 16.25L12.0139 3.99995C11.8612 3.73063 11.6399 3.50662 11.3724 3.35076C11.105 3.19491 10.8009 3.11279 10.4914 3.11279C10.1818 3.11279 9.87778 3.19491 9.61031 3.35076C9.34284 3.50662 9.1215 3.73063 8.96887 3.99995L1.96887 16.25C1.81459 16.5171 1.7337 16.8204 1.73438 17.1289C1.73506 17.4374 1.8173 17.7403 1.97276 18.0068C2.12822 18.2733 2.35138 18.494 2.6196 18.6464C2.88783 18.7989 3.1916 18.8777 3.50012 18.875H17.5001C17.8072 18.8746 18.1087 18.7935 18.3745 18.6398C18.6403 18.4861 18.8609 18.2652 19.0143 17.9992C19.1677 17.7332 19.2484 17.4315 19.2483 17.1245C19.2482 16.8175 19.1674 16.5159 19.0139 16.25Z" strokeWidth="1.75"/>
          <path className="icon-traditional-stroke" d="M10.5 8.375V11.875" strokeWidth="1.75"/>
          <path className="icon-traditional-stroke" d="M10.5 15.375H10.5088" strokeWidth="1.75"/>
        </svg>
      ),
      title: "Delayed Incident Detection",
      description: "Leaks, spills, and safety violations are usually spotted and reported manually. This causes slow responses and increases the risk of compliance issues."
    },
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-traditional-stroke" d="M10.5 5.75V11L14 12.75" strokeWidth="1.75"/>
          <path className="icon-traditional-stroke" d="M10.5 19.75C15.3325 19.75 19.25 15.8325 19.25 11C19.25 6.16751 15.3325 2.25 10.5 2.25C5.66751 2.25 1.75 6.16751 1.75 11C1.75 15.8325 5.66751 19.75 10.5 19.75Z" strokeWidth="1.75"/>
        </svg>
      ),
      title: "No Real-Time Visibility of Assets",
      description: "Without live tracking, operators can't easily locate trucks, tools, or people. Decisions are based on guesswork rather than clear information."
    }
  ];

  const oversiteItems = [
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-oversite" d="M17.8614 3.91261L3.61551 9.44786L7.84089 11.2031C9.0758 11.7157 10.057 12.6972 10.5691 13.9322L12.3244 18.1567L17.8614 3.91261ZM19.4775 4.50936L13.9405 18.7552C13.5905 19.6565 12.5834 20.1176 11.6909 19.7877C11.4733 19.7076 11.2747 19.5832 11.1076 19.4225C10.9404 19.2619 10.8083 19.0683 10.7196 18.8541L8.96351 14.6279C8.62148 13.805 7.96737 13.1512 7.14439 12.8096L2.91989 11.0544C2.04139 10.6895 1.64064 9.67536 2.02476 8.78811C2.11913 8.57123 2.25546 8.37516 2.4259 8.21117C2.59634 8.04719 2.79753 7.91853 3.01789 7.83261L17.2638 2.29561C17.5732 2.17123 17.9124 2.14053 18.2392 2.20733C18.566 2.27413 18.866 2.43547 19.1018 2.67132C19.3376 2.90717 19.499 3.20711 19.5658 3.53389C19.6326 3.86067 19.6019 4.19988 19.4775 4.50936Z"/>
        </svg>
      ),
      title: "Auto-Generated, GPS-Verified Field Logs",
      description: "Field tickets are automatically generated and location-stamped. This improves accuracy, speeds up processing, and reduces fraud."
    },
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-oversite" d="M10.5 1.24902L19.25 6.11052V15.8895L10.5 20.751L1.75 15.8895V6.11052L10.5 1.24902ZM3.5 8.28402V14.8596L9.625 18.2634V11.5268L3.5 8.28402ZM11.375 18.2625L17.5 14.8596V8.2849L11.375 11.5276V18.2625ZM10.5 10.0095L16.73 6.71252L10.5 3.25102L4.27 6.71165L10.5 10.0095Z"/>
        </svg>
      ),
      title: "One Connected AI Platform",
      description: "All field data flows into one platform that brings everything together. GPS, sensors, and compliance logs are synced in real time and easy to monitor and manage."
    },
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-oversite-stroke" d="M17.5 11C17.5 12.8565 16.7625 14.637 15.4497 15.9497C14.137 17.2625 12.3565 18 10.5 18C8.64348 18 6.86301 17.2625 5.55025 15.9497C4.2375 14.637 3.5 12.8565 3.5 11C3.5 9.14348 4.2375 7.36301 5.55025 6.05025C6.86301 4.7375 8.64348 4 10.5 4C12.3565 4 14.137 4.7375 15.4497 6.05025C16.7625 7.36301 17.5 9.14348 17.5 11Z" strokeWidth="1.5"/>
          <path className="icon-oversite-stroke" d="M13.125 11C13.125 11.6962 12.8484 12.3639 12.3562 12.8562C11.8639 13.3484 11.1962 13.625 10.5 13.625C9.80381 13.625 9.13613 13.3484 8.64384 12.8562C8.15156 12.3639 7.875 11.6962 7.875 11C7.875 10.3038 8.15156 9.63613 8.64384 9.14384C9.13613 8.65156 9.80381 8.375 10.5 8.375C11.1962 8.375 11.8639 8.65156 12.3562 9.14384C12.8484 9.63613 13.125 10.3038 13.125 11Z" strokeWidth="1.5"/>
          <path className="icon-oversite-stroke" d="M1.75 11H3.5M17.5 11H19.25M10.5 4V2.25M10.5 19.75V18" strokeWidth="1.5"/>
        </svg>
      ),
      title: "Instant Detection of Spills and Violations",
      description: "AI and sensors catch problems the moment they occur. Operators are alerted right away so they can act fast and avoid costly downtime."
    },
    {
      icon: (
        <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
          <path className="icon-feature" d="M3.07075 0.300797C3.16586 0.208499 3.29374 0.157754 3.42625 0.159723C3.55877 0.161692 3.68508 0.216213 3.7774 0.311297C3.87784 0.416827 3.93289 0.557536 3.93073 0.703206C3.92857 0.848876 3.86938 0.98789 3.76585 1.0904C2.40826 2.46431 1.6479 4.31859 1.6501 6.2501C1.6501 8.3396 2.5216 10.2254 3.9223 11.5631C3.97614 11.6132 4.0195 11.6735 4.04988 11.7405C4.08027 11.8075 4.09707 11.8799 4.09931 11.9534C4.10156 12.0269 4.0892 12.1001 4.06297 12.1689C4.03673 12.2376 3.99713 12.3004 3.94645 12.3537C3.85613 12.4471 3.73297 12.5014 3.60317 12.5054C3.47336 12.5093 3.34715 12.4624 3.25135 12.3747C2.41342 11.59 1.74571 10.6413 1.28963 9.58778C0.833561 8.5342 0.598863 7.39815 0.600103 6.2501C0.600103 3.9254 1.5451 1.8212 3.07075 0.300797ZM14.2344 1.0904C14.131 0.987752 14.072 0.84866 14.07 0.702991C14.068 0.557322 14.1233 0.416691 14.2239 0.311297C14.3161 0.216532 14.4422 0.162215 14.5745 0.160247C14.7067 0.158279 14.8344 0.208821 14.9295 0.300797C15.7134 1.08041 16.3353 2.00746 16.7594 3.02853C17.1834 4.04959 17.4012 5.14448 17.4001 6.2501C17.4001 8.6651 16.3816 10.8428 14.7489 12.3747C14.6531 12.4624 14.5268 12.5093 14.397 12.5054C14.2672 12.5014 14.1441 12.4471 14.0538 12.3537C14.0032 12.3004 13.9638 12.2377 13.9376 12.1691C13.9115 12.1004 13.8992 12.0273 13.9014 11.9539C13.9037 11.8805 13.9204 11.8083 13.9507 11.7414C13.981 11.6745 14.0242 11.6143 14.0779 11.5641C14.7971 10.8786 15.3693 10.0541 15.7599 9.14055C16.1505 8.22703 16.3513 7.24362 16.3501 6.2501C16.3526 4.31823 15.5922 2.46457 14.2344 1.0904ZM4.9387 2.1446C5.03227 2.05548 5.15741 2.00719 5.28658 2.01034C5.41576 2.01349 5.53839 2.06783 5.6275 2.1614C5.8459 2.3798 5.82385 2.7389 5.6086 2.9594C4.7532 3.84122 4.27489 5.02155 4.2751 6.2501C4.2751 7.6046 4.84525 8.8268 5.7598 9.68885C5.9908 9.9062 6.0223 10.2779 5.79655 10.5036C5.71002 10.5936 5.59219 10.6469 5.46748 10.6523C5.34277 10.6578 5.22074 10.6151 5.12665 10.533C4.52799 9.99167 4.04946 9.33082 3.72193 8.59311C3.39441 7.85541 3.22516 7.05724 3.2251 6.2501C3.22395 5.48629 3.37487 4.72991 3.66908 4.02504C3.96328 3.32017 4.39488 2.68093 4.9387 2.1446ZM12.3916 2.9594C12.1764 2.7389 12.1543 2.3798 12.3727 2.1614C12.4618 2.06783 12.5844 2.01349 12.7136 2.01034C12.8428 2.00719 12.9679 2.05548 13.0615 2.1446C13.6053 2.68093 14.0369 3.32017 14.3311 4.02504C14.6253 4.72991 14.7763 5.48629 14.7751 6.2501C14.7753 7.05734 14.6063 7.85566 14.279 8.59355C13.9516 9.33144 13.4732 9.99251 12.8746 10.5341C12.7801 10.6165 12.6575 10.6592 12.5323 10.6534C12.4071 10.6475 12.2889 10.5935 12.2026 10.5026C11.9779 10.2779 12.0094 9.9062 12.2404 9.68885C12.7092 9.24713 13.0827 8.71422 13.338 8.12287C13.5934 7.53152 13.7251 6.89421 13.7251 6.2501C13.7253 5.02155 13.247 3.84122 12.3916 2.9594ZM9.0001 4.9376C8.65201 4.9376 8.31817 5.07588 8.07203 5.32202C7.82588 5.56816 7.6876 5.902 7.6876 6.2501C7.6876 6.59819 7.82588 6.93203 8.07203 7.17817C8.31817 7.42432 8.65201 7.5626 9.0001 7.5626C9.3482 7.5626 9.68204 7.42432 9.92818 7.17817C10.1743 6.93203 10.3126 6.59819 10.3126 6.2501C10.3126 5.902 10.1743 5.56816 9.92818 5.32202C9.68204 5.07588 9.3482 4.9376 9.0001 4.9376Z"/>
        </svg>
      ),
      title: "Live Tracking of Crews, Barrels, and Trucks",
      description: "Every person and asset is visible on a live map. From drivers to inventory, everything is trackable, auditable, and fully documented."
    }
  ];

  return (
    <section className="comparison-section">
      <div className="comparison-decorations">
        <img src="images/torus.svg" alt="" className="decoration-torus" />
        <img src="images/sphere.svg" alt="" className="decoration-sphere" />
      </div>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">SYSTEM COMPARISON</div>
          <h2 className="section-title">
            What Changes with <span className="gradient-text">OverSiteAI</span>
          </h2>
          <p className="section-description">
            For years, oil and gas teams have relied on slow, disconnected systems that limit visibility and delay action. 
            OverSiteAI brings every part of the field into one intelligent platform, making operations faster, safer, and easier to manage.
          </p>
        </div>
        
        <div className="comparison-grid">
          <div className="comparison-column-traditional">
            <div className="column-header">
              <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
                <path className="icon-traditional-stroke" d="M9.3916 4.94155C11.4298 4.69866 13.4915 5.12952 15.2619 6.16835C17.0322 7.20717 18.4139 8.79687 19.196 10.6947C19.2689 10.8911 19.2689 11.1072 19.196 11.3037C18.8744 12.0833 18.4494 12.8161 17.9325 13.4824" strokeWidth="1.75"/>
                <path className="icon-traditional-stroke" d="M12.3236 12.8883C11.8285 13.3664 11.1655 13.631 10.4772 13.625C9.78892 13.6191 9.13054 13.343 8.64384 12.8563C8.15715 12.3696 7.88108 11.7112 7.8751 11.0229C7.86912 10.3347 8.1337 9.67159 8.61187 9.17651" strokeWidth="1.75"/>
                <path className="icon-traditional-stroke" d="M15.2941 15.8116C14.1334 16.4991 12.8384 16.929 11.4969 17.0719C10.1554 17.2149 8.79891 17.0676 7.51938 16.6401C6.23985 16.2126 5.06725 15.5148 4.08114 14.5942C3.09503 13.6736 2.31849 12.5516 1.8042 11.3044C1.73128 11.108 1.73128 10.8919 1.8042 10.6954C2.58001 8.81406 3.94504 7.23503 5.69445 6.19531" strokeWidth="1.75"/>
                <path className="icon-traditional-stroke" d="M1.75 2.25L19.25 19.75" strokeWidth="1.75"/>
              </svg>
              <h3>Traditional Operations</h3>
            </div>
            
            <div className="items-list">
              {traditionalItems.map((item, index) => (
                <div key={index} className="comparison-item">
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-content">
                    <h4 className="item-title">
                      {item.title}
                      <svg className="icon-svg-small" viewBox="0 0 14 15" fill="none">
                        <path className="icon-traditional-stroke" d="M9.3335 10.4167H12.8335V6.91675" strokeWidth="1.16667"/>
                        <path className="icon-traditional-stroke" d="M12.8332 10.4166L7.87484 5.45825L4.95817 8.37492L1.1665 4.58325" strokeWidth="1.16667"/>
                      </svg>
                    </h4>
                    <p className="item-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="comparison-column-oversite">
            <div className="column-header">
              <svg className="icon-svg" viewBox="0 0 21 22" fill="none">
                <path className="icon-oversite-stroke" d="M1.8042 11.3044C1.73128 11.108 1.73128 10.8919 1.8042 10.6954C2.51444 8.97332 3.72003 7.50086 5.26813 6.46474C6.81623 5.42861 8.63712 4.87549 10.5 4.87549C12.3628 4.87549 14.1837 5.42861 15.7318 6.46474C17.2799 7.50086 18.4855 8.97332 19.1957 10.6954C19.2686 10.8919 19.2686 11.108 19.1957 11.3044C18.4855 13.0266 17.2799 14.499 15.7318 15.5352C14.1837 16.5713 12.3628 17.1244 10.5 17.1244C8.63712 17.1244 6.81623 16.5713 5.26813 15.5352C3.72003 14.499 2.51444 13.0266 1.8042 11.3044Z" strokeWidth="1.75"/>
                <path className="icon-oversite-stroke" d="M10.5 13.625C11.9497 13.625 13.125 12.4497 13.125 11C13.125 9.55025 11.9497 8.375 10.5 8.375C9.05025 8.375 7.875 9.55025 7.875 11C7.875 12.4497 9.05025 13.625 10.5 13.625Z" strokeWidth="1.75"/>
              </svg>
              <h3>OverSiteAI Solution</h3>
            </div>
            
            <div className="items-list">
              {oversiteItems.map((item, index) => (
                <div key={index} className="comparison-item oversite-item">
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-content">
                    <h4 className="item-title">
                      {item.title}
                      <svg className="icon-svg-small" viewBox="0 0 14 15" fill="none">
                        <path className="icon-oversite-stroke" d="M9.3335 4.58325H12.8335V8.08325" strokeWidth="1.16667"/>
                        <path className="icon-oversite-stroke" d="M12.8332 4.58325L7.87484 9.54159L4.95817 6.62492L1.1665 10.4166" strokeWidth="1.16667"/>
                      </svg>
                    </h4>
                    <p className="item-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="working-together">
          <div className="working-text">Working Together Smarter</div>
          <div className="logo-banner">
            <div className="logos-scroll">
              {/* First set of logos */}
              <img src="images/partners/activecampaign.svg" alt="ActiveCampaign" className="partner-logo" />
              <img src="images/partners/attentive.svg" alt="Attentive" className="partner-logo" />
              <img src="images/partners/gumroad.svg" alt="Gumroad" className="partner-logo" />
              <img src="images/partners/lattice.svg" alt="Lattice" className="partner-logo" />
              <img src="images/partners/paypal.svg" alt="PayPal" className="partner-logo" />
              <img src="images/partners/spotify.svg" alt="Spotify" className="partner-logo" />
              <img src="images/partners/squarespace.svg" alt="Squarespace" className="partner-logo" />
              <img src="images/partners/zapier.svg" alt="Zapier" className="partner-logo" />
              
              {/* Duplicate set for seamless loop */}
              <img src="images/partners/activecampaign.svg" alt="ActiveCampaign" className="partner-logo" />
              <img src="images/partners/attentive.svg" alt="Attentive" className="partner-logo" />
              <img src="images/partners/gumroad.svg" alt="Gumroad" className="partner-logo" />
              <img src="images/partners/lattice.svg" alt="Lattice" className="partner-logo" />
              <img src="images/partners/paypal.svg" alt="PayPal" className="partner-logo" />
              <img src="images/partners/spotify.svg" alt="Spotify" className="partner-logo" />
              <img src="images/partners/squarespace.svg" alt="Squarespace" className="partner-logo" />
              <img src="images/partners/zapier.svg" alt="Zapier" className="partner-logo" />
              
              {/* Third set to ensure no gaps */}
              <img src="images/partners/activecampaign.svg" alt="ActiveCampaign" className="partner-logo" />
              <img src="images/partners/attentive.svg" alt="Attentive" className="partner-logo" />
              <img src="images/partners/gumroad.svg" alt="Gumroad" className="partner-logo" />
              <img src="images/partners/lattice.svg" alt="Lattice" className="partner-logo" />
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default ComparisonSection;

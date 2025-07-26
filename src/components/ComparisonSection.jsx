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
          <path className="icon-oversite" d="M5.72575 4.87545C5.65565 4.80393 5.57215 4.74692 5.48001 4.70768C5.38787 4.66844 5.2889 4.64774 5.18875 4.64676C5.08861 4.64579 4.98926 4.66456 4.89637 4.70199C4.80348 4.73943 4.71888 4.7948 4.6474 4.86495C3.83908 5.66898 3.19786 6.62502 2.76067 7.67798C2.32349 8.73093 2.09899 9.85999 2.1001 11.0001C2.09892 12.184 2.341 13.3555 2.81134 14.4419C3.28168 15.5283 3.97024 16.5066 4.8343 17.3159C4.97975 17.4503 5.17187 17.5228 5.36988 17.5179C5.56789 17.513 5.75619 17.4311 5.8948 17.2896C6.2266 16.9578 6.18565 16.4297 5.86645 16.1241C5.17293 15.4632 4.62104 14.6681 4.24433 13.7872C3.86761 12.9064 3.67395 11.9581 3.6751 11.0001C3.6751 9.0618 4.45315 7.3041 5.71525 6.0252C6.01975 5.71545 6.05125 5.20095 5.72575 4.87545Z"/>
        </svg>
      ),
      title: "Live Tracking of Crews, Barrels, and Trucks",
      description: "Every person and asset is visible on a live map. From drivers to inventory, everything is trackable, auditable, and fully documented."
    }
  ];

  return (
    <section className="comparison-section">
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
          <div className="comparison-column traditional">
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
                <div key={index} className="comparison-item traditional-item">
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
          
          <div className="comparison-column oversite">
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
              {/* Company logos would go here */}
              <div className="logo-item">SensorOps</div>
              <div className="logo-item">IntegratedSecure</div>
              <div className="logo-item">QuantumGuard</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

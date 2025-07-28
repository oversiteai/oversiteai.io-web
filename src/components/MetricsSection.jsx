import React from 'react';

const MetricsSection = () => {
  const metrics = [
    {
      icon: (
        <svg viewBox="0 0 29 28" fill="none">
          <path className="icon-metric" d="M8.16504 11.7361C8.16504 13.1624 9.33754 14.3174 10.79 14.3174C12.2425 14.3174 13.415 13.1624 13.415 11.7361C13.415 10.5899 12.9513 10.2574 10.79 7.75488C8.60254 10.2749 8.16504 10.5986 8.16504 11.7361ZM17.79 11.6924C18.2713 11.6924 18.665 11.2986 18.665 10.8174C18.665 10.3361 18.2713 9.94238 17.79 9.94238H16.915V4.69238H17.79C18.2713 4.69238 18.665 4.29863 18.665 3.81738C18.665 3.33613 18.2713 2.94238 17.79 2.94238H3.79004C3.30879 2.94238 2.91504 3.33613 2.91504 3.81738C2.91504 4.29863 3.30879 4.69238 3.79004 4.69238H4.66504V9.94238H3.79004C3.30879 9.94238 2.91504 10.3361 2.91504 10.8174C2.91504 11.2986 3.30879 11.6924 3.79004 11.6924H4.66504V16.9424H3.79004C3.30879 16.9424 2.91504 17.3361 2.91504 17.8174C2.91504 18.2986 3.30879 18.6924 3.79004 18.6924H17.79C18.2713 18.6924 18.665 18.2986 18.665 17.8174C18.665 17.3361 18.2713 16.9424 17.79 16.9424H16.915V11.6924H17.79ZM15.165 16.9424H6.41504V11.6924C6.89629 11.6924 7.29004 11.2986 7.29004 10.8174C7.29004 10.3361 6.89629 9.94238 6.41504 9.94238V4.69238H15.165V9.94238C14.6838 9.94238 14.29 10.3361 14.29 10.8174C14.29 11.2986 14.6838 11.6924 15.165 11.6924V16.9424Z"/>
        </svg>
      ),
      number: "1.4M",
      label: "barrels tracked",
      description: "Accurately logged with GPS-stamped records across multiple disposal and production sites."
    },
    {
      icon: (
        <svg viewBox="0 0 29 28" fill="none">
          <path className="icon-metric" d="M5.16683 4.6665C4.54799 4.6665 3.9545 4.91234 3.51691 5.34992C3.07933 5.78751 2.8335 6.381 2.8335 6.99984V11.6665C3.45233 11.6665 4.04583 11.9123 4.48341 12.3499C4.921 12.7875 5.16683 13.381 5.16683 13.9998C5.16683 14.6187 4.921 15.2122 4.48341 15.6498C4.04583 16.0873 3.45233 16.3332 2.8335 16.3332V20.9998C2.8335 21.6187 3.07933 22.2122 3.51691 22.6498C3.9545 23.0873 4.54799 23.3332 5.16683 23.3332H23.8335C24.4523 23.3332 25.0458 23.0873 25.4834 22.6498C25.921 22.2122 26.1668 21.6187 26.1668 20.9998V16.3332C25.548 16.3332 24.9545 16.0873 24.5169 15.6498C24.0793 15.2122 23.8335 14.6187 23.8335 13.9998C23.8335 13.381 24.0793 12.7875 24.5169 12.3499C24.9545 11.9123 25.548 11.6665 26.1668 11.6665V6.99984C26.1668 6.381 25.921 5.78751 25.4834 5.34992C25.0458 4.91234 24.4523 4.6665 23.8335 4.6665H5.16683ZM5.16683 6.99984H23.8335V9.96317C22.3868 10.7915 21.5002 12.3315 21.5002 13.9998C21.5002 15.6682 22.3868 17.2082 23.8335 18.0365V20.9998H5.16683V18.0365C6.6135 17.2082 7.50016 15.6682 7.50016 13.9998C7.50016 12.3315 6.6135 10.7915 5.16683 9.96317V6.99984Z"/>
        </svg>
      ),
      number: "15,000+",
      label: "field tickets auto-filled",
      description: "Automatically generated with location, time, and volume data—no manual entry needed."
    },
    {
      icon: (
        <svg viewBox="0 0 29 28" fill="none">
          <path className="icon-metric" fillRule="evenodd" clipRule="evenodd" d="M18.5128 5.25H8.375C7.83615 5.24984 7.31031 5.41551 6.86887 5.72452C6.42743 6.03352 6.09178 6.4709 5.9075 6.97725L14.0975 12.1888L18.5128 5.25ZM5.75 9.98725V20.125C5.75 21.259 6.46925 22.225 7.47725 22.5925L12.6888 14.4025L5.75 9.98725ZM10.4872 22.75H20.625C21.3212 22.75 21.9889 22.4734 22.4812 21.9812C22.9734 21.4889 23.25 20.8212 23.25 20.125V7.875C23.2502 7.33615 23.0845 6.81031 22.7755 6.36887C22.4665 5.92743 22.0291 5.59178 21.5227 5.4075L15.6078 14.7052L10.4872 22.75ZM3.125 7.875C3.125 6.48261 3.67812 5.14726 4.66269 4.16269C5.64726 3.17812 6.98261 2.625 8.375 2.625H20.625C22.0174 2.625 23.3527 3.17812 24.3373 4.16269C25.3219 5.14726 25.875 6.48261 25.875 7.875V20.125C25.875 21.5174 25.3219 22.8527 24.3373 23.8373C23.3527 24.8219 22.0174 25.375 20.625 25.375H8.375C6.98261 25.375 5.64726 24.8219 4.66269 23.8373C3.67812 22.8527 3.125 21.5174 3.125 20.125V7.875Z"/>
        </svg>
      ),
      number: "18,500+",
      label: "Geofencing Precision Events",
      description: "Geofenced zones enable precise automation of arrival, dispatch, and validation workflows."
    },
    {
      icon: (
        <svg viewBox="0 0 29 28" fill="none">
          <path className="icon-metric-stroke" d="M14.5002 25.6668C20.9435 25.6668 26.1668 20.4435 26.1668 14.0002C26.1668 7.55684 20.9435 2.3335 14.5002 2.3335C8.05684 2.3335 2.8335 7.55684 2.8335 14.0002C2.8335 20.4435 8.05684 25.6668 14.5002 25.6668Z" strokeWidth="2.33333"/>
          <path className="icon-metric-stroke" d="M14.5 21C18.366 21 21.5 17.866 21.5 14C21.5 10.134 18.366 7 14.5 7C10.634 7 7.5 10.134 7.5 14C7.5 17.866 10.634 21 14.5 21Z" strokeWidth="2.33333"/>
          <path className="icon-metric-stroke" d="M14.4998 16.3332C15.7885 16.3332 16.8332 15.2885 16.8332 13.9998C16.8332 12.7112 15.7885 11.6665 14.4998 11.6665C13.2112 11.6665 12.1665 12.7112 12.1665 13.9998C12.1665 15.2885 13.2112 16.3332 14.4998 16.3332Z" strokeWidth="2.33333"/>
        </svg>
      ),
      number: "99.9%",
      label: "GPS uptime in the field",
      description: "Reliable performance even in remote areas, ensuring full visibility at all times."
    }
  ];

  return (
    <section className="metrics-section">
      <video 
        className="neural-mesh-background"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={(e) => console.error('Video error:', e)}
        onLoadedData={() => console.log('Video loaded successfully')}
      >
        <source src="video/neural_net.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Field-Proven Metrics That Matter</div>
          <h2 className="section-title">Oversight You Can Measure</h2>
          <p className="section-description">
            Our platform doesn't just promise impact—it delivers it. From barrels tracked to uptime achieved, 
            these numbers reflect the real results our partners rely on every day.
          </p>
          {/* GPU Toggle for testing - uncomment to enable */}
          {/* <button 
            onClick={() => setDisableGPU(!disableGPU)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: disableGPU ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            GPU: {disableGPU ? 'DISABLED' : 'ENABLED'} (Click to toggle)
          </button> */}
        </div>
        
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-icon">
                {metric.icon}
              </div>
              
              <div className="metric-number">{metric.number}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-description">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;

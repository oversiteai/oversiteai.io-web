import React, { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // Get saved theme from localStorage or default to 'default'
    const savedTheme = localStorage.getItem('oversiteai-theme') || 'default';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('oversiteai-theme', newTheme);
  };

  const themes = [
    { value: 'default', label: 'Dark (High Contrast)', icon: '🌙' },
    { value: 'subtle', label: 'Dark (Subtle)', icon: '🌑' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'high-contrast', label: 'High Contrast', icon: '🔆' }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '2vw',
      right: '2vw',
      background: 'var(--Dark-BG)',
      border: '1px solid var(--Border)',
      borderRadius: '0.5vw',
      padding: '0.5vw',
      display: 'flex',
      gap: '0.5vw',
      zIndex: 9999,
      backdropFilter: 'blur(10px)'
    }}>
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => handleThemeChange(t.value)}
          title={t.label}
          style={{
            background: theme === t.value ? 'var(--Blue)' : 'transparent',
            border: 'none',
            borderRadius: '0.25vw',
            padding: '0.5vw',
            cursor: 'pointer',
            fontSize: '1.5vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5vw',
            height: '2.5vw',
            transition: 'all 0.3s ease'
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
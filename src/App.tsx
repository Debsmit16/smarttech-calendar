import React, { useState } from 'react';
import BasicCalendar from './components/BasicCalendar';

// Simple test App
const App: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  if (showCalendar) {
    return <BasicCalendar onBackToLanding={() => setShowCalendar(false)} />;
  }

  return (
    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: 'white' }}>
      <h1>🧠 SmartTech Calendar</h1>
      <p>A Smart Calendar for Hackathons, Seminars & Tech Events</p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setShowCalendar(true)}
          style={{ padding: '1rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem' }}
        >
          Try Demo Calendar
        </button>
        <button
          style={{ padding: '1rem 2rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem' }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default App;

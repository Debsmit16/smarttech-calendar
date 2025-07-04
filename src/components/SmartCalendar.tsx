import React, { useState, useEffect } from 'react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { parseEventInput } from '../utils/eventParser';
import ImageUpload from './ui/ImageUpload';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  location: string;
}

interface SmartCalendarProps {
  onBackToLanding?: () => void;
}

const SmartCalendar: React.FC<SmartCalendarProps> = ({ onBackToLanding }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "React Hackathon 2024",
      date: "2024-07-15",
      time: "09:00",
      type: "hackathon",
      description: "Build amazing React applications in 48 hours",
      location: "Tech Hub, San Francisco"
    },
    {
      id: 2,
      title: "AI/ML Conference",
      date: "2024-07-20",
      time: "10:00",
      type: "conference",
      description: "Latest trends in Artificial Intelligence and Machine Learning",
      location: "Convention Center, NYC"
    },
    {
      id: 3,
      title: "DevOps Seminar",
      date: "2024-07-25",
      time: "14:00",
      type: "seminar",
      description: "Modern DevOps practices and tools",
      location: "Online"
    }
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'hackathon',
    description: '',
    location: ''
  });
  const [quickInput, setQuickInput] = useState('');
  const [parseConfidence, setParseConfidence] = useState<number | null>(null);

  // Voice input hook
  const {
    transcript,
    isListening,
    isSupported: isVoiceSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    continuous: false,
    interimResults: true,
    language: 'en-US',
  });

  // Get calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  // Navigate months
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Add new event
  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, {
        ...newEvent,
        id: Date.now()
      }]);
      setNewEvent({
        title: '',
        date: '',
        time: '',
        type: 'hackathon',
        description: '',
        location: ''
      });
      setShowAddEvent(false);
    }
  };

  // Enhanced AI-powered event parsing
  const parseQuickInput = (input: string) => {
    const parsed = parseEventInput(input);
    setParseConfidence(parsed.confidence);
    return {
      title: parsed.title,
      type: parsed.type,
      date: parsed.date,
      time: parsed.time,
      description: parsed.description,
      location: parsed.location
    };
  };

  // Handle quick input submission
  const handleQuickInput = () => {
    if (quickInput.trim()) {
      const parsedEvent = parseQuickInput(quickInput);
      setEvents([...events, {
        ...parsedEvent,
        id: Date.now()
      }]);
      setQuickInput('');
      // Clear confidence after a delay
      setTimeout(() => setParseConfidence(null), 3000);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Update quick input when voice transcript changes
  useEffect(() => {
    if (transcript && !isListening) {
      setQuickInput(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  // Handle event data from image OCR
  const handleImageEventExtracted = (eventData: any) => {
    setEvents([...events, {
      ...eventData,
      id: Date.now()
    }]);
    setShowImageUpload(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="smart-calendar">
      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-title">
          <h1>🗓️ TechCal - Smart Calendar for Engineers</h1>
          <p>Manage your hackathons, conferences, and tech events intelligently</p>
          {onBackToLanding && (
            <button onClick={onBackToLanding} className="btn btn-outline">
              ← Back to Home
            </button>
          )}
        </div>

        {/* Quick Input Bar */}
        <div className="quick-input-bar">
          <div className="input-group">
            <input
              type="text"
              placeholder="🤖 Smart Input: 'AI Summit tomorrow at 2 PM' or 'React workshop next Monday morning online'"
              value={quickInput || transcript}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickInput()}
              className="quick-input"
            />
            <button onClick={handleQuickInput} className="btn btn-primary">Add</button>
            <button
              onClick={handleVoiceInput}
              className={`btn btn-voice ${isListening ? 'listening' : ''}`}
              disabled={!isVoiceSupported}
              title={!isVoiceSupported ? 'Voice input not supported in this browser' : ''}
            >
              {isListening ? '🎤 Listening...' : '🎤 Voice'}
            </button>
            <button
              onClick={() => setShowImageUpload(true)}
              className="btn btn-secondary"
              title="Upload event poster for OCR extraction"
            >
              📷 Image
            </button>
          </div>
          {isListening && transcript && (
            <div className="voice-transcript" style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              Hearing: "{transcript}"
            </div>
          )}
          {voiceError && (
            <div className="voice-error" style={{
              color: '#ff6b6b',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(255,107,107,0.1)',
              borderRadius: '4px'
            }}>
              {voiceError}
            </div>
          )}
          {parseConfidence !== null && (
            <div className="parse-confidence" style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: parseConfidence > 0.8 ? 'rgba(76,175,80,0.2)' :
                         parseConfidence > 0.6 ? 'rgba(255,193,7,0.2)' : 'rgba(255,107,107,0.2)',
              borderRadius: '4px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🤖 AI Confidence: {Math.round(parseConfidence * 100)}%</span>
              {parseConfidence > 0.8 && <span>✅ High</span>}
              {parseConfidence > 0.6 && parseConfidence <= 0.8 && <span>⚠️ Medium</span>}
              {parseConfidence <= 0.6 && <span>❌ Low</span>}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-nav">
        <button onClick={() => navigateMonth(-1)} className="nav-btn">‹</button>
        <h2 className="current-month">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => navigateMonth(1)} className="nav-btn">›</button>
        <button onClick={() => setShowAddEvent(true)} className="btn btn-primary add-event-btn">
          + Add Event
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-grid">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}

          {/* Calendar days */}
          {getDaysInMonth().map((day, index) => {
            const dayEvents = getEventsForDate(day);
            return (
              <div key={index} className={`calendar-day ${day ? 'has-day' : 'empty-day'}`}>
                {day && (
                  <>
                    <span className="day-number">{day}</span>
                    <div className="day-events">
                      {dayEvents.map(event => (
                        <div key={event.id} className={`event-item ${event.type}`}>
                          <span className="event-time">{event.time}</span>
                          <span className="event-title">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event List Sidebar */}
      <div className="events-sidebar">
        <h3>Upcoming Tech Events</h3>
        <div className="events-list">
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(event => (
              <div key={event.id} className={`event-card ${event.type}`}>
                <div className="event-header">
                  <h4>{event.title}</h4>
                  <span className={`event-type-badge ${event.type}`}>
                    {event.type === 'hackathon' ? '🏆' : event.type === 'conference' ? '🎯' : '📚'}
                    {event.type}
                  </span>
                </div>
                <div className="event-details">
                  <p><strong>📅 Date:</strong> {event.date}</p>
                  <p><strong>⏰ Time:</strong> {event.time}</p>
                  <p><strong>📍 Location:</strong> {event.location}</p>
                  <p><strong>📝 Description:</strong> {event.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="modal-overlay" onClick={() => setShowAddEvent(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Tech Event</h3>
              <button onClick={() => setShowAddEvent(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g., React Hackathon 2024"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="hackathon">🏆 Hackathon</option>
                  <option value="conference">🎯 Conference</option>
                  <option value="seminar">📚 Seminar/Workshop</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="e.g., Tech Hub, San Francisco or Online"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Brief description of the event..."
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowAddEvent(false)} className="btn btn-outline">Cancel</button>
                <button onClick={addEvent} className="btn btn-primary">Add Event</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          onEventExtracted={handleImageEventExtracted}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  );
};

export default SmartCalendar;

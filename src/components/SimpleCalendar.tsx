import React, { useState, useEffect } from 'react';
import { parseEventInput } from '../utils/eventParser';
import { useVoiceInput } from '../hooks/useVoiceInput';
import ImageUpload from './ui/ImageUpload';
import EventFeed from './EventFeed';
import NotificationCenter from './NotificationCenter';
import { NotificationService } from '../services/notificationService';
import { RecommendationService } from '../services/recommendationService';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  location: string;
}

interface SimpleCalendarProps {
  onBackToLanding?: () => void;
}

type ViewMode = 'calendar' | 'feed' | 'recommendations';

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ onBackToLanding }) => {
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
    }
  ]);
  const [quickInput, setQuickInput] = useState('');
  const [parseConfidence, setParseConfidence] = useState<number | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Services
  const notificationService = NotificationService.getInstance();
  const recommendationService = RecommendationService.getInstance();

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

  // Setup notifications
  useEffect(() => {
    const updateNotificationCount = () => {
      const unreadNotifications = notificationService.getNotifications(true);
      setNotificationCount(unreadNotifications.length);
    };

    // Initial count
    updateNotificationCount();

    // Listen for new notifications
    const handleNewNotification = () => {
      updateNotificationCount();
    };

    notificationService.addListener(handleNewNotification);

    return () => {
      notificationService.removeListener(handleNewNotification);
    };
  }, []);

  // Schedule notifications for existing events
  useEffect(() => {
    events.forEach(event => {
      notificationService.scheduleEventNotifications(event);
    });
  }, [events]);

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

  // Handle event data from image OCR
  const handleImageEventExtracted = (eventData: any) => {
    const newEvent = {
      ...eventData,
      id: Date.now()
    };
    setEvents([...events, newEvent]);
    setShowImageUpload(false);

    // Schedule notifications for the new event
    notificationService.scheduleEventNotifications(newEvent);
  };

  // Handle adding event from feed
  const handleAddEventFromFeed = (eventData: any) => {
    const newEvent = {
      ...eventData,
      id: Date.now()
    };
    setEvents([...events, newEvent]);

    // Schedule notifications
    notificationService.scheduleEventNotifications(newEvent);

    // Show success notification
    notificationService.generateAchievementNotification(
      'Event Added',
      `"${eventData.title}" has been added to your calendar!`
    );
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

          {/* Navigation Tabs */}
          <div className="nav-tabs">
            <button
              className={`nav-tab ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar
            </button>
            <button
              className={`nav-tab ${viewMode === 'feed' ? 'active' : ''}`}
              onClick={() => setViewMode('feed')}
            >
              🌟 Discover Events
            </button>
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(true)}
            >
              🔔 Notifications
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
          </div>

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
              placeholder="🤖 Smart Input: 'AI Summit tomorrow at 2 PM' or 'React workshop next Monday'"
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
          </div>
          {isListening && transcript && (
            <div className="voice-transcript" style={{
              marginTop: '1rem',
              padding: '1rem 1.5rem',
              background: 'rgba(76, 175, 80, 0.2)',
              borderRadius: '16px',
              fontSize: '1rem',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2)',
              animation: 'pulse 1.5s infinite'
            }}>
              🎤 Hearing: "{transcript}"
            </div>
          )}
          {voiceError && (
            <div className="voice-error" style={{
              color: '#ffffff',
              fontSize: '0.9rem',
              marginTop: '1rem',
              padding: '1rem 1.5rem',
              background: 'rgba(255, 107, 107, 0.2)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              boxShadow: '0 4px 16px rgba(255, 107, 107, 0.2)'
            }}>
              ⚠️ {voiceError}
            </div>
          )}
          {parseConfidence !== null && (
            <div className="parse-confidence" style={{
              marginTop: '1rem',
              padding: '1rem 1.5rem',
              background: parseConfidence > 0.8 ? 'rgba(76,175,80,0.2)' :
                         parseConfidence > 0.6 ? 'rgba(255,193,7,0.2)' : 'rgba(255,107,107,0.2)',
              borderRadius: '16px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${parseConfidence > 0.8 ? 'rgba(76,175,80,0.3)' :
                                  parseConfidence > 0.6 ? 'rgba(255,193,7,0.3)' : 'rgba(255,107,107,0.3)'}`,
              boxShadow: `0 4px 16px ${parseConfidence > 0.8 ? 'rgba(76,175,80,0.2)' :
                                     parseConfidence > 0.6 ? 'rgba(255,193,7,0.2)' : 'rgba(255,107,107,0.2)'}`,
              animation: 'fadeInUp 0.5s ease-out'
            }}>
              <span style={{ fontWeight: '600' }}>🤖 AI Confidence: {Math.round(parseConfidence * 100)}%</span>
              {parseConfidence > 0.8 && <span style={{ background: 'rgba(76,175,80,0.3)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.9rem' }}>✅ High</span>}
              {parseConfidence > 0.6 && parseConfidence <= 0.8 && <span style={{ background: 'rgba(255,193,7,0.3)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.9rem' }}>⚠️ Medium</span>}
              {parseConfidence <= 0.6 && <span style={{ background: 'rgba(255,107,107,0.3)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.9rem' }}>❌ Low</span>}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'calendar' && (
        <>
          {/* Calendar Navigation */}
          <div className="calendar-nav">
            <button onClick={() => navigateMonth(-1)} className="nav-btn">‹</button>
            <h2 className="current-month">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={() => navigateMonth(1)} className="nav-btn">›</button>
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
        </>
      )}

      {/* Event Feed View */}
      {viewMode === 'feed' && (
        <EventFeed onAddEvent={handleAddEventFromFeed} />
      )}

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
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

export default SimpleCalendar;

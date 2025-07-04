import React, { useState, useEffect } from 'react';
import { EventFeedService, FeedEvent, EventFilters } from '../services/eventFeedService';

interface EventFeedProps {
  onAddEvent: (event: any) => void;
}

const EventFeed: React.FC<EventFeedProps> = ({ onAddEvent }) => {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'recommended'>('all');
  const [filters, setFilters] = useState<EventFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const eventService = EventFeedService.getInstance();

  useEffect(() => {
    loadEvents();
    loadTrendingEvents();
  }, [filters]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const feedEvents = await eventService.getEventFeed(filters);
      setEvents(feedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingEvents = async () => {
    try {
      const trending = await eventService.getTrendingEvents();
      setTrendingEvents(trending);
    } catch (error) {
      console.error('Failed to load trending events:', error);
    }
  };

  const handleAddToCalendar = (feedEvent: FeedEvent) => {
    const calendarEvent = {
      title: feedEvent.title,
      date: feedEvent.date,
      time: feedEvent.time,
      type: feedEvent.type,
      description: feedEvent.description,
      location: feedEvent.location,
      platform: feedEvent.platform,
      tags: feedEvent.tags,
      registrationUrl: feedEvent.registrationUrl,
      organizer: feedEvent.organizer
    };
    onAddEvent(calendarEvent);
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      devpost: '🏆',
      hackerearth: '🌍',
      eventbrite: '🎫',
      meetup: '👥',
      github: '🐙',
      local: '📍'
    };
    return icons[platform as keyof typeof icons] || '📅';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      hackathon: '#ff9800',
      conference: '#2196f3',
      seminar: '#4caf50',
      workshop: '#9c27b0',
      meetup: '#ff5722',
      webinar: '#607d8b'
    };
    return colors[type as keyof typeof colors] || '#666';
  };

  const currentEvents = activeTab === 'trending' ? trendingEvents : events;

  return (
    <div className="event-feed">
      {/* Header */}
      <div className="feed-header">
        <h2>🌟 Discover Tech Events</h2>
        <p>Find hackathons, conferences, and workshops from top platforms</p>
        
        {/* Tabs */}
        <div className="feed-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Events ({events.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('trending')}
          >
            🔥 Trending ({trendingEvents.length})
          </button>
          <button 
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Event Type:</label>
            <div className="filter-options">
              {['hackathon', 'conference', 'seminar', 'workshop', 'meetup', 'webinar'].map(type => (
                <label key={type} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.type?.includes(type) || false}
                    onChange={(e) => {
                      const newTypes = filters.type || [];
                      if (e.target.checked) {
                        setFilters({...filters, type: [...newTypes, type]});
                      } else {
                        setFilters({...filters, type: newTypes.filter(t => t !== type)});
                      }
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Platform:</label>
            <div className="filter-options">
              {['devpost', 'hackerearth', 'eventbrite', 'meetup', 'github', 'local'].map(platform => (
                <label key={platform} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.platform?.includes(platform) || false}
                    onChange={(e) => {
                      const newPlatforms = filters.platform || [];
                      if (e.target.checked) {
                        setFilters({...filters, platform: [...newPlatforms, platform]});
                      } else {
                        setFilters({...filters, platform: newPlatforms.filter(p => p !== platform)});
                      }
                    }}
                  />
                  {getPlatformIcon(platform)} {platform}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.isOnline || false}
                onChange={(e) => setFilters({...filters, isOnline: e.target.checked ? true : undefined})}
              />
              Online Events Only
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.isFree || false}
                onChange={(e) => setFilters({...filters, isFree: e.target.checked ? true : undefined})}
              />
              Free Events Only
            </label>
          </div>

          <button 
            className="clear-filters-btn"
            onClick={() => setFilters({})}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading amazing events...</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && (
        <div className="events-grid">
          {currentEvents.map(event => (
            <div key={event.id} className="feed-event-card">
              <div className="event-card-header">
                <div className="event-platform">
                  {getPlatformIcon(event.platform)} {event.platform}
                </div>
                <div className="event-rating">
                  {event.rating && (
                    <>⭐ {event.rating}</>
                  )}
                </div>
              </div>

              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>

              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏰</span>
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{event.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <div className="event-tags">
                {event.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="event-tag">{tag}</span>
                ))}
                {event.tags.length > 3 && (
                  <span className="event-tag more">+{event.tags.length - 3}</span>
                )}
              </div>

              <div className="event-meta">
                <span 
                  className="event-type-badge"
                  style={{ backgroundColor: getTypeColor(event.type) }}
                >
                  {event.type}
                </span>
                <span className="event-difficulty">{event.difficulty}</span>
                {event.prize && (
                  <span className="event-prize">🏆 {event.prize}</span>
                )}
              </div>

              <div className="event-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAddToCalendar(event)}
                >
                  ➕ Add to Calendar
                </button>
                {event.registrationUrl && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.open(event.registrationUrl, '_blank')}
                  >
                    🔗 Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && currentEvents.length === 0 && (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Try adjusting your filters or check back later for new events.</p>
        </div>
      )}
    </div>
  );
};

export default EventFeed;

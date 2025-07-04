import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockEvents } from '../../data/mockData';
import { formatDate, getDaysUntil } from '../../utils';

interface EventsOverviewProps {
  onCreateEvent: () => void;
}

const EventsOverview: React.FC<EventsOverviewProps> = ({ onCreateEvent }) => {
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'draft': 'status-badge status-draft',
      'published': 'status-badge status-published',
      'registration_open': 'status-badge status-open',
      'registration_closed': 'status-badge status-closed',
      'in_progress': 'status-badge status-progress',
      'judging': 'status-badge status-judging',
      'completed': 'status-badge status-completed',
      'cancelled': 'status-badge status-cancelled',
    };

    return (
      <span className={statusStyles[status as keyof typeof statusStyles] || 'status-badge'}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <div>
          <h2 className="content-title">Events</h2>
          <p className="content-subtitle">
            {user?.role === 'organizer' && 'Manage your hackathon events'}
            {user?.role === 'participant' && 'Discover and join hackathons'}
            {user?.role === 'judge' && 'Events you are judging'}
          </p>
        </div>
        {user?.role === 'organizer' && (
          <button className="btn btn-primary" onClick={onCreateEvent}>
            Create Event
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">
              {user?.role === 'organizer' ? '3' : '12'}
            </div>
            <div className="stat-label">
              {user?.role === 'organizer' ? 'Events Created' : 'Available Events'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">
              {user?.role === 'organizer' ? '247' : '5'}
            </div>
            <div className="stat-label">
              {user?.role === 'organizer' ? 'Total Participants' : 'Teams Joined'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-number">
              {user?.role === 'organizer' ? '45' : '2'}
            </div>
            <div className="stat-label">
              {user?.role === 'organizer' ? 'Projects Submitted' : 'Awards Won'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      <div className="events-grid">
        {mockEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3 className="event-title">{event.title}</h3>
              {getStatusBadge(event.status)}
            </div>
            
            <p className="event-description">{event.description}</p>
            
            <div className="event-meta">
              <div className="event-meta-item">
                <span className="meta-label">Theme:</span>
                <span className="meta-value">{event.theme}</span>
              </div>
              <div className="event-meta-item">
                <span className="meta-label">Start Date:</span>
                <span className="meta-value">{formatDate(event.startDate)}</span>
              </div>
              <div className="event-meta-item">
                <span className="meta-label">Team Size:</span>
                <span className="meta-value">{event.minTeamSize}-{event.maxTeamSize} members</span>
              </div>
            </div>

            <div className="event-stats">
              <div className="event-stat">
                <span className="stat-value">
                  {event.status === 'registration_open' ? getDaysUntil(event.registrationDeadline) : 0}
                </span>
                <span className="stat-label">Days to Register</span>
              </div>
              <div className="event-stat">
                <span className="stat-value">${event.prizes[0]?.value || 'TBD'}</span>
                <span className="stat-label">Prize Pool</span>
              </div>
            </div>

            <div className="event-actions">
              {user?.role === 'participant' && event.status === 'registration_open' && (
                <button className="btn btn-primary btn-sm">Register</button>
              )}
              {user?.role === 'organizer' && (
                <>
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-secondary btn-sm">View Details</button>
                </>
              )}
              {user?.role === 'judge' && (
                <button className="btn btn-secondary btn-sm">View Submissions</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsOverview;

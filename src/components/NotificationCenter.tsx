import React, { useState, useEffect } from 'react';
import { NotificationService } from '../services/notificationService';
import type { Notification } from '../services/notificationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  const [loading, setLoading] = useState(true);

  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    loadNotifications();
    
    // Listen for new notifications
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    notificationService.addListener(handleNewNotification);

    return () => {
      notificationService.removeListener(handleNewNotification);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, filter]);

  const loadNotifications = () => {
    setLoading(true);
    const allNotifications = notificationService.getNotifications(filter === 'unread');
    setNotifications(allNotifications.sort((a, b) => 
      new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
    ));
    setLoading(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleDismiss = (notificationId: string) => {
    notificationService.dismissNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleSnooze = (notificationId: string) => {
    notificationService.snoozeNotification(notificationId, 60);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) {
        notificationService.markAsRead(n.id);
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      reminder: '⏰',
      deadline: '⚠️',
      recommendation: '💡',
      update: '📢',
      achievement: '🏆'
    };
    return icons[type as keyof typeof icons] || '📅';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#ff5722',
      urgent: '#f44336'
    };
    return colors[priority as keyof typeof colors] || '#666';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-center" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notification-header">
          <h3>🔔 Notifications</h3>
          <div className="notification-controls">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </button>
            </div>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="notification-actions">
            <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
              ✓ Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔕</div>
              <h4>No notifications</h4>
              <p>You're all caught up! New notifications will appear here.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-content">
                  <div className="notification-main">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-text">
                      <h4 className="notification-title">{notification.title}</h4>
                      <p className="notification-message">{notification.message}</p>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {formatTime(notification.scheduledFor)}
                        </span>
                        <span 
                          className="notification-priority"
                          style={{ color: getPriorityColor(notification.priority) }}
                        >
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="notification-item-actions">
                    {!notification.isRead && (
                      <button 
                        className="action-btn read-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    
                    {notification.actions?.map(action => (
                      <button 
                        key={action.id}
                        className={`action-btn ${action.action}-btn`}
                        onClick={() => {
                          if (action.action === 'snooze') {
                            handleSnooze(notification.id);
                          } else if (action.url) {
                            window.open(action.url, '_blank');
                          }
                        }}
                        title={action.label}
                      >
                        {action.action === 'view' && '👁️'}
                        {action.action === 'register' && '📝'}
                        {action.action === 'snooze' && '⏰'}
                        {action.action === 'dismiss' && '✕'}
                      </button>
                    ))}
                    
                    <button 
                      className="action-btn dismiss-btn"
                      onClick={() => handleDismiss(notification.id)}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Priority indicator */}
                <div 
                  className="priority-indicator"
                  style={{ backgroundColor: getPriorityColor(notification.priority) }}
                ></div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="notification-footer">
          <button className="settings-btn">
            ⚙️ Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

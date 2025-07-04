// Smart Notification Service with AI-powered scheduling

export interface Notification {
  id: string;
  type: 'reminder' | 'deadline' | 'recommendation' | 'update' | 'achievement';
  title: string;
  message: string;
  eventId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor: Date;
  isRead: boolean;
  isDelivered: boolean;
  actions?: NotificationAction[];
  metadata?: any;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: 'view' | 'register' | 'dismiss' | 'snooze' | 'add_to_calendar';
  url?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  types: {
    reminders: boolean;
    deadlines: boolean;
    recommendations: boolean;
    updates: boolean;
    achievements: boolean;
  };
  timing: {
    beforeEvent: number[]; // hours before event
    beforeDeadline: number[]; // hours before deadline
  };
  channels: {
    browser: boolean;
    email: boolean;
    push: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences;
  private listeners: ((notification: Notification) => void)[] = [];

  constructor() {
    this.preferences = this.getDefaultPreferences();
    this.setupBrowserNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      enabled: true,
      types: {
        reminders: true,
        deadlines: true,
        recommendations: true,
        updates: true,
        achievements: true
      },
      timing: {
        beforeEvent: [24, 2, 0.5], // 24h, 2h, 30min before
        beforeDeadline: [72, 24, 6, 1] // 3 days, 1 day, 6h, 1h before
      },
      channels: {
        browser: true,
        email: false,
        push: false
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    };
  }

  private async setupBrowserNotifications() {
    if ('Notification' in window && this.preferences.channels.browser) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  }

  // Schedule smart notifications for an event
  scheduleEventNotifications(event: any): void {
    if (!this.preferences.enabled) return;

    const eventDate = new Date(`${event.date} ${event.time}`);
    const now = new Date();

    // Schedule reminders before event
    this.preferences.timing.beforeEvent.forEach(hoursBefore => {
      const notificationTime = new Date(eventDate.getTime() - hoursBefore * 60 * 60 * 1000);
      
      if (notificationTime > now) {
        const notification: Notification = {
          id: `reminder-${event.id}-${hoursBefore}h`,
          type: 'reminder',
          title: `Upcoming: ${event.title}`,
          message: this.generateReminderMessage(event, hoursBefore),
          eventId: event.id,
          priority: this.calculatePriority(hoursBefore, event),
          scheduledFor: notificationTime,
          isRead: false,
          isDelivered: false,
          actions: [
            {
              id: 'view',
              label: 'View Event',
              action: 'view'
            },
            {
              id: 'snooze',
              label: 'Remind in 1h',
              action: 'snooze'
            }
          ],
          metadata: { hoursBefore, eventType: event.type }
        };

        this.scheduleNotification(notification);
      }
    });

    // Schedule deadline reminders if event has registration deadline
    if (event.registrationDeadline) {
      const deadlineDate = new Date(event.registrationDeadline);
      
      this.preferences.timing.beforeDeadline.forEach(hoursBefore => {
        const notificationTime = new Date(deadlineDate.getTime() - hoursBefore * 60 * 60 * 1000);
        
        if (notificationTime > now) {
          const notification: Notification = {
            id: `deadline-${event.id}-${hoursBefore}h`,
            type: 'deadline',
            title: `Registration Deadline Approaching`,
            message: `Registration for "${event.title}" closes in ${this.formatTimeRemaining(hoursBefore)}`,
            eventId: event.id,
            priority: 'high',
            scheduledFor: notificationTime,
            isRead: false,
            isDelivered: false,
            actions: [
              {
                id: 'register',
                label: 'Register Now',
                action: 'register',
                url: event.registrationUrl
              }
            ]
          };

          this.scheduleNotification(notification);
        }
      });
    }
  }

  private generateReminderMessage(event: any, hoursBefore: number): string {
    const timeText = this.formatTimeRemaining(hoursBefore);
    const messages = {
      24: `Don't forget! "${event.title}" starts in ${timeText}. Time to prepare! 🚀`,
      2: `Starting soon! "${event.title}" begins in ${timeText}. Get ready! ⏰`,
      0.5: `Last call! "${event.title}" starts in ${timeText}. Join now! 🔥`
    };

    return messages[hoursBefore as keyof typeof messages] || 
           `"${event.title}" starts in ${timeText}`;
  }

  private formatTimeRemaining(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.round(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
  }

  private calculatePriority(hoursBefore: number, event: any): 'low' | 'medium' | 'high' | 'urgent' {
    if (hoursBefore <= 0.5) return 'urgent';
    if (hoursBefore <= 2) return 'high';
    if (hoursBefore <= 24) return 'medium';
    return 'low';
  }

  private scheduleNotification(notification: Notification): void {
    this.notifications.push(notification);
    
    const delay = notification.scheduledFor.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        this.deliverNotification(notification);
      }, delay);
    }
  }

  private async deliverNotification(notification: Notification): Promise<void> {
    if (!this.preferences.enabled || !this.preferences.types[notification.type + 's' as keyof typeof this.preferences.types]) {
      return;
    }

    // Check quiet hours
    if (this.isQuietHours()) {
      // Reschedule for after quiet hours
      const nextDeliveryTime = this.getNextAvailableTime();
      notification.scheduledFor = nextDeliveryTime;
      this.scheduleNotification(notification);
      return;
    }

    notification.isDelivered = true;

    // Browser notification
    if (this.preferences.channels.browser && 'Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        actions: notification.actions?.map(action => ({
          action: action.id,
          title: action.label
        })) || []
      });

      browserNotification.onclick = () => {
        this.handleNotificationClick(notification);
        browserNotification.close();
      };
    }

    // Notify listeners (for in-app notifications)
    this.listeners.forEach(listener => listener(notification));
  }

  private isQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.preferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private getNextAvailableTime(): Date {
    const now = new Date();
    const [endHour, endMin] = this.preferences.quietHours.end.split(':').map(Number);
    
    const nextAvailable = new Date(now);
    nextAvailable.setHours(endHour, endMin, 0, 0);
    
    if (nextAvailable <= now) {
      nextAvailable.setDate(nextAvailable.getDate() + 1);
    }
    
    return nextAvailable;
  }

  private handleNotificationClick(notification: Notification): void {
    // Mark as read
    notification.isRead = true;
    
    // Handle default action (usually view)
    if (notification.eventId) {
      // Navigate to event details
      window.dispatchEvent(new CustomEvent('navigate-to-event', {
        detail: { eventId: notification.eventId }
      }));
    }
  }

  // Public methods
  getNotifications(unreadOnly: boolean = false): Notification[] {
    return this.notifications.filter(n => !unreadOnly || !n.isRead);
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  dismissNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  snoozeNotification(notificationId: string, minutes: number = 60): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.scheduledFor = new Date(Date.now() + minutes * 60 * 1000);
      notification.isDelivered = false;
      this.scheduleNotification(notification);
    }
  }

  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
  }

  addListener(listener: (notification: Notification) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (notification: Notification) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Generate achievement notifications
  generateAchievementNotification(achievement: string, description: string): void {
    const notification: Notification = {
      id: `achievement-${Date.now()}`,
      type: 'achievement',
      title: `🏆 Achievement Unlocked!`,
      message: `${achievement}: ${description}`,
      priority: 'medium',
      scheduledFor: new Date(),
      isRead: false,
      isDelivered: false,
      actions: [
        {
          id: 'view',
          label: 'View Achievements',
          action: 'view'
        }
      ]
    };

    this.deliverNotification(notification);
  }
}

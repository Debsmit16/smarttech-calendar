// Event Feed Service - Simulates real API calls to various platforms

export interface FeedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  type: 'hackathon' | 'conference' | 'seminar' | 'workshop' | 'meetup' | 'webinar';
  platform: 'devpost' | 'hackerearth' | 'eventbrite' | 'meetup' | 'github' | 'local';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prize?: string;
  registrationUrl?: string;
  imageUrl?: string;
  organizer: string;
  attendees?: number;
  maxAttendees?: number;
  isOnline: boolean;
  isFree: boolean;
  rating?: number;
}

// Mock data simulating real event feeds
const mockEventFeeds: FeedEvent[] = [
  {
    id: 'dev1',
    title: 'Global AI Hackathon 2024',
    description: 'Build the next generation of AI applications. $50,000 in prizes!',
    date: '2024-08-15',
    endDate: '2024-08-17',
    time: '09:00',
    location: 'San Francisco, CA',
    type: 'hackathon',
    platform: 'devpost',
    tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow'],
    difficulty: 'intermediate',
    prize: '$50,000',
    registrationUrl: 'https://devpost.com/ai-hackathon',
    imageUrl: '/api/placeholder/400/200',
    organizer: 'TechCorp Inc.',
    attendees: 1250,
    maxAttendees: 2000,
    isOnline: false,
    isFree: true,
    rating: 4.8
  },
  {
    id: 'he1',
    title: 'React Native Mobile Challenge',
    description: 'Create innovative mobile apps using React Native. Win latest smartphones!',
    date: '2024-07-28',
    endDate: '2024-07-30',
    time: '10:00',
    location: 'Online',
    type: 'hackathon',
    platform: 'hackerearth',
    tags: ['React Native', 'Mobile', 'JavaScript', 'iOS', 'Android'],
    difficulty: 'beginner',
    prize: 'iPhone 15 Pro',
    registrationUrl: 'https://hackerearth.com/react-challenge',
    organizer: 'HackerEarth',
    attendees: 890,
    maxAttendees: 1500,
    isOnline: true,
    isFree: true,
    rating: 4.6
  },
  {
    id: 'eb1',
    title: 'Web3 & Blockchain Summit',
    description: 'Explore the future of decentralized web. Industry leaders speaking.',
    date: '2024-08-05',
    time: '14:00',
    location: 'Austin, TX',
    type: 'conference',
    platform: 'eventbrite',
    tags: ['Blockchain', 'Web3', 'Cryptocurrency', 'DeFi', 'NFT'],
    difficulty: 'advanced',
    registrationUrl: 'https://eventbrite.com/web3-summit',
    organizer: 'Blockchain Association',
    attendees: 450,
    maxAttendees: 500,
    isOnline: false,
    isFree: false,
    rating: 4.9
  },
  {
    id: 'mu1',
    title: 'JavaScript Developers Meetup',
    description: 'Monthly meetup for JS developers. Networking and tech talks.',
    date: '2024-07-25',
    time: '18:30',
    location: 'Seattle, WA',
    type: 'meetup',
    platform: 'meetup',
    tags: ['JavaScript', 'Node.js', 'React', 'Vue', 'Angular'],
    difficulty: 'beginner',
    organizer: 'Seattle JS Community',
    attendees: 85,
    maxAttendees: 100,
    isOnline: false,
    isFree: true,
    rating: 4.4
  },
  {
    id: 'gh1',
    title: 'Open Source Contribution Workshop',
    description: 'Learn how to contribute to open source projects effectively.',
    date: '2024-07-30',
    time: '16:00',
    location: 'Online',
    type: 'workshop',
    platform: 'github',
    tags: ['Open Source', 'Git', 'GitHub', 'Collaboration'],
    difficulty: 'beginner',
    organizer: 'GitHub Education',
    attendees: 320,
    maxAttendees: 500,
    isOnline: true,
    isFree: true,
    rating: 4.7
  },
  {
    id: 'loc1',
    title: 'DevOps Automation Seminar',
    description: 'Advanced DevOps practices and automation tools.',
    date: '2024-08-10',
    time: '13:00',
    location: 'New York, NY',
    type: 'seminar',
    platform: 'local',
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'AWS'],
    difficulty: 'advanced',
    organizer: 'NYC Tech Hub',
    attendees: 120,
    maxAttendees: 150,
    isOnline: false,
    isFree: false,
    rating: 4.5
  },
  {
    id: 'web1',
    title: 'Cybersecurity Fundamentals Webinar',
    description: 'Essential cybersecurity practices for developers.',
    date: '2024-07-26',
    time: '11:00',
    location: 'Online',
    type: 'webinar',
    platform: 'eventbrite',
    tags: ['Cybersecurity', 'Security', 'Ethical Hacking', 'Privacy'],
    difficulty: 'intermediate',
    organizer: 'CyberSec Institute',
    attendees: 680,
    maxAttendees: 1000,
    isOnline: true,
    isFree: true,
    rating: 4.3
  }
];

export interface EventFilters {
  type?: string[];
  platform?: string[];
  difficulty?: string[];
  isOnline?: boolean;
  isFree?: boolean;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
}

export class EventFeedService {
  private static instance: EventFeedService;
  private events: FeedEvent[] = mockEventFeeds;

  static getInstance(): EventFeedService {
    if (!EventFeedService.instance) {
      EventFeedService.instance = new EventFeedService();
    }
    return EventFeedService.instance;
  }

  // Simulate API call with delay
  private async simulateApiCall<T>(data: T, delay: number = 1000): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }

  async getEventFeed(filters?: EventFilters): Promise<FeedEvent[]> {
    let filteredEvents = [...this.events];

    if (filters) {
      if (filters.type?.length) {
        filteredEvents = filteredEvents.filter(event => 
          filters.type!.includes(event.type)
        );
      }

      if (filters.platform?.length) {
        filteredEvents = filteredEvents.filter(event => 
          filters.platform!.includes(event.platform)
        );
      }

      if (filters.difficulty?.length) {
        filteredEvents = filteredEvents.filter(event => 
          filters.difficulty!.includes(event.difficulty)
        );
      }

      if (filters.isOnline !== undefined) {
        filteredEvents = filteredEvents.filter(event => 
          event.isOnline === filters.isOnline
        );
      }

      if (filters.isFree !== undefined) {
        filteredEvents = filteredEvents.filter(event => 
          event.isFree === filters.isFree
        );
      }

      if (filters.tags?.length) {
        filteredEvents = filteredEvents.filter(event => 
          filters.tags!.some(tag => 
            event.tags.some(eventTag => 
              eventTag.toLowerCase().includes(tag.toLowerCase())
            )
          )
        );
      }

      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= startDate && eventDate <= endDate;
        });
      }

      if (filters.location) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
    }

    // Sort by date (upcoming first)
    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return this.simulateApiCall(filteredEvents, 800);
  }

  async getTrendingEvents(): Promise<FeedEvent[]> {
    const trending = this.events
      .filter(event => event.rating && event.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return this.simulateApiCall(trending, 600);
  }

  async getRecommendedEvents(userInterests: string[]): Promise<FeedEvent[]> {
    const recommended = this.events.filter(event => 
      event.tags.some(tag => 
        userInterests.some(interest => 
          tag.toLowerCase().includes(interest.toLowerCase())
        )
      )
    ).slice(0, 6);

    return this.simulateApiCall(recommended, 700);
  }

  async getEventById(id: string): Promise<FeedEvent | null> {
    const event = this.events.find(e => e.id === id);
    return this.simulateApiCall(event || null, 300);
  }

  getAllTags(): string[] {
    const allTags = this.events.flatMap(event => event.tags);
    return [...new Set(allTags)].sort();
  }

  getAllPlatforms(): string[] {
    const platforms = this.events.map(event => event.platform);
    return [...new Set(platforms)].sort();
  }
}

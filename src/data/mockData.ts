import type { User, Event, Team, Project, Announcement, ScheduleItem, Score } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'organizer',
    bio: 'Experienced hackathon organizer and tech enthusiast.',
    skills: ['JavaScript', 'React', 'Node.js', 'Event Management'],
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'judge',
    bio: 'Senior software engineer with 10+ years of experience.',
    skills: ['Python', 'Machine Learning', 'Data Science', 'AI'],
    github: 'https://github.com/janesmith',
    linkedin: 'https://linkedin.com/in/janesmith',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    email: 'alex.johnson@example.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: 'participant',
    bio: 'Full-stack developer passionate about creating innovative solutions.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com/alexjohnson',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    email: 'sarah.wilson@example.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'participant',
    bio: 'UI/UX designer and frontend developer.',
    skills: ['Figma', 'React', 'CSS', 'Design Systems'],
    github: 'https://github.com/sarahwilson',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '5',
    email: 'mike.brown@example.com',
    firstName: 'Mike',
    lastName: 'Brown',
    role: 'participant',
    bio: 'Backend developer specializing in cloud architecture.',
    skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
    github: 'https://github.com/mikebrown',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'TechHack 2024',
    description: 'A 48-hour hackathon focused on building innovative tech solutions for real-world problems.',
    theme: 'Sustainability & Climate Change',
    startDate: new Date('2024-03-15T09:00:00'),
    endDate: new Date('2024-03-17T18:00:00'),
    registrationDeadline: new Date('2024-03-10T23:59:59'),
    maxTeamSize: 4,
    minTeamSize: 2,
    maxTeams: 50,
    status: 'registration_open',
    organizerId: '1',
    organizer: mockUsers[0],
    prizes: [
      {
        id: '1',
        position: 1,
        title: 'First Place',
        description: 'Winner of TechHack 2024',
        value: '$5,000',
      },
      {
        id: '2',
        position: 2,
        title: 'Second Place',
        description: 'Runner-up of TechHack 2024',
        value: '$3,000',
      },
      {
        id: '3',
        position: 3,
        title: 'Third Place',
        description: 'Third place winner',
        value: '$1,000',
      },
    ],
    rules: [
      'Teams must consist of 2-4 members',
      'All code must be written during the hackathon',
      'Projects must be submitted by the deadline',
      'Use of external APIs is allowed',
      'Plagiarism will result in disqualification',
    ],
    judgeIds: ['2'],
    judges: [mockUsers[1]],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    title: 'AI Innovation Challenge',
    description: 'Explore the possibilities of artificial intelligence and machine learning.',
    theme: 'Artificial Intelligence',
    startDate: new Date('2024-04-20T10:00:00'),
    endDate: new Date('2024-04-21T20:00:00'),
    registrationDeadline: new Date('2024-04-15T23:59:59'),
    maxTeamSize: 3,
    minTeamSize: 1,
    status: 'draft',
    organizerId: '1',
    organizer: mockUsers[0],
    prizes: [
      {
        id: '4',
        position: 1,
        title: 'Grand Prize',
        description: 'Best AI Innovation',
        value: '$10,000',
      },
    ],
    rules: [
      'Individual or team participation allowed',
      'Must use AI/ML technologies',
      'Open source solutions preferred',
    ],
    judgeIds: ['2'],
    judges: [mockUsers[1]],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Code Crusaders',
    description: 'A team of passionate developers ready to tackle any challenge.',
    eventId: '1',
    leaderId: '3',
    leader: mockUsers[2],
    members: [
      {
        id: '1',
        userId: '3',
        user: mockUsers[2],
        teamId: '1',
        role: 'leader',
        joinedAt: new Date('2024-02-15'),
      },
      {
        id: '2',
        userId: '4',
        user: mockUsers[3],
        teamId: '1',
        role: 'member',
        joinedAt: new Date('2024-02-16'),
      },
    ],
    invitations: [],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-16'),
  },
  {
    id: '2',
    name: 'Innovation Squad',
    description: 'Building the future, one line of code at a time.',
    eventId: '1',
    leaderId: '5',
    leader: mockUsers[4],
    members: [
      {
        id: '3',
        userId: '5',
        user: mockUsers[4],
        teamId: '2',
        role: 'leader',
        joinedAt: new Date('2024-02-20'),
      },
    ],
    invitations: [],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'EcoTracker',
    description: 'A mobile app that helps users track their carbon footprint and suggests eco-friendly alternatives.',
    teamId: '1',
    team: mockTeams[0],
    repositoryUrl: 'https://github.com/codecrusaders/ecotracker',
    demoUrl: 'https://ecotracker-demo.vercel.app',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Express'],
    files: [],
    submissions: [],
    createdAt: new Date('2024-02-16'),
    updatedAt: new Date('2024-02-20'),
  },
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to TechHack 2024!',
    content: 'We are excited to announce the launch of TechHack 2024. Registration is now open!',
    eventId: '1',
    authorId: '1',
    author: mockUsers[0],
    priority: 'high',
    isPublished: true,
    publishedAt: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    title: 'Registration Deadline Reminder',
    content: 'Don\'t forget to register for TechHack 2024! Registration closes on March 10th.',
    eventId: '1',
    authorId: '1',
    author: mockUsers[0],
    priority: 'medium',
    isPublished: true,
    publishedAt: new Date('2024-03-05'),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
];

// Mock Schedule
export const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    title: 'Registration & Check-in',
    description: 'Welcome participants and distribute swag bags',
    eventId: '1',
    startTime: new Date('2024-03-15T09:00:00'),
    endTime: new Date('2024-03-15T10:00:00'),
    location: 'Main Lobby',
    type: 'registration',
    isRequired: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    title: 'Opening Ceremony',
    description: 'Welcome speech and hackathon kickoff',
    eventId: '1',
    startTime: new Date('2024-03-15T10:00:00'),
    endTime: new Date('2024-03-15T11:00:00'),
    location: 'Main Auditorium',
    type: 'opening',
    isRequired: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    title: 'Lunch Break',
    description: 'Networking lunch for all participants',
    eventId: '1',
    startTime: new Date('2024-03-15T12:00:00'),
    endTime: new Date('2024-03-15T13:00:00'),
    location: 'Cafeteria',
    type: 'meal',
    isRequired: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// Mock Scores
export const mockScores: Score[] = [
  {
    id: '1',
    submissionId: '1',
    submission: {} as any, // Will be populated when submissions are created
    judgeId: '2',
    judge: mockUsers[1],
    criteria: [
      {
        id: '1',
        name: 'Innovation',
        description: 'How innovative and creative is the solution?',
        maxScore: 25,
        score: 22,
        weight: 1,
      },
      {
        id: '2',
        name: 'Technical Implementation',
        description: 'Quality of code and technical execution',
        maxScore: 25,
        score: 20,
        weight: 1,
      },
      {
        id: '3',
        name: 'Impact',
        description: 'Potential impact and usefulness of the solution',
        maxScore: 25,
        score: 23,
        weight: 1,
      },
      {
        id: '4',
        name: 'Presentation',
        description: 'Quality of presentation and demo',
        maxScore: 25,
        score: 18,
        weight: 1,
      },
    ],
    totalScore: 83,
    feedback: 'Great innovative solution with solid technical implementation. The presentation could be improved.',
    createdAt: new Date('2024-03-17'),
    updatedAt: new Date('2024-03-17'),
  },
];

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get event by ID
export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

// Helper function to get teams by event ID
export const getTeamsByEventId = (eventId: string): Team[] => {
  return mockTeams.filter(team => team.eventId === eventId);
};

// Helper function to get announcements by event ID
export const getAnnouncementsByEventId = (eventId: string): Announcement[] => {
  return mockAnnouncements.filter(announcement => announcement.eventId === eventId);
};

// Helper function to get schedule by event ID
export const getScheduleByEventId = (eventId: string): ScheduleItem[] => {
  return mockSchedule.filter(item => item.eventId === eventId);
};

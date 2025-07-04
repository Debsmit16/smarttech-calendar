// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'participant' | 'organizer' | 'judge';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  theme?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxTeamSize: number;
  minTeamSize: number;
  maxTeams?: number;
  status: EventStatus;
  organizerId: string;
  organizer: User;
  prizes: Prize[];
  rules: string[];
  judgeIds: string[];
  judges: User[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'in_progress' | 'judging' | 'completed' | 'cancelled';

export interface Prize {
  id: string;
  position: number;
  title: string;
  description: string;
  value?: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  eventId: string;
  leaderId: string;
  leader: User;
  members: TeamMember[];
  invitations: TeamInvitation[];
  project?: Project;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  user: User;
  teamId: string;
  role: TeamMemberRole;
  joinedAt: Date;
}

export type TeamMemberRole = 'leader' | 'member';

export interface TeamInvitation {
  id: string;
  teamId: string;
  team: Team;
  invitedUserId: string;
  invitedUser: User;
  invitedByUserId: string;
  invitedBy: User;
  status: InvitationStatus;
  message?: string;
  createdAt: Date;
  expiresAt: Date;
}

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  teamId: string;
  team: Team;
  repositoryUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  technologies: string[];
  files: ProjectFile[];
  submissions: Submission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
}

export interface Submission {
  id: string;
  projectId: string;
  project: Project;
  eventId: string;
  submittedAt: Date;
  isLate: boolean;
  scores: Score[];
  finalScore?: number;
  rank?: number;
}

// Judging Types
export interface Score {
  id: string;
  submissionId: string;
  submission: Submission;
  judgeId: string;
  judge: User;
  criteria: ScoreCriteria[];
  totalScore: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScoreCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  score: number;
  weight: number;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  eventId: string;
  authorId: string;
  author: User;
  priority: AnnouncementPriority;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

// Schedule Types
export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  eventId: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: ScheduleItemType;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ScheduleItemType = 'registration' | 'opening' | 'workshop' | 'meal' | 'presentation' | 'judging' | 'closing' | 'networking' | 'other';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface CreateEventForm {
  title: string;
  description: string;
  theme?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  maxTeams?: number;
  rules: string[];
  prizes: Omit<Prize, 'id'>[];
}

export interface CreateTeamForm {
  name: string;
  description?: string;
}

export interface ProjectSubmissionForm {
  title: string;
  description: string;
  repositoryUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  technologies: string[];
}

// Utility Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

export interface Stats {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

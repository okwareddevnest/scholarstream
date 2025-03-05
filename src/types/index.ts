export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string;
  subjects: string[];
  education: string;
  hourlyRate?: number; // For tutors
  availability?: Availability[]; // For tutors
  profileImage?: string;
}

export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface Assignment {
  id: string;
  studentId: string;
  tutorId?: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;
  status: 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  files?: string[];
}

export interface Session {
  id: string;
  assignmentId: string;
  studentId: string;
  tutorId: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  sessionId: string;
  studentId: string;
  tutorId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  sessionId: string;
  studentId: string;
  tutorId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}
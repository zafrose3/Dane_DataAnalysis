
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'OD' | 'HOLIDAY' | 'NONE';

export type AppTheme = 'modern' | 'retro';

export interface Subject {
  id: string;
  name: string;
  target: number;
  lastUpdated: number;
  // Key is YYYY-MM-DD, Value is array of statuses for multiple classes
  history: Record<string, AttendanceStatus[]>;
}

export interface UserProfile {
  name: string;
  rollNumber: string;
  institution: string;
  overallTarget: number;
  theme: AppTheme;
}

export interface AttendanceState {
  subjects: Subject[];
  profile: UserProfile;
}

export type ActionType = 'PRESENT' | 'ABSENT' | 'OD' | 'HOLIDAY';

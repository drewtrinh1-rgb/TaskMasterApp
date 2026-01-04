/**
 * Project model for long-term applications and projects
 */

export type ProjectStatus = 'planning' | 'in-progress' | 'submitted' | 'completed' | 'rejected' | 'accepted';

export interface ProjectMilestone {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  notes?: string;
}

export interface ProjectNote {
  id: string;
  content: string;
  createdAt: Date;
  tags?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  category: 'fellowship' | 'scholarship' | 'speaking' | 'leadership' | 'event' | 'other';
  
  // Timeline
  applicationOpenDate?: Date;
  applicationDeadline?: Date;
  notificationDate?: Date;
  programStartDate?: Date;
  programEndDate?: Date;
  
  // Progress tracking
  progress: number; // 0-100
  milestones: ProjectMilestone[];
  
  // Notes and questions
  notes: ProjectNote[];
  questions: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  url?: string;
  priority: 'high' | 'medium' | 'low';
  archived?: boolean;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  category: Project['category'];
  applicationOpenDate?: Date;
  applicationDeadline?: Date;
  notificationDate?: Date;
  programStartDate?: Date;
  programEndDate?: Date;
  url?: string;
  priority?: Project['priority'];
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  category?: Project['category'];
  applicationOpenDate?: Date;
  applicationDeadline?: Date;
  notificationDate?: Date;
  programStartDate?: Date;
  programEndDate?: Date;
  progress?: number;
  url?: string;
  priority?: Project['priority'];
}

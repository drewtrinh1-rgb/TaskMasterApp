/**
 * Data models and types for the Categorized To-Do List application
 */

/**
 * Enum representing the 8 predefined categories
 */
export enum Category {
  SELF_CARE = 'self-care',
  EXERCISE = 'exercise',
  WORK = 'work',
  FRIENDS_SOCIAL = 'friends-social',
  TASKS = 'tasks',
  IMPORTANT_PRIORITY = 'important-priority',
  PARTNER = 'partner',
  KNOWLEDGE_HUB = 'knowledge-hub'
}

/**
 * Configuration for each category including display name, color, and keywords
 */
export interface CategoryConfig {
  name: string;
  color: string;
  keywords: string[];
}

/**
 * Map of category configurations
 */
export const CATEGORY_CONFIGS: Record<Category, CategoryConfig> = {
  [Category.SELF_CARE]: {
    name: 'Self Care',
    color: '#FFD700',
    keywords: ['meditation', 'spa', 'relax', 'sleep', 'therapy', 'mindfulness', 'self-care', 'rest', 'nap', 'massage', 'skincare', 'bath', 'wellness']
  },
  [Category.EXERCISE]: {
    name: 'Exercise',
    color: '#FFA500',
    keywords: [
      'gym', 'workout', 'run', 'yoga', 'fitness', 'exercise', 'jog', 'swim', 'bike', 'hike', 'walk', 'training',
      'badminton', 'tennis', 'basketball', 'football', 'soccer', 'volleyball', 'golf', 'cricket', 'baseball',
      'hockey', 'rugby', 'boxing', 'martial', 'karate', 'judo', 'taekwondo', 'kickboxing', 'mma',
      'pilates', 'crossfit', 'spinning', 'aerobics', 'zumba', 'stretching', 'cardio', 'weights', 'lifting',
      'squash', 'racquetball', 'ping pong', 'table tennis', 'skiing', 'snowboard', 'skating', 'climbing',
      'rowing', 'kayak', 'surf', 'diving', 'marathon', 'triathlon', 'cycling', 'jogging', 'treadmill',
      'sport', 'sports', 'game', 'match', 'practice', 'play', 'court', 'field', 'track'
    ]
  },
  [Category.WORK]: {
    name: 'Work',
    color: '#4169E1',
    keywords: [
      'meeting', 'deadline', 'project', 'email', 'presentation', 'client', 'work', 'office', 'report', 'boss',
      'conference', 'interview', 'review', 'proposal', 'budget', 'invoice', 'contract', 'negotiate',
      'colleague', 'team', 'manager', 'employee', 'hr', 'salary', 'promotion', 'career', 'job',
      'spreadsheet', 'document', 'memo', 'agenda', 'minutes', 'quarterly', 'annual', 'kpi'
    ]
  },
  [Category.FRIENDS_SOCIAL]: {
    name: 'Friends/Social',
    color: '#32CD32',
    keywords: [
      'dinner', 'party', 'hangout', 'catch up', 'birthday', 'friends', 'social', 'lunch', 'drinks', 'gathering',
      'brunch', 'coffee', 'meetup', 'reunion', 'celebration', 'wedding', 'shower', 'bbq', 'picnic',
      'movie', 'concert', 'festival', 'club', 'bar', 'restaurant', 'outing', 'trip', 'vacation',
      'game night', 'karaoke', 'bowling', 'escape room', 'potluck', 'housewarming'
    ]
  },
  [Category.TASKS]: {
    name: 'Tasks',
    color: '#9370DB',
    keywords: [
      'todo', 'task', 'errand', 'chore', 'buy', 'get', 'pick up', 'return', 'fix', 'clean',
      'laundry', 'dishes', 'vacuum', 'mop', 'grocery', 'shopping', 'mail', 'package', 'delivery',
      'appointment', 'schedule', 'book', 'reserve', 'renew', 'cancel', 'pay', 'bill', 'bank'
    ]
  },
  [Category.IMPORTANT_PRIORITY]: {
    name: 'Important/Priority',
    color: '#DC143C',
    keywords: [
      'urgent', 'asap', 'critical', 'important', 'priority', 'emergency', 'must', 'deadline',
      'immediately', 'now', 'today', 'crucial', 'essential', 'vital', 'key', 'top priority',
      'high priority', 'time sensitive', 'overdue', 'late', 'reminder'
    ]
  },
  [Category.PARTNER]: {
    name: 'Partner',
    color: '#FF69B4',
    keywords: [
      'date', 'anniversary', 'romantic', 'together', 'couple', 'partner', 'spouse', 'husband', 'wife',
      'boyfriend', 'girlfriend', 'valentine', 'love', 'relationship', 'dinner date', 'movie date',
      'surprise', 'gift for', 'flowers', 'chocolate', 'honeymoon', 'engagement', 'wedding anniversary'
    ]
  },
  [Category.KNOWLEDGE_HUB]: {
    name: 'Knowledge Hub',
    color: '#20B2AA',
    keywords: [
      'remember', 'note', 'likes', 'favorite', 'gift idea', 'preference', 'info', 'fact', 'reference',
      'idea', 'thought', 'inspiration', 'quote', 'bookmark', 'save', 'learn', 'research', 'study',
      'recipe', 'tip', 'trick', 'hack', 'recommendation', 'suggestion', 'wishlist', 'bucket list'
    ]
  }
};

/**
 * Type distinguishing actionable tasks from informational notes
 */
export type ItemType = 'task' | 'note' | 'habit';

/**
 * Priority level for tasks
 */
export type Priority = 'daily-focus' | 'normal' | 'low';

/**
 * Effort level for tasks (2-minute rule)
 */
export type EffortLevel = 'quick' | 'medium' | 'long';

/**
 * Habit streak tracking
 */
export interface HabitStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: Date;
  totalCompletions: number;
  completionDates: Date[];
  missedYesterday?: boolean; // For "never miss twice" tracking
}

/**
 * Implementation intention (when/where/how)
 */
export interface ImplementationIntention {
  time?: string; // e.g., "7:00 AM"
  location?: string; // e.g., "Kitchen"
  duration?: number; // in minutes
  trigger?: string; // What happens before this
}

/**
 * Habit stacking - link to another habit
 */
export interface HabitStack {
  afterHabitId?: string; // ID of the habit this comes after
  stackDescription?: string; // e.g., "After I make coffee, I will meditate"
}

/**
 * Main Item interface representing a task or note
 */
export interface Item {
  id: string;
  description: string;
  category: Category;
  type: ItemType;
  completed: boolean;
  dueDate?: Date;
  location?: string;
  tags?: string[];
  createdAt: Date;
  completedAt?: Date;
  
  // Phase 1 additions
  priority?: Priority;
  effortLevel?: EffortLevel;
  isHabit?: boolean;
  habitStreak?: HabitStreak;
  points?: number;
  
  // Phase 2 additions
  implementationIntention?: ImplementationIntention;
  habitStack?: HabitStack;
  isTemplate?: boolean;
  templateName?: string;
}

/**
 * Input for creating a new item (without auto-generated fields)
 */
export interface CreateItemInput {
  description: string;
  category?: Category;
  type?: ItemType;
  dueDate?: Date;
  location?: string;
  tags?: string[];
  priority?: Priority;
  effortLevel?: EffortLevel;
  isHabit?: boolean;
  implementationIntention?: ImplementationIntention;
  habitStack?: HabitStack;
  isTemplate?: boolean;
  templateName?: string;
}

/**
 * Input for updating an existing item
 */
export interface UpdateItemInput {
  description?: string;
  category?: Category;
  dueDate?: Date | null;
  location?: string | null;
  tags?: string[];
  priority?: Priority;
  effortLevel?: EffortLevel;
  isHabit?: boolean;
  implementationIntention?: ImplementationIntention;
  habitStack?: HabitStack;
}

/**
 * Type guard to check if a value is a valid Category
 */
export function isValidCategory(value: unknown): value is Category {
  return Object.values(Category).includes(value as Category);
}

/**
 * Type guard to check if a value is a valid ItemType
 */
export function isValidItemType(value: unknown): value is ItemType {
  return value === 'task' || value === 'note';
}

/**
 * Type guard to validate an Item object
 */
export function isValidItem(value: unknown): value is Item {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  const item = value as Record<string, unknown>;
  
  return (
    typeof item.id === 'string' &&
    typeof item.description === 'string' &&
    isValidCategory(item.category) &&
    isValidItemType(item.type) &&
    typeof item.completed === 'boolean' &&
    item.createdAt instanceof Date
  );
}

/**
 * Validates that a description is non-empty (not just whitespace)
 */
export function isValidDescription(description: string): boolean {
  return description.trim().length > 0;
}

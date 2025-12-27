/**
 * ItemManager - Handles CRUD operations for items with validation and auto-categorization
 */

import { generateUUID } from '../utils/uuid';
import { Item, Category, CreateItemInput, UpdateItemInput, isValidDescription } from '../models/index';
import { StorageManager } from './StorageManager';
import { CategorizationEngine } from './CategorizationEngine';

/**
 * Error thrown when item operations fail
 */
export class ItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ItemError';
  }
}

/**
 * ItemManager class for managing items
 */
export class ItemManager {
  private storageManager: StorageManager;
  private categorizationEngine: CategorizationEngine;

  constructor(storageManager: StorageManager, categorizationEngine: CategorizationEngine) {
    this.storageManager = storageManager;
    this.categorizationEngine = categorizationEngine;
  }

  /**
   * Create a new item with validation and auto-categorization
   */
  async createItem(input: CreateItemInput): Promise<Item> {
    // Validate description
    if (!isValidDescription(input.description)) {
      throw new ItemError('Description cannot be empty or whitespace only');
    }

    // Determine category (manual override or auto-categorize)
    const category = input.category ?? this.categorizationEngine.categorize(input.description);

    // Determine type (manual override or auto-detect)
    // Knowledge Hub items are always notes
    let type = input.type ?? this.categorizationEngine.detectType(input.description);
    if (category === Category.KNOWLEDGE_HUB) {
      type = 'note';
    }
    
    // If marked as habit, ensure it's a task
    if (input.isHabit && type === 'note') {
      type = 'task';
    }

    // Create the item
    const item: Item = {
      id: generateUUID(),
      description: input.description.trim(),
      category,
      type,
      completed: false,
      dueDate: input.dueDate,
      location: input.location,
      tags: input.tags,
      createdAt: new Date(),
      priority: input.priority || 'normal',
      effortLevel: input.effortLevel,
      isHabit: input.isHabit || false,
      habitStreak: input.isHabit ? {
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        completionDates: []
      } : undefined,
      points: 0,
      implementationIntention: input.implementationIntention,
      habitStack: input.habitStack,
      isTemplate: input.isTemplate || false,
      templateName: input.templateName
    };

    // Save to storage
    await this.storageManager.saveItem(item);

    return item;
  }

  /**
   * Get an item by ID
   */
  async getItem(id: string): Promise<Item | null> {
    return this.storageManager.getItem(id);
  }

  /**
   * Get all items
   */
  async getAllItems(): Promise<Item[]> {
    return this.storageManager.getAllItems();
  }

  /**
   * Update an existing item
   */
  async updateItem(id: string, updates: UpdateItemInput): Promise<Item> {
    const existing = await this.storageManager.getItem(id);
    if (!existing) {
      throw new ItemError(`Item with id ${id} not found`);
    }

    // Validate description if being updated
    if (updates.description !== undefined && !isValidDescription(updates.description)) {
      throw new ItemError('Description cannot be empty or whitespace only');
    }

    // Build the update object
    const itemUpdates: Partial<Item> = {};

    if (updates.description !== undefined) {
      itemUpdates.description = updates.description.trim();
    }

    if (updates.category !== undefined) {
      itemUpdates.category = updates.category;
    }

    // Handle optional fields that can be cleared (null) or updated
    if (updates.dueDate === null) {
      itemUpdates.dueDate = undefined;
    } else if (updates.dueDate !== undefined) {
      itemUpdates.dueDate = updates.dueDate;
    }

    if (updates.location === null) {
      itemUpdates.location = undefined;
    } else if (updates.location !== undefined) {
      itemUpdates.location = updates.location;
    }

    if (updates.tags !== undefined) {
      itemUpdates.tags = updates.tags;
    }
    
    if (updates.priority !== undefined) {
      itemUpdates.priority = updates.priority;
    }
    
    if (updates.effortLevel !== undefined) {
      itemUpdates.effortLevel = updates.effortLevel;
    }
    
    if (updates.isHabit !== undefined) {
      itemUpdates.isHabit = updates.isHabit;
      // Initialize habit streak if becoming a habit
      if (updates.isHabit && !existing.habitStreak) {
        itemUpdates.habitStreak = {
          currentStreak: 0,
          longestStreak: 0,
          totalCompletions: 0,
          completionDates: []
        };
      }
    }
    
    if (updates.implementationIntention !== undefined) {
      itemUpdates.implementationIntention = updates.implementationIntention;
    }
    
    if (updates.habitStack !== undefined) {
      itemUpdates.habitStack = updates.habitStack;
    }

    await this.storageManager.updateItem(id, itemUpdates);

    // Return the updated item
    const updated = await this.storageManager.getItem(id);
    if (!updated) {
      throw new ItemError('Failed to retrieve updated item');
    }

    return updated;
  }

  /**
   * Delete an item
   */
  async deleteItem(id: string): Promise<void> {
    await this.storageManager.deleteItem(id);
  }

  /**
   * Mark a task as complete
   */
  async markComplete(id: string): Promise<Item> {
    const existing = await this.storageManager.getItem(id);
    if (!existing) {
      throw new ItemError(`Item with id ${id} not found`);
    }

    if (existing.type === 'note') {
      throw new ItemError('Notes cannot be marked as complete');
    }

    const now = new Date();
    const updates: Partial<Item> = {
      completed: true,
      completedAt: now
    };

    // Handle habit streak tracking
    if (existing.isHabit && existing.habitStreak) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastCompleted = existing.habitStreak.lastCompletedDate 
        ? new Date(existing.habitStreak.lastCompletedDate) 
        : null;
      
      if (lastCompleted) {
        lastCompleted.setHours(0, 0, 0, 0);
      }

      // Check if already completed today
      if (lastCompleted && lastCompleted.getTime() === today.getTime()) {
        // Already completed today, don't update streak
        updates.completed = true;
        updates.completedAt = now;
      } else {
        // Calculate new streak
        let newStreak = 1;
        let missedYesterday = false;
        
        if (lastCompleted) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastCompleted.getTime() === yesterday.getTime()) {
            // Consecutive day
            newStreak = (existing.habitStreak.currentStreak || 0) + 1;
            missedYesterday = false;
          } else {
            // Check if missed yesterday (never miss twice)
            const dayBeforeYesterday = new Date(today);
            dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
            
            if (lastCompleted.getTime() === dayBeforeYesterday.getTime()) {
              // Missed yesterday but completing today (never miss twice!)
              newStreak = (existing.habitStreak.currentStreak || 0) + 1;
              missedYesterday = true;
            } else {
              // Streak broken, start over
              newStreak = 1;
              missedYesterday = false;
            }
          }
        }

        const newCompletionDates = [
          ...(existing.habitStreak.completionDates || []),
          today
        ];

        updates.habitStreak = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, existing.habitStreak.longestStreak || 0),
          lastCompletedDate: today,
          totalCompletions: (existing.habitStreak.totalCompletions || 0) + 1,
          completionDates: newCompletionDates,
          missedYesterday: false // Reset since we're completing today
        };

        // Award points based on streak
        const basePoints = 10;
        const streakBonus = Math.min(newStreak * 2, 50); // Max 50 bonus points
        const recoveryBonus = missedYesterday ? 10 : 0; // Bonus for never missing twice
        updates.points = (existing.points || 0) + basePoints + streakBonus + recoveryBonus;
      }
    } else {
      // Regular task - award base points
      const basePoints = existing.effortLevel === 'quick' ? 5 : 10;
      const priorityBonus = existing.priority === 'daily-focus' ? 15 : 0;
      updates.points = (existing.points || 0) + basePoints + priorityBonus;
    }

    await this.storageManager.updateItem(id, updates);

    const updated = await this.storageManager.getItem(id);
    if (!updated) {
      throw new ItemError('Failed to retrieve updated item');
    }

    return updated;
  }

  /**
   * Mark a task as incomplete
   */
  async markIncomplete(id: string): Promise<Item> {
    const existing = await this.storageManager.getItem(id);
    if (!existing) {
      throw new ItemError(`Item with id ${id} not found`);
    }

    if (existing.type === 'note') {
      throw new ItemError('Notes cannot be marked as incomplete');
    }

    await this.storageManager.updateItem(id, {
      completed: false,
      completedAt: undefined
    });

    const updated = await this.storageManager.getItem(id);
    if (!updated) {
      throw new ItemError('Failed to retrieve updated item');
    }

    return updated;
  }

  /**
   * Load items from storage
   */
  async loadItems(): Promise<Item[]> {
    return this.storageManager.loadFromStorage();
  }

  /**
   * Get suggested category for a description
   */
  getSuggestedCategory(description: string): Category {
    return this.categorizationEngine.categorize(description);
  }
  
  /**
   * Set task priority
   */
  async setPriority(id: string, priority: 'daily-focus' | 'normal' | 'low' | null): Promise<Item> {
    const existing = await this.storageManager.getItem(id);
    if (!existing) {
      throw new ItemError(`Item with id ${id} not found`);
    }

    await this.storageManager.updateItem(id, {
      priority: priority || 'normal'
    });

    const updated = await this.storageManager.getItem(id);
    if (!updated) {
      throw new ItemError('Failed to retrieve updated item');
    }

    return updated;
  }
  
  /**
   * Check and update habits for "never miss twice" tracking
   */
  async checkMissedHabits(): Promise<void> {
    const items = await this.getAllItems();
    const habits = items.filter(i => i.isHabit && i.habitStreak);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    for (const habit of habits) {
      if (!habit.habitStreak) continue;
      
      const lastCompleted = habit.habitStreak.lastCompletedDate 
        ? new Date(habit.habitStreak.lastCompletedDate)
        : null;
      
      if (lastCompleted) {
        lastCompleted.setHours(0, 0, 0, 0);
        
        // Check if missed yesterday
        if (lastCompleted.getTime() < yesterday.getTime()) {
          // Missed yesterday, mark it
          await this.storageManager.updateItem(habit.id, {
            habitStreak: {
              ...habit.habitStreak,
              missedYesterday: true
            }
          });
        }
      }
    }
  }
}

export default ItemManager;

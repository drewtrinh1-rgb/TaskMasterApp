/**
 * StorageManager - Handles persistence of items to localStorage
 */

import { Item, Category, ItemType } from '../models/index';

const STORAGE_KEY = 'categorized-todo-items';
const DEBOUNCE_MS = 300;

/**
 * Error thrown when storage operations fail
 */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Serialized format for Item (dates as ISO strings)
 */
interface SerializedItem {
  id: string;
  description: string;
  category: Category;
  type: ItemType;
  completed: boolean;
  dueDate?: string;
  location?: string;
  tags?: string[];
  createdAt: string;
  completedAt?: string;
}

/**
 * Converts an Item to serializable format
 */
function serializeItem(item: Item): SerializedItem {
  return {
    ...item,
    dueDate: item.dueDate?.toISOString(),
    createdAt: item.createdAt.toISOString(),
    completedAt: item.completedAt?.toISOString()
  };
}

/**
 * Converts a serialized item back to Item with proper Date objects
 */
function deserializeItem(data: SerializedItem): Item {
  return {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    createdAt: new Date(data.createdAt),
    completedAt: data.completedAt ? new Date(data.completedAt) : undefined
  };
}

/**
 * StorageManager class for managing item persistence
 */
export class StorageManager {
  private items: Map<string, Item> = new Map();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private storageAvailable: boolean = true;

  constructor() {
    this.checkStorageAvailability();
  }

  /**
   * Check if localStorage is available
   */
  private checkStorageAvailability(): void {
    try {
      const testKey = '__storage_test__';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        this.storageAvailable = true;
      } else {
        this.storageAvailable = false;
      }
    } catch {
      this.storageAvailable = false;
    }
  }

  /**
   * Check if storage is available
   */
  isStorageAvailable(): boolean {
    return this.storageAvailable;
  }

  /**
   * Load all items from storage
   */
  async loadFromStorage(): Promise<Item[]> {
    if (!this.storageAvailable) {
      return Array.from(this.items.values());
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }

      const serializedItems: SerializedItem[] = JSON.parse(data);
      this.items.clear();
      
      for (const serialized of serializedItems) {
        const item = deserializeItem(serialized);
        this.items.set(item.id, item);
      }

      return Array.from(this.items.values());
    } catch (error) {
      throw new StorageError('Failed to load items from storage', error);
    }
  }

  /**
   * Persist all items to storage (debounced)
   */
  private persistToStorage(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.persistImmediately();
    }, DEBOUNCE_MS);
  }

  /**
   * Persist all items to storage immediately
   */
  private persistImmediately(): void {
    if (!this.storageAvailable) {
      return;
    }

    try {
      const serializedItems = Array.from(this.items.values()).map(serializeItem);
      const data = JSON.stringify(serializedItems);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError('Storage quota exceeded. Consider clearing old completed tasks.', error);
      }
      throw new StorageError('Failed to persist items to storage', error);
    }
  }

  /**
   * Save a new item
   */
  async saveItem(item: Item): Promise<void> {
    this.items.set(item.id, item);
    this.persistToStorage();
  }

  /**
   * Get an item by ID
   */
  async getItem(id: string): Promise<Item | null> {
    return this.items.get(id) ?? null;
  }

  /**
   * Get all items
   */
  async getAllItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  /**
   * Update an existing item
   */
  async updateItem(id: string, updates: Partial<Item>): Promise<void> {
    const existing = this.items.get(id);
    if (!existing) {
      throw new StorageError(`Item with id ${id} not found`);
    }

    const updated: Item = { ...existing, ...updates, id: existing.id };
    this.items.set(id, updated);
    this.persistToStorage();
  }

  /**
   * Delete an item
   */
  async deleteItem(id: string): Promise<void> {
    this.items.delete(id);
    this.persistToStorage();
  }

  /**
   * Clear all items
   */
  async clearAll(): Promise<void> {
    this.items.clear();
    if (this.storageAvailable) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Force immediate persistence (useful for testing)
   */
  async flush(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.persistImmediately();
  }
}

export default StorageManager;

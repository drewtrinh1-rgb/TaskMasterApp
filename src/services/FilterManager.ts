/**
 * FilterManager - Handles filtering and sorting of items
 */

import { Item, Category } from '../models/index';

/**
 * Filter criteria for items
 */
export interface FilterCriteria {
  category?: Category;
  completed?: boolean;
  searchQuery?: string;
  overdue?: boolean;
}

/**
 * Sort options for items
 */
export type SortOption = 'dueDate' | 'createdAt' | 'description';
export type SortDirection = 'asc' | 'desc';

/**
 * FilterManager class for filtering and sorting items
 */
export class FilterManager {
  /**
   * Check if an item is overdue
   */
  isOverdue(item: Item): boolean {
    if (!item.dueDate || item.completed || item.type !== 'task') {
      return false;
    }
    
    const now = new Date();
    const dueDate = new Date(item.dueDate);
    
    // Set both dates to start of day for comparison
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < now;
  }

  /**
   * Filter items by category
   */
  filterByCategory(items: Item[], category: Category): Item[] {
    return items.filter(item => item.category === category);
  }

  /**
   * Filter items by completion status
   */
  filterByCompletion(items: Item[], completed: boolean): Item[] {
    return items.filter(item => item.completed === completed);
  }

  /**
   * Search items by description and tags
   */
  search(items: Item[], query: string): Item[] {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      return items;
    }

    return items.filter(item => {
      // Search in description
      if (item.description.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in tags
      if (item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }

      return false;
    });
  }

  /**
   * Filter overdue items
   */
  filterOverdue(items: Item[]): Item[] {
    return items.filter(item => this.isOverdue(item));
  }

  /**
   * Apply multiple filter criteria
   */
  applyFilters(items: Item[], criteria: FilterCriteria): Item[] {
    let filtered = [...items];

    if (criteria.category !== undefined) {
      filtered = this.filterByCategory(filtered, criteria.category);
    }

    if (criteria.completed !== undefined) {
      filtered = this.filterByCompletion(filtered, criteria.completed);
    }

    if (criteria.searchQuery) {
      filtered = this.search(filtered, criteria.searchQuery);
    }

    if (criteria.overdue) {
      filtered = this.filterOverdue(filtered);
    }

    return filtered;
  }

  /**
   * Sort items by due date
   */
  sortByDueDate(items: Item[], direction: SortDirection = 'asc'): Item[] {
    return [...items].sort((a, b) => {
      // Items without due dates go to the end
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Sort items by creation date
   */
  sortByCreatedAt(items: Item[], direction: SortDirection = 'desc'): Item[] {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Sort items by description alphabetically
   */
  sortByDescription(items: Item[], direction: SortDirection = 'asc'): Item[] {
    return [...items].sort((a, b) => {
      const comparison = a.description.localeCompare(b.description);
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Sort items by specified option
   */
  sort(items: Item[], option: SortOption, direction: SortDirection = 'asc'): Item[] {
    switch (option) {
      case 'dueDate':
        return this.sortByDueDate(items, direction);
      case 'createdAt':
        return this.sortByCreatedAt(items, direction);
      case 'description':
        return this.sortByDescription(items, direction);
      default:
        return items;
    }
  }
}

export default FilterManager;

/**
 * TaskListComponent - Displays items with filtering and drag-and-drop reordering
 * Separates Knowledge Hub items from regular tasks
 */

import { Item, Category, CATEGORY_CONFIGS } from '../models/index';
import { FilterManager, FilterCriteria, SortOption, SortDirection } from '../services/FilterManager';
import { ItemCard, ItemCardOptions } from './ItemCard';

export interface TaskListComponentOptions extends ItemCardOptions {
  getItems: () => Promise<Item[]>;
  onReorder?: (itemId: string, newIndex: number) => Promise<void>;
}

export class TaskListComponent {
  private tasksContainer: HTMLElement;
  private knowledgeContainer: HTMLElement;
  private tasksEmptyState: HTMLElement;
  private knowledgeEmptyState: HTMLElement;
  private searchInput: HTMLInputElement;
  private categoryFilter: HTMLSelectElement;
  private statusFilter: HTMLSelectElement;
  private sortOption: HTMLSelectElement;
  private filterManager: FilterManager;
  private itemCard: ItemCard;
  private options: TaskListComponentOptions;
  private items: Item[] = [];
  private draggedItem: HTMLElement | null = null;

  constructor(options: TaskListComponentOptions) {
    this.options = options;
    this.filterManager = new FilterManager();
    this.itemCard = new ItemCard({
      onComplete: options.onComplete,
      onEdit: options.onEdit,
      onDelete: options.onDelete
    });

    // Tasks column
    this.tasksContainer = document.getElementById('items-list') as HTMLElement;
    this.tasksEmptyState = document.getElementById('empty-state') as HTMLElement;
    
    // Knowledge Hub column
    this.knowledgeContainer = document.getElementById('knowledge-list') as HTMLElement;
    this.knowledgeEmptyState = document.getElementById('knowledge-empty-state') as HTMLElement;
    
    // Filters
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.categoryFilter = document.getElementById('filter-category') as HTMLSelectElement;
    this.statusFilter = document.getElementById('filter-status') as HTMLSelectElement;
    this.sortOption = document.getElementById('sort-option') as HTMLSelectElement;

    this.initialize();
  }

  private initialize(): void {
    this.populateCategoryFilter();
    this.searchInput.addEventListener('input', this.handleFilterChange.bind(this));
    this.categoryFilter.addEventListener('change', this.handleFilterChange.bind(this));
    this.statusFilter.addEventListener('change', this.handleFilterChange.bind(this));
    this.sortOption.addEventListener('change', this.handleFilterChange.bind(this));
  }

  private populateCategoryFilter(): void {
    for (const [category, config] of Object.entries(CATEGORY_CONFIGS)) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = config.name;
      this.categoryFilter.appendChild(option);
    }
  }

  private handleFilterChange(): void {
    this.render();
  }

  private getFilterCriteria(): FilterCriteria {
    const criteria: FilterCriteria = {};
    if (this.categoryFilter.value) criteria.category = this.categoryFilter.value as Category;
    if (this.statusFilter.value === 'completed') criteria.completed = true;
    else if (this.statusFilter.value === 'incomplete') criteria.completed = false;
    if (this.searchInput.value.trim()) criteria.searchQuery = this.searchInput.value.trim();
    return criteria;
  }

  private getSortSettings(): { option: SortOption; direction: SortDirection } {
    const option = this.sortOption.value as SortOption;
    const direction: SortDirection = option === 'createdAt' ? 'desc' : 'asc';
    return { option, direction };
  }

  private setupDragAndDrop(card: HTMLElement, container: HTMLElement): void {
    card.draggable = true;
    
    card.addEventListener('dragstart', (e) => {
      this.draggedItem = card;
      card.classList.add('dragging');
      e.dataTransfer?.setData('text/plain', card.dataset.id || '');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      this.draggedItem = null;
      // Remove all drag-over classes from both containers
      this.tasksContainer.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      this.knowledgeContainer.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (this.draggedItem && this.draggedItem !== card) {
        card.classList.add('drag-over');
      }
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      
      if (this.draggedItem && this.draggedItem !== card) {
        const allCards = Array.from(container.querySelectorAll('.item-card'));
        const draggedIndex = allCards.indexOf(this.draggedItem);
        const dropIndex = allCards.indexOf(card);
        
        if (draggedIndex < dropIndex) {
          card.parentNode?.insertBefore(this.draggedItem, card.nextSibling);
        } else {
          card.parentNode?.insertBefore(this.draggedItem, card);
        }
      }
    });
  }

  async refresh(): Promise<void> {
    this.items = await this.options.getItems();
    this.render();
  }

  setItems(items: Item[]): void {
    this.items = items;
    this.render();
  }

  render(): void {
    const criteria = this.getFilterCriteria();
    let filteredItems = this.filterManager.applyFilters(this.items, criteria);
    const { option, direction } = this.getSortSettings();
    filteredItems = this.filterManager.sort(filteredItems, option, direction);

    // Separate items into tasks and knowledge hub
    const taskItems = filteredItems.filter(item => item.category !== Category.KNOWLEDGE_HUB);
    const knowledgeItems = filteredItems.filter(item => item.category === Category.KNOWLEDGE_HUB);

    // Clear existing cards from both containers
    this.tasksContainer.querySelectorAll('.item-card').forEach(card => card.remove());
    this.knowledgeContainer.querySelectorAll('.item-card').forEach(card => card.remove());

    // Render tasks
    this.renderTasksColumn(taskItems);
    
    // Render knowledge hub items
    this.renderKnowledgeColumn(knowledgeItems);
  }

  private renderTasksColumn(items: Item[]): void {
    const hasFilters = this.searchInput.value.trim() || this.categoryFilter.value || this.statusFilter.value;
    const totalTasks = this.items.filter(item => item.category !== Category.KNOWLEDGE_HUB);

    if (items.length === 0) {
      this.tasksEmptyState.style.display = 'block';
      if (hasFilters && totalTasks.length > 0) {
        this.tasksEmptyState.innerHTML = `
          <div class="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" fill="#f0f0f0"/>
              <path d="M25 40 L35 50 L55 30" stroke="#ddd" stroke-width="4" fill="none"/>
            </svg>
          </div>
          <h3>No matches found</h3>
          <p>Try adjusting your filters</p>
        `;
      } else {
        this.tasksEmptyState.innerHTML = `
          <div class="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#f0f0f0"/>
              <rect x="35" y="40" width="50" height="8" rx="4" fill="#ddd"/>
              <rect x="35" y="55" width="40" height="8" rx="4" fill="#ddd"/>
              <rect x="35" y="70" width="45" height="8" rx="4" fill="#ddd"/>
              <circle cx="25" cy="44" r="4" fill="#9370DB"/>
              <circle cx="25" cy="59" r="4" fill="#32CD32"/>
              <circle cx="25" cy="74" r="4" fill="#4169E1"/>
            </svg>
          </div>
          <h3>No tasks yet!</h3>
          <p>Add your first task above to get started.</p>
          <p class="empty-hint">💡 Try typing "gym tomorrow" or "call mom"</p>
        `;
      }
    } else {
      this.tasksEmptyState.style.display = 'none';
      for (const item of items) {
        const card = this.itemCard.render(item);
        this.setupDragAndDrop(card, this.tasksContainer);
        this.tasksContainer.appendChild(card);
      }
    }
  }

  private renderKnowledgeColumn(items: Item[]): void {
    const hasFilters = this.searchInput.value.trim() || this.categoryFilter.value || this.statusFilter.value;
    const totalKnowledge = this.items.filter(item => item.category === Category.KNOWLEDGE_HUB);

    if (items.length === 0) {
      this.knowledgeEmptyState.style.display = 'block';
      if (hasFilters && totalKnowledge.length > 0) {
        this.knowledgeEmptyState.innerHTML = `
          <div class="empty-illustration">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="25" fill="#e0f2f1"/>
              <path d="M20 30 L27 37 L40 24" stroke="#20B2AA" stroke-width="3" fill="none"/>
            </svg>
          </div>
          <p>No matching notes</p>
        `;
      } else {
        this.knowledgeEmptyState.innerHTML = `
          <div class="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" fill="#e0f2f1"/>
              <circle cx="40" cy="35" r="12" fill="#20B2AA"/>
              <rect x="38" y="50" width="4" height="12" rx="2" fill="#20B2AA"/>
            </svg>
          </div>
          <p>Save notes, ideas & references here</p>
        `;
      }
    } else {
      this.knowledgeEmptyState.style.display = 'none';
      for (const item of items) {
        const card = this.itemCard.render(item);
        this.setupDragAndDrop(card, this.knowledgeContainer);
        this.knowledgeContainer.appendChild(card);
      }
    }
  }
}

export default TaskListComponent;

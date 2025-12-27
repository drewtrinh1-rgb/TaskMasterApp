/**
 * DailyFocusComponent - Shows top 3 priority tasks for today
 */

import { Item, CATEGORY_CONFIGS } from '../models/index';

interface DailyFocusComponentOptions {
  getItems: () => Promise<Item[]>;
  onComplete: (id: string) => void;
  onEdit: (item: Item) => void;
  onSetPriority: (id: string, priority: 'daily-focus' | null) => void;
}

export class DailyFocusComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;
  private onComplete: (id: string) => void;
  private onEdit: (item: Item) => void;
  private onSetPriority: (id: string, priority: 'daily-focus' | null) => void;

  constructor(options: DailyFocusComponentOptions) {
    this.container = document.getElementById('daily-focus-container') as HTMLElement;
    this.getItems = options.getItems;
    this.onComplete = options.onComplete;
    this.onEdit = options.onEdit;
    this.onSetPriority = options.onSetPriority;
  }

  async refresh(): Promise<void> {
    const items = await this.getItems();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's incomplete tasks
    const todayTasks = items.filter(item => {
      if (item.type === 'note' || item.completed) return false;
      
      // Include if it's a daily focus item
      if (item.priority === 'daily-focus') return true;
      
      // Include if due today
      if (item.dueDate) {
        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }
      
      // Include if created today
      const created = new Date(item.createdAt);
      created.setHours(0, 0, 0, 0);
      return created.getTime() === today.getTime();
    });

    const focusTasks = todayTasks.filter(t => t.priority === 'daily-focus').slice(0, 3);
    const availableTasks = todayTasks.filter(t => t.priority !== 'daily-focus');
    
    this.render(focusTasks, availableTasks);
  }

  private render(focusTasks: Item[], availableTasks: Item[]): void {
    const slotsNeeded = 3 - focusTasks.length;
    
    this.container.innerHTML = `
      <div class="daily-focus-header">
        <div class="focus-title">
          <h3>🎯 Today's Focus</h3>
          <p>Your 3 most important wins for today</p>
        </div>
        <div class="focus-progress">
          <span class="focus-count">${focusTasks.filter(t => t.completed).length}/3</span>
          <span class="focus-label">completed</span>
        </div>
      </div>
      
      <div class="daily-focus-slots">
        ${this.renderFocusSlots(focusTasks, slotsNeeded)}
      </div>
      
      ${slotsNeeded > 0 && availableTasks.length > 0 ? `
        <div class="focus-suggestions">
          <h4>📋 Add to Focus</h4>
          <div class="suggestion-list">
            ${availableTasks.slice(0, 5).map(task => this.renderSuggestion(task)).join('')}
          </div>
        </div>
      ` : ''}
      
      ${focusTasks.length === 0 ? `
        <div class="focus-empty-state">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" fill="#e3f2fd"/>
            <path d="M40 25v30M25 40h30" stroke="#4169E1" stroke-width="4" stroke-linecap="round"/>
          </svg>
          <p>Set your 3 most important tasks for today</p>
          <small>Focus on what matters most</small>
        </div>
      ` : ''}
    `;

    this.attachEventListeners();
  }

  private renderFocusSlots(focusTasks: Item[], slotsNeeded: number): string {
    let html = '';
    
    // Render filled slots
    focusTasks.forEach((task, index) => {
      html += this.renderFocusTask(task, index + 1);
    });
    
    // Render empty slots
    for (let i = 0; i < slotsNeeded; i++) {
      html += `
        <div class="focus-slot empty">
          <div class="slot-number">${focusTasks.length + i + 1}</div>
          <div class="slot-placeholder">
            <span>Add a priority task</span>
          </div>
        </div>
      `;
    }
    
    return html;
  }

  private renderFocusTask(task: Item, position: number): string {
    const config = CATEGORY_CONFIGS[task.category];
    const completedClass = task.completed ? 'completed' : '';
    
    return `
      <div class="focus-slot filled ${completedClass}" data-task-id="${task.id}">
        <div class="slot-number">${position}</div>
        <div class="focus-task-content">
          <div class="focus-task-header">
            <input 
              type="checkbox" 
              class="focus-checkbox" 
              ${task.completed ? 'checked' : ''}
              data-task-id="${task.id}"
            />
            <div class="focus-task-desc" data-task-id="${task.id}">${task.description}</div>
          </div>
          <div class="focus-task-meta">
            <span class="focus-category" style="background-color: ${config.color}20; color: ${config.color};">
              ${config.name}
            </span>
            ${task.effortLevel === 'quick' ? '<span class="effort-badge quick">⚡ 2-min</span>' : ''}
            ${task.isHabit ? '<span class="habit-badge">🔄 Habit</span>' : ''}
          </div>
        </div>
        <button class="remove-focus-btn" data-task-id="${task.id}" title="Remove from focus">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
  }

  private renderSuggestion(task: Item): string {
    const config = CATEGORY_CONFIGS[task.category];
    
    return `
      <div class="suggestion-item" data-task-id="${task.id}">
        <div class="suggestion-content">
          <div class="suggestion-desc">${task.description}</div>
          <span class="suggestion-category" style="background-color: ${config.color}20; color: ${config.color};">
            ${config.name}
          </span>
        </div>
        <button class="add-to-focus-btn" data-task-id="${task.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Checkbox handlers
    const checkboxes = this.container.querySelectorAll('.focus-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const taskId = target.getAttribute('data-task-id');
        if (taskId) this.onComplete(taskId);
      });
    });

    // Task click to edit
    const taskDescs = this.container.querySelectorAll('.focus-task-desc');
    taskDescs.forEach(desc => {
      desc.addEventListener('click', async (e) => {
        const taskId = (e.target as HTMLElement).getAttribute('data-task-id');
        if (taskId) {
          const items = await this.getItems();
          const task = items.find(t => t.id === taskId);
          if (task) this.onEdit(task);
        }
      });
    });

    // Remove from focus
    const removeBtns = this.container.querySelectorAll('.remove-focus-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = (e.target as HTMLElement).closest('button')?.getAttribute('data-task-id');
        if (taskId) this.onSetPriority(taskId, null);
      });
    });

    // Add to focus
    const addBtns = this.container.querySelectorAll('.add-to-focus-btn');
    addBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = (e.target as HTMLElement).closest('button')?.getAttribute('data-task-id');
        if (taskId) this.onSetPriority(taskId, 'daily-focus');
      });
    });
  }
}

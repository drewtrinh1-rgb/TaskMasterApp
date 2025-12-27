/**
 * QuickWinsComponent - 2-minute rule tasks for easy momentum
 */

import { Item, CATEGORY_CONFIGS } from '../models/index';

interface QuickWinsComponentOptions {
  getItems: () => Promise<Item[]>;
  onComplete: (id: string) => void;
}

export class QuickWinsComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;
  private onComplete: (id: string) => void;

  constructor(options: QuickWinsComponentOptions) {
    this.container = document.getElementById('quick-wins-container') as HTMLElement;
    this.getItems = options.getItems;
    this.onComplete = options.onComplete;
  }

  async refresh(): Promise<void> {
    const items = await this.getItems();
    const quickTasks = items.filter(item => 
      item.effortLevel === 'quick' && 
      !item.completed && 
      item.type !== 'note'
    );

    this.render(quickTasks);
  }

  private render(quickTasks: Item[]): void {
    this.container.innerHTML = `
      <div class="quick-wins-header">
        <div class="quick-title">
          <h4>⚡ Quick Wins</h4>
          <p>2-minute tasks for instant momentum</p>
        </div>
        <div class="quick-count">${quickTasks.length} task${quickTasks.length !== 1 ? 's' : ''}</div>
      </div>

      <div class="quick-wins-list">
        ${quickTasks.length > 0 ? quickTasks.slice(0, 5).map(task => this.renderQuickTask(task)).join('') : this.renderEmptyState()}
      </div>
    `;

    this.attachEventListeners();
  }

  private renderQuickTask(task: Item): string {
    const config = CATEGORY_CONFIGS[task.category];

    return `
      <div class="quick-task" data-task-id="${task.id}">
        <button class="quick-check-btn" data-task-id="${task.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </button>
        <div class="quick-task-content">
          <div class="quick-task-desc">${task.description}</div>
          <span class="quick-task-category" style="background-color: ${config.color}20; color: ${config.color};">
            ${config.name}
          </span>
        </div>
        <div class="quick-task-time">~2min</div>
      </div>
    `;
  }

  private renderEmptyState(): string {
    return `
      <div class="quick-empty-state">
        <p>No quick tasks</p>
        <small>Tag tasks as "2-min" for easy wins</small>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const checkBtns = this.container.querySelectorAll('.quick-check-btn');
    checkBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = (e.currentTarget as HTMLElement).getAttribute('data-task-id');
        if (taskId) this.onComplete(taskId);
      });
    });
  }
}

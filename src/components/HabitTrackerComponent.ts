/**
 * HabitTrackerComponent - Track habits and streaks
 */

import { Item, CATEGORY_CONFIGS } from '../models/index';

interface HabitTrackerComponentOptions {
  getItems: () => Promise<Item[]>;
  onComplete: (id: string) => void;
  onEdit: (item: Item) => void;
}

export class HabitTrackerComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;
  private onComplete: (id: string) => void;
  private onEdit: (item: Item) => void;

  constructor(options: HabitTrackerComponentOptions) {
    this.container = document.getElementById('habit-tracker-container') as HTMLElement;
    this.getItems = options.getItems;
    this.onComplete = options.onComplete;
    this.onEdit = options.onEdit;
  }

  async refresh(): Promise<void> {
    const items = await this.getItems();
    const habits = items.filter(item => item.isHabit && !item.completed);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if habit was completed today
    const habitsWithStatus = habits.map(habit => ({
      ...habit,
      completedToday: this.wasCompletedToday(habit, today)
    }));

    this.render(habitsWithStatus);
  }

  private wasCompletedToday(habit: Item, today: Date): boolean {
    if (!habit.habitStreak?.lastCompletedDate) return false;
    const lastCompleted = new Date(habit.habitStreak.lastCompletedDate);
    lastCompleted.setHours(0, 0, 0, 0);
    return lastCompleted.getTime() === today.getTime();
  }

  private render(habits: (Item & { completedToday: boolean })[]): void {
    const totalStreak = habits.reduce((sum, h) => sum + (h.habitStreak?.currentStreak || 0), 0);
    const completedToday = habits.filter(h => h.completedToday).length;

    this.container.innerHTML = `
      <div class="habit-tracker-header">
        <div class="habit-title">
          <h3>🔥 Habit Tracker</h3>
          <p>Build consistency, one day at a time</p>
        </div>
        <div class="habit-stats">
          <div class="habit-stat">
            <span class="stat-value">${completedToday}/${habits.length}</span>
            <span class="stat-label">Today</span>
          </div>
          <div class="habit-stat">
            <span class="stat-value">${totalStreak}</span>
            <span class="stat-label">Total Streak</span>
          </div>
        </div>
      </div>

      <div class="habits-list">
        ${habits.length > 0 ? habits.map(habit => this.renderHabit(habit)).join('') : this.renderEmptyState()}
      </div>
    `;

    this.attachEventListeners();
  }

  private renderHabit(habit: Item & { completedToday: boolean }): string {
    const config = CATEGORY_CONFIGS[habit.category];
    const streak = habit.habitStreak?.currentStreak || 0;
    const longestStreak = habit.habitStreak?.longestStreak || 0;
    const total = habit.habitStreak?.totalCompletions || 0;

    return `
      <div class="habit-card ${habit.completedToday ? 'completed-today' : ''}" data-habit-id="${habit.id}">
        <div class="habit-check-container">
          <button class="habit-check-btn ${habit.completedToday ? 'checked' : ''}" data-habit-id="${habit.id}">
            ${habit.completedToday ? 
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' :
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'
            }
          </button>
        </div>
        
        <div class="habit-content" data-habit-id="${habit.id}">
          <div class="habit-name">${habit.description}</div>
          <div class="habit-meta">
            <span class="habit-category" style="background-color: ${config.color}20; color: ${config.color};">
              ${config.name}
            </span>
            ${habit.effortLevel === 'quick' ? '<span class="effort-badge quick">⚡ 2-min</span>' : ''}
          </div>
        </div>

        <div class="habit-streak-info">
          <div class="streak-display ${streak > 0 ? 'active' : ''}">
            <span class="streak-icon">🔥</span>
            <span class="streak-number">${streak}</span>
            <span class="streak-label">day${streak !== 1 ? 's' : ''}</span>
          </div>
          ${longestStreak > streak ? `<div class="streak-best">Best: ${longestStreak}</div>` : ''}
          <div class="streak-total">${total} total</div>
        </div>
      </div>
    `;
  }

  private renderEmptyState(): string {
    return `
      <div class="habit-empty-state">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="30" fill="#fff5f5"/>
          <path d="M30 40 L35 45 L50 30" stroke="#DC143C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>No habits yet</p>
        <small>Create a task and mark it as a habit to start tracking</small>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Habit check buttons
    const checkBtns = this.container.querySelectorAll('.habit-check-btn');
    checkBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = (e.currentTarget as HTMLElement).getAttribute('data-habit-id');
        if (habitId) this.onComplete(habitId);
      });
    });

    // Habit card click to edit
    const habitContents = this.container.querySelectorAll('.habit-content');
    habitContents.forEach(content => {
      content.addEventListener('click', async (e) => {
        const habitId = (e.currentTarget as HTMLElement).getAttribute('data-habit-id');
        if (habitId) {
          const items = await this.getItems();
          const habit = items.find(h => h.id === habitId);
          if (habit) this.onEdit(habit);
        }
      });
    });
  }
}

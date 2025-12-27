/**
 * HabitHeatmapComponent - GitHub-style habit completion heatmap
 */

import { Item } from '../models/index';

interface HabitHeatmapComponentOptions {
  getItems: () => Promise<Item[]>;
  containerId?: string;
}

export class HabitHeatmapComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;

  constructor(options: HabitHeatmapComponentOptions) {
    const containerId = options.containerId || 'habit-heatmap-container';
    this.container = document.getElementById(containerId) as HTMLElement;
    this.getItems = options.getItems;
  }

  async refresh(): Promise<void> {
    const items = await this.getItems();
    const habits = items.filter(i => i.isHabit);
    
    if (habits.length === 0) {
      this.renderEmpty();
      return;
    }

    this.render(habits);
  }

  private render(habits: Item[]): void {
    const selectedHabit = habits[0]; // Default to first habit
    const heatmapData = this.generateHeatmapData(selectedHabit);

    this.container.innerHTML = `
      <div class="heatmap-card">
        <div class="heatmap-header">
          <div class="heatmap-title">
            <span class="heatmap-icon">📊</span>
            <h3>Habit Heatmap</h3>
          </div>
          <select id="habit-selector" class="habit-selector">
            ${habits.map(h => `<option value="${h.id}">${h.description}</option>`).join('')}
          </select>
        </div>

        <div class="heatmap-content">
          <div class="heatmap-stats">
            <div class="heatmap-stat">
              <span class="stat-value">${selectedHabit.habitStreak?.currentStreak || 0}</span>
              <span class="stat-label">Current Streak</span>
            </div>
            <div class="heatmap-stat">
              <span class="stat-value">${selectedHabit.habitStreak?.longestStreak || 0}</span>
              <span class="stat-label">Longest Streak</span>
            </div>
            <div class="heatmap-stat">
              <span class="stat-value">${selectedHabit.habitStreak?.totalCompletions || 0}</span>
              <span class="stat-label">Total Days</span>
            </div>
          </div>

          <div class="heatmap-grid-container">
            <div class="heatmap-months">
              ${this.renderMonthLabels(heatmapData)}
            </div>
            <div class="heatmap-grid-wrapper">
              <div class="heatmap-weekdays">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div class="heatmap-grid">
                ${this.renderHeatmapCells(heatmapData)}
              </div>
            </div>
          </div>

          <div class="heatmap-legend">
            <span class="legend-label">Less</span>
            <div class="legend-cell level-0"></div>
            <div class="legend-cell level-1"></div>
            <div class="legend-cell level-2"></div>
            <div class="legend-cell level-3"></div>
            <div class="legend-cell level-4"></div>
            <span class="legend-label">More</span>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(habits);
  }

  private generateHeatmapData(habit: Item): Map<string, boolean> {
    const data = new Map<string, boolean>();
    const completionDates = habit.habitStreak?.completionDates || [];
    
    // Convert completion dates to map
    completionDates.forEach(date => {
      const d = new Date(date);
      const key = this.getDateKey(d);
      data.set(key, true);
    });

    return data;
  }

  private renderMonthLabels(_data: Map<string, boolean>): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // Show last year

    const monthLabels: string[] = [];
    let currentMonth = startDate.getMonth();
    
    for (let i = 0; i < 12; i++) {
      monthLabels.push(months[currentMonth]);
      currentMonth = (currentMonth + 1) % 12;
    }

    return monthLabels.map(m => `<span class="month-label">${m}</span>`).join('');
  }

  private renderHeatmapCells(data: Map<string, boolean>): string {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // Show last year (52 weeks)

    let html = '';
    let currentDate = new Date(startDate);

    // Adjust to start on Monday
    const dayOfWeek = currentDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    currentDate.setDate(currentDate.getDate() - daysToMonday);

    for (let week = 0; week < 53; week++) {
      html += '<div class="heatmap-week">';
      
      for (let day = 0; day < 7; day++) {
        const dateKey = this.getDateKey(currentDate);
        const isCompleted = data.has(dateKey);
        const isFuture = currentDate > today;
        
        const level = isCompleted ? 4 : 0;
        const classes = ['heatmap-cell', `level-${level}`];
        if (isFuture) classes.push('future');
        
        html += `
          <div class="${classes.join(' ')}" 
               data-date="${dateKey}"
               title="${this.formatDate(currentDate)}: ${isCompleted ? 'Completed' : 'Not completed'}">
          </div>
        `;
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      html += '</div>';
    }

    return html;
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private renderEmpty(): void {
    this.container.innerHTML = `
      <div class="heatmap-empty">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="20" width="8" height="8" rx="2" fill="#e0e0e0"/>
          <rect x="20" y="20" width="8" height="8" rx="2" fill="#e0e0e0"/>
          <rect x="30" y="20" width="8" height="8" rx="2" fill="#32CD32"/>
          <rect x="40" y="20" width="8" height="8" rx="2" fill="#32CD32"/>
          <rect x="50" y="20" width="8" height="8" rx="2" fill="#e0e0e0"/>
        </svg>
        <p>Create habits to see your heatmap</p>
      </div>
    `;
  }

  private attachEventListeners(habits: Item[]): void {
    const selector = document.getElementById('habit-selector') as HTMLSelectElement;
    if (selector) {
      selector.addEventListener('change', async () => {
        const selectedId = selector.value;
        const habit = habits.find(h => h.id === selectedId);
        if (habit) {
          this.render([habit, ...habits.filter(h => h.id !== selectedId)]);
        }
      });
    }
  }
}

/**
 * CalendarComponent - Monthly calendar view with task display and day expansion
 */

import { Item, CATEGORY_CONFIGS } from '../models/index';

interface CalendarComponentOptions {
  getItems: () => Promise<Item[]>;
  onTaskClick?: (item: Item) => void;
}

interface Holiday {
  date: string; // MM-DD format
  name: string;
}

// NSW, Australia Public Holidays
const NSW_HOLIDAYS: Record<number, Holiday[]> = {
  2024: [
    { date: '01-01', name: "New Year's Day" },
    { date: '01-26', name: 'Australia Day' },
    { date: '03-29', name: 'Good Friday' },
    { date: '03-30', name: 'Easter Saturday' },
    { date: '04-01', name: 'Easter Monday' },
    { date: '04-25', name: 'Anzac Day' },
    { date: '06-10', name: "King's Birthday" },
    { date: '08-05', name: 'Bank Holiday' }, // First Monday in August (NSW only)
    { date: '12-25', name: 'Christmas Day' },
    { date: '12-26', name: 'Boxing Day' },
  ],
  2025: [
    { date: '01-01', name: "New Year's Day" },
    { date: '01-27', name: 'Australia Day (observed)' }, // Falls on Sunday, observed Monday
    { date: '04-18', name: 'Good Friday' },
    { date: '04-19', name: 'Easter Saturday' },
    { date: '04-21', name: 'Easter Monday' },
    { date: '04-25', name: 'Anzac Day' },
    { date: '06-09', name: "King's Birthday" },
    { date: '08-04', name: 'Bank Holiday' }, // First Monday in August (NSW only)
    { date: '12-25', name: 'Christmas Day' },
    { date: '12-26', name: 'Boxing Day' },
  ],
  2026: [
    { date: '01-01', name: "New Year's Day" },
    { date: '01-26', name: 'Australia Day' },
    { date: '04-03', name: 'Good Friday' },
    { date: '04-04', name: 'Easter Saturday' },
    { date: '04-06', name: 'Easter Monday' },
    { date: '04-27', name: 'Anzac Day (observed)' }, // Falls on Saturday, observed Monday
    { date: '06-08', name: "King's Birthday" },
    { date: '08-03', name: 'Bank Holiday' }, // First Monday in August (NSW only)
    { date: '12-25', name: 'Christmas Day' },
    { date: '12-28', name: 'Boxing Day (observed)' }, // Falls on Saturday, observed Monday
  ],
};

export class CalendarComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;
  private onTaskClick?: (item: Item) => void;
  private currentDate: Date;
  private minDate: Date;
  private maxDate: Date;
  private expandedDate: Date | null = null;

  constructor(options: CalendarComponentOptions) {
    this.container = document.getElementById('calendar-container') as HTMLElement;
    this.getItems = options.getItems;
    this.onTaskClick = options.onTaskClick;
    
    this.currentDate = new Date();
    this.currentDate.setDate(1);
    this.currentDate.setHours(0, 0, 0, 0);
    
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 12);
    this.minDate.setDate(1);
    
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 12);
    this.maxDate.setDate(1);
  }

  async refresh(): Promise<void> {
    await this.render();
  }

  private getHolidayForDate(date: Date): Holiday | null {
    const year = date.getFullYear();
    const holidays = NSW_HOLIDAYS[year];
    if (!holidays) return null;
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}`;
    
    return holidays.find(h => h.date === dateStr) || null;
  }

  private async render(): Promise<void> {
    const items = await this.getItems();
    const tasksWithDates = items.filter(item => item.dueDate || item.createdAt);
    
    this.container.innerHTML = `
      <div class="calendar-header">
        <button class="calendar-nav-btn" id="prev-month" ${this.canGoPrev() ? '' : 'disabled'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Previous
        </button>
        <h3 class="calendar-month-title">${this.formatMonthYear(this.currentDate)}</h3>
        <button class="calendar-nav-btn" id="next-month" ${this.canGoNext() ? '' : 'disabled'}>
          Next
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <div class="calendar-weekdays">
        <div class="weekday">Mon</div>
        <div class="weekday">Tue</div>
        <div class="weekday">Wed</div>
        <div class="weekday">Thu</div>
        <div class="weekday">Fri</div>
        <div class="weekday weekend">Sat</div>
        <div class="weekday weekend">Sun</div>
      </div>
      <div class="calendar-grid">
        ${this.renderCalendarDays(tasksWithDates)}
      </div>
      ${this.renderExpandedDay(tasksWithDates)}
      <div class="calendar-legend">
        <div class="legend-section">
          <div class="legend-item">
            <span class="legend-color" style="background-color: #DC143C"></span>
            <span class="legend-label">🇦🇺 Public Holiday</span>
          </div>
          <div class="legend-item">
            <span class="legend-color weekend-indicator"></span>
            <span class="legend-label">Weekend</span>
          </div>
        </div>
        <div class="legend-section">
          ${this.renderCategoryLegend()}
        </div>
      </div>
    `;

    this.attachEventListeners(tasksWithDates);
  }

  private renderCalendarDays(items: Item[]): string {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let html = '';
    
    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, day);
      const dayOfWeek = prevDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      html += `<div class="calendar-day other-month ${isWeekend ? 'weekend' : ''}"><span class="day-number">${day}</span></div>`;
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = date.getTime() === today.getTime();
      const dayItems = this.getItemsForDate(items, date);
      const holiday = this.getHolidayForDate(date);
      const isExpanded = this.expandedDate && this.expandedDate.getTime() === date.getTime();
      
      const classes = ['calendar-day'];
      if (isWeekend) classes.push('weekend');
      if (isToday) classes.push('today');
      if (dayItems.length > 0 || holiday) classes.push('has-tasks');
      if (holiday) classes.push('holiday');
      if (isExpanded) classes.push('expanded');
      
      const hasMore = dayItems.length > 3 || (dayItems.length > 2 && holiday);
      
      html += `
        <div class="${classes.join(' ')}" data-date="${date.toISOString()}" data-clickable="${hasMore || dayItems.length > 0 || holiday}">
          <span class="day-number">${day}</span>
          ${holiday ? `<div class="calendar-holiday" title="${holiday.name}">🇦🇺 ${this.truncate(holiday.name, 15)}</div>` : ''}
          <div class="day-tasks">
            ${this.renderDayTasks(dayItems, holiday ? 2 : 3)}
          </div>
          ${hasMore ? `<div class="calendar-task-more">View all (${dayItems.length})</div>` : ''}
        </div>
      `;
    }
    
    // Next month's leading days
    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dayOfWeek = nextDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      html += `<div class="calendar-day other-month ${isWeekend ? 'weekend' : ''}"><span class="day-number">${i}</span></div>`;
    }
    
    return html;
  }

  private renderExpandedDay(items: Item[]): string {
    if (!this.expandedDate) return '';
    
    const dayItems = this.getItemsForDate(items, this.expandedDate);
    const holiday = this.getHolidayForDate(this.expandedDate);
    
    const dateStr = this.expandedDate.toLocaleDateString('en-AU', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    const dayOfWeek = this.expandedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return `
      <div class="expanded-day-panel ${isWeekend ? 'weekend-panel' : ''}">
        <div class="expanded-day-header">
          <div class="expanded-day-title">
            <h4>${dateStr}</h4>
            ${isWeekend ? '<span class="weekend-badge">Weekend</span>' : ''}
          </div>
          <button class="close-expanded-btn" id="close-expanded" title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        ${holiday ? `
          <div class="expanded-holiday">
            <div class="holiday-icon">🇦🇺</div>
            <div class="holiday-content">
              <strong>${holiday.name}</strong>
              <span>Australian Public Holiday</span>
            </div>
          </div>
        ` : ''}
        <div class="expanded-day-content">
          <div class="expanded-day-stats">
            <div class="stat-badge">
              <span class="stat-number">${dayItems.length}</span>
              <span class="stat-label">${dayItems.length === 1 ? 'Task' : 'Tasks'}</span>
            </div>
            <div class="stat-badge">
              <span class="stat-number">${dayItems.filter(i => i.completed).length}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat-badge">
              <span class="stat-number">${dayItems.filter(i => !i.completed).length}</span>
              <span class="stat-label">Remaining</span>
            </div>
          </div>
          <div class="expanded-day-tasks">
            ${dayItems.length > 0 ? dayItems.map(item => this.renderExpandedTask(item)).join('') : '<div class="no-tasks"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="25" fill="#f0f0f0"/><path d="M20 30h20M30 20v20" stroke="#ddd" stroke-width="3" stroke-linecap="round"/></svg><p>No tasks for this day</p></div>'}
          </div>
        </div>
      </div>
    `;
  }

  private renderExpandedTask(item: Item): string {
    const config = CATEGORY_CONFIGS[item.category];
    const completedClass = item.completed ? 'completed' : '';
    
    return `
      <div class="expanded-task ${completedClass}" data-item-id="${item.id}">
        <div class="expanded-task-indicator" style="background-color: ${config.color};"></div>
        <div class="expanded-task-checkbox">
          ${item.completed ? 
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : 
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'
          }
        </div>
        <div class="expanded-task-content">
          <div class="expanded-task-desc">${item.description}</div>
          <div class="expanded-task-meta">
            <span class="expanded-task-category" style="background-color: ${config.color}20; color: ${config.color};">
              ${config.name}
            </span>
            ${item.dueDate ? `<span class="expanded-task-due">📅 ${new Date(item.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>` : ''}
            ${item.location ? `<span class="expanded-task-location">📍 ${item.location}</span>` : ''}
          </div>
        </div>
        <div class="expanded-task-actions">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    `;
  }

  private getItemsForDate(items: Item[], date: Date): Item[] {
    return items.filter(item => {
      const itemDate = item.dueDate ? new Date(item.dueDate) : new Date(item.createdAt);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === date.getTime();
    });
  }

  private renderDayTasks(items: Item[], maxVisible: number): string {
    if (items.length === 0) return '';
    
    const visible = items.slice(0, maxVisible);
    
    return visible.map(item => {
      const config = CATEGORY_CONFIGS[item.category];
      const completedClass = item.completed ? 'completed' : '';
      return `
        <div class="calendar-task ${completedClass}" 
             style="background-color: ${config.color}20; border-left: 3px solid ${config.color};"
             data-item-id="${item.id}"
             title="${item.description}">
          ${this.truncate(item.description, 18)}
        </div>
      `;
    }).join('');
  }

  private renderCategoryLegend(): string {
    return Object.entries(CATEGORY_CONFIGS).map(([_key, config]) => `
      <div class="legend-item">
        <span class="legend-color" style="background-color: ${config.color}"></span>
        <span class="legend-label">${config.name}</span>
      </div>
    `).join('');
  }

  private truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  private formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  private canGoPrev(): boolean {
    const prevMonth = new Date(this.currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth >= this.minDate;
  }

  private canGoNext(): boolean {
    const nextMonth = new Date(this.currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth <= this.maxDate;
  }

  private attachEventListeners(items: Item[]): void {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const closeBtn = document.getElementById('close-expanded');
    
    prevBtn?.addEventListener('click', () => {
      if (this.canGoPrev()) {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.expandedDate = null;
        this.refresh();
      }
    });
    
    nextBtn?.addEventListener('click', () => {
      if (this.canGoNext()) {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.expandedDate = null;
        this.refresh();
      }
    });

    closeBtn?.addEventListener('click', () => {
      this.expandedDate = null;
      this.refresh();
    });

    // Day click to expand
    const dayElements = this.container.querySelectorAll('.calendar-day[data-clickable="true"]');
    dayElements.forEach(el => {
      el.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        // Don't expand if clicking on a task
        if (target.closest('.calendar-task')) return;
        
        const dateStr = el.getAttribute('data-date');
        if (dateStr) {
          this.expandedDate = new Date(dateStr);
          this.refresh();
        }
      });
    });

    // Task click handlers
    const taskElements = this.container.querySelectorAll('.calendar-task[data-item-id], .expanded-task[data-item-id]');
    taskElements.forEach(el => {
      el.addEventListener('click', async (e) => {
        e.stopPropagation();
        const itemId = el.getAttribute('data-item-id');
        if (itemId && this.onTaskClick) {
          const item = items.find(i => i.id === itemId);
          if (item) this.onTaskClick(item);
        }
      });
    });
  }
}

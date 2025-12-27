/**
 * WeeklyReviewComponent - Weekly progress review and insights
 */

import { Item, CATEGORY_CONFIGS } from '../models/index';

interface WeeklyReviewComponentOptions {
  getItems: () => Promise<Item[]>;
  containerId?: string;
}

export class WeeklyReviewComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;

  constructor(options: WeeklyReviewComponentOptions) {
    const containerId = options.containerId || 'weekly-review-container';
    this.container = document.getElementById(containerId) as HTMLElement;
    this.getItems = options.getItems;
  }

  async refresh(): Promise<void> {
    const items = await this.getItems();
    const weekData = this.calculateWeekData(items);
    this.render(weekData);
  }

  private calculateWeekData(items: Item[]) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekItems = items.filter(item => {
      const created = new Date(item.createdAt);
      return created >= weekAgo;
    });

    const completed = weekItems.filter(i => i.completed);
    const habits = items.filter(i => i.isHabit);
    
    // Calculate habit completion rate for the week
    const habitCompletions = habits.map(habit => {
      const completedThisWeek = habit.habitStreak?.completionDates?.filter(date => {
        const d = new Date(date);
        return d >= weekAgo;
      }).length || 0;
      return {
        habit,
        completedDays: completedThisWeek,
        rate: (completedThisWeek / 7) * 100
      };
    });

    // Category breakdown
    const categoryStats = Object.keys(CATEGORY_CONFIGS).map(cat => {
      const categoryItems = completed.filter(i => i.category === cat);
      return {
        category: cat,
        count: categoryItems.length,
        config: CATEGORY_CONFIGS[cat as keyof typeof CATEGORY_CONFIGS]
      };
    }).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

    // Points earned
    const totalPoints = completed.reduce((sum, item) => sum + (item.points || 0), 0);

    // Streaks
    const activeStreaks = habits.filter(h => (h.habitStreak?.currentStreak || 0) > 0);
    const longestStreak = Math.max(...habits.map(h => h.habitStreak?.currentStreak || 0), 0);

    // Never miss twice check
    const missedYesterday = habits.filter(h => h.habitStreak?.missedYesterday);

    return {
      totalCreated: weekItems.length,
      totalCompleted: completed.length,
      completionRate: weekItems.length > 0 ? Math.round((completed.length / weekItems.length) * 100) : 0,
      totalPoints,
      habitCompletions,
      categoryStats,
      activeStreaks: activeStreaks.length,
      longestStreak,
      missedYesterday
    };
  }

  private render(data: any): void {
    this.container.innerHTML = `
      <div class="weekly-review-card">
        <div class="weekly-review-header">
          <div class="review-header-content">
            <div class="review-icon">📊</div>
            <div class="review-title-group">
              <h3>Weekly Review</h3>
              <p>Your progress over the last 7 days</p>
            </div>
          </div>
          <div class="review-date-badge">
            ${this.getWeekRange()}
          </div>
        </div>

        <div class="review-stats-grid">
          <div class="review-stat-card primary">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">✅</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${data.totalCompleted}</div>
                <div class="stat-label">Tasks Completed</div>
              </div>
            </div>
          </div>
          
          <div class="review-stat-card success">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">🎯</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${data.completionRate}%</div>
                <div class="stat-label">Completion Rate</div>
                <div class="stat-progress">
                  <div class="stat-progress-bar" style="width: ${data.completionRate}%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="review-stat-card warning">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">⭐</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${data.totalPoints}</div>
                <div class="stat-label">Points Earned</div>
              </div>
            </div>
          </div>
          
          <div class="review-stat-card danger">
            <div class="stat-card-inner">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">🔥</div>
              </div>
              <div class="stat-content">
                <div class="stat-value">${data.longestStreak}</div>
                <div class="stat-label">Longest Streak</div>
              </div>
            </div>
          </div>
        </div>

        <div class="review-content-grid">
          ${data.habitCompletions.length > 0 ? `
            <div class="review-section habits-section">
              <div class="section-header">
                <h4><span class="section-icon">🔄</span> Habit Performance</h4>
              </div>
              <div class="habit-performance-list">
                ${data.habitCompletions.map((hc: any) => this.renderHabitPerformance(hc)).join('')}
              </div>
            </div>
          ` : ''}

          ${data.categoryStats.length > 0 ? `
            <div class="review-section category-section">
              <div class="section-header">
                <h4><span class="section-icon">📈</span> Category Breakdown</h4>
              </div>
              <div class="category-breakdown">
                ${data.categoryStats.map((cs: any) => this.renderCategoryBar(cs)).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        ${data.missedYesterday.length > 0 ? `
          <div class="review-alert warning-alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <h4>Never Miss Twice</h4>
              <p>These habits were missed yesterday. Get back on track today!</p>
              <div class="missed-habits-list">
                ${data.missedYesterday.map((h: Item) => `
                  <div class="missed-habit-item">
                    <span class="missed-icon">🔴</span>
                    <span class="missed-text">${h.description}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <div class="review-insights-card">
          <div class="insights-header">
            <span class="insights-icon">💡</span>
            <h4>Insights & Recommendations</h4>
          </div>
          <div class="insights-list">
            ${this.generateInsights(data).map(insight => `
              <div class="insight-item">
                <span class="insight-bullet">•</span>
                <span class="insight-text">${insight}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private getWeekRange(): string {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${weekAgo.toLocaleDateString('en-US', options)} - ${now.toLocaleDateString('en-US', options)}`;
  }

  private renderHabitPerformance(hc: any): string {
    const percentage = Math.round(hc.rate);
    const config = CATEGORY_CONFIGS[hc.habit.category as keyof typeof CATEGORY_CONFIGS];
    
    return `
      <div class="habit-performance-item">
        <div class="habit-perf-header">
          <div class="habit-perf-name">${hc.habit.description}</div>
          <div class="habit-perf-badge">${hc.completedDays}/7 days</div>
        </div>
        <div class="habit-perf-bar-container">
          <div class="habit-perf-bar">
            <div class="habit-perf-fill" style="width: ${percentage}%; background: linear-gradient(90deg, ${config.color}, ${this.lightenColor(config.color)});"></div>
          </div>
          <div class="habit-perf-percent">${percentage}%</div>
        </div>
      </div>
    `;
  }

  private renderCategoryBar(cs: any): string {
    const maxCount = 20; // Normalize to max for visual consistency
    const width = Math.min((cs.count / maxCount) * 100, 100);
    
    return `
      <div class="category-bar-item">
        <div class="category-bar-header">
          <div class="category-bar-label">
            <span class="category-dot" style="background-color: ${cs.config.color};"></span>
            <span class="category-name">${cs.config.name}</span>
          </div>
          <div class="category-bar-count">${cs.count}</div>
        </div>
        <div class="category-bar-visual">
          <div class="category-bar-fill" style="width: ${width}%; background: linear-gradient(90deg, ${cs.config.color}, ${this.lightenColor(cs.config.color)});"></div>
        </div>
      </div>
    `;
  }

  private lightenColor(color: string): string {
    // Simple color lightening
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.min(255, r + 40);
    const newG = Math.min(255, g + 40);
    const newB = Math.min(255, b + 40);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  private generateInsights(data: any): string[] {
    const insights: string[] = [];

    if (data.completionRate >= 80) {
      insights.push('🌟 Excellent completion rate! You\'re crushing it!');
    } else if (data.completionRate >= 60) {
      insights.push('👍 Good progress! Keep up the momentum.');
    } else if (data.completionRate < 40) {
      insights.push('💪 Focus on completing fewer, more important tasks.');
    }

    if (data.activeStreaks > 0) {
      insights.push(`🔥 You have ${data.activeStreaks} active habit streak${data.activeStreaks > 1 ? 's' : ''}!`);
    }

    if (data.longestStreak >= 7) {
      insights.push(`🏆 Your longest streak is ${data.longestStreak} days. That's commitment!`);
    }

    const topCategory = data.categoryStats[0];
    if (topCategory) {
      insights.push(`📊 Most productive in: ${topCategory.config.name} (${topCategory.count} tasks)`);
    }

    if (data.totalPoints > 100) {
      insights.push(`⭐ You earned ${data.totalPoints} points this week!`);
    }

    if (insights.length === 0) {
      insights.push('Start building habits and completing tasks to see insights!');
    }

    return insights;
  }
}

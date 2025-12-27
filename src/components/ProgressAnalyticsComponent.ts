/**
 * ProgressAnalyticsComponent - Advanced progress tracking and trends
 */

import { Item } from '../models/index';

interface ProgressAnalyticsComponentOptions {
  getItems: () => Promise<Item[]>;
  containerId?: string;
}

export class ProgressAnalyticsComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;

  constructor(options: ProgressAnalyticsComponentOptions) {
    const containerId = options.containerId || 'progress-analytics-container';
    this.container = document.getElementById(containerId) as HTMLElement;
    this.getItems = options.getItems;
  }

  async refresh(): Promise<void> {
    const items = await this.getItems();
    const analytics = this.calculateAnalytics(items);
    this.render(analytics);
  }

  private calculateAnalytics(items: Item[]) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Last 30 days data
    const last30Days = items.filter(item => {
      const created = new Date(item.createdAt);
      return created >= thirtyDaysAgo;
    });

    const completed30Days = last30Days.filter(i => i.completed);
    
    // Weekly trend (last 4 weeks)
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      
      const weekItems = items.filter(item => {
        const created = new Date(item.createdAt);
        return created >= weekStart && created < weekEnd;
      });
      
      const weekCompleted = weekItems.filter(i => i.completed).length;
      const weekTotal = weekItems.length;
      
      weeklyData.unshift({
        week: `Week ${4 - i}`,
        completed: weekCompleted,
        total: weekTotal,
        rate: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
      });
    }

    // Habit consistency
    const habits = items.filter(i => i.isHabit);
    const habitConsistency = habits.map(habit => {
      const streak = habit.habitStreak?.currentStreak || 0;
      const total = habit.habitStreak?.totalCompletions || 0;
      return { habit, streak, total };
    }).sort((a, b) => b.streak - a.streak);

    // Best performing day
    const dayCompletions = new Map<string, number>();
    completed30Days.forEach(item => {
      if (item.completedAt) {
        const day = new Date(item.completedAt).toLocaleDateString('en-US', { weekday: 'long' });
        dayCompletions.set(day, (dayCompletions.get(day) || 0) + 1);
      }
    });

    let bestDay = 'N/A';
    let maxCompletions = 0;
    dayCompletions.forEach((count, day) => {
      if (count > maxCompletions) {
        maxCompletions = count;
        bestDay = day;
      }
    });

    // Average completion time (if we had time data)
    const totalPoints = items.reduce((sum, item) => sum + (item.points || 0), 0);
    
    // Momentum score (based on recent activity)
    const last7Days = items.filter(item => {
      const created = new Date(item.createdAt);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return created >= sevenDaysAgo;
    });
    const momentum = Math.min(last7Days.filter(i => i.completed).length * 10, 100);

    return {
      last30Days: last30Days.length,
      completed30Days: completed30Days.length,
      completionRate30Days: last30Days.length > 0 ? Math.round((completed30Days.length / last30Days.length) * 100) : 0,
      weeklyData,
      habitConsistency: habitConsistency.slice(0, 5),
      bestDay,
      totalPoints,
      momentum
    };
  }

  private render(analytics: any): void {
    this.container.innerHTML = `
      <div class="analytics-card">
        <div class="analytics-header">
          <div class="analytics-title">
            <span class="analytics-icon">📈</span>
            <h3>Progress Analytics</h3>
          </div>
          <div class="analytics-period">Last 30 Days</div>
        </div>

        <div class="analytics-overview">
          <div class="analytics-metric">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-value">${analytics.completionRate30Days}%</div>
              <div class="metric-label">Completion Rate</div>
            </div>
          </div>
          <div class="analytics-metric">
            <div class="metric-icon">🎯</div>
            <div class="metric-content">
              <div class="metric-value">${analytics.completed30Days}</div>
              <div class="metric-label">Tasks Completed</div>
            </div>
          </div>
          <div class="analytics-metric">
            <div class="metric-icon">⚡</div>
            <div class="metric-content">
              <div class="metric-value">${analytics.momentum}%</div>
              <div class="metric-label">Momentum Score</div>
            </div>
          </div>
          <div class="analytics-metric">
            <div class="metric-icon">📅</div>
            <div class="metric-content">
              <div class="metric-value">${analytics.bestDay}</div>
              <div class="metric-label">Best Day</div>
            </div>
          </div>
        </div>

        <div class="analytics-sections">
          <div class="analytics-section">
            <h4>📊 Weekly Trend</h4>
            <div class="weekly-trend-chart">
              ${analytics.weeklyData.map((week: any) => this.renderWeekBar(week)).join('')}
            </div>
          </div>

          ${analytics.habitConsistency.length > 0 ? `
            <div class="analytics-section">
              <h4>🏆 Top Performing Habits</h4>
              <div class="top-habits-list">
                ${analytics.habitConsistency.map((hc: any, index: number) => this.renderTopHabit(hc, index)).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="analytics-insights">
          <h4>💡 Key Insights</h4>
          <div class="insights-grid">
            ${this.generateAnalyticsInsights(analytics).map(insight => `
              <div class="analytics-insight-card">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-text">${insight.text}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private renderWeekBar(week: any): string {
    const maxHeight = 100;
    const height = week.total > 0 ? Math.min((week.completed / week.total) * maxHeight, maxHeight) : 5;
    
    return `
      <div class="week-bar-container">
        <div class="week-bar-wrapper">
          <div class="week-bar" style="height: ${height}%;">
            <span class="week-bar-value">${week.completed}</span>
          </div>
        </div>
        <div class="week-label">${week.week}</div>
        <div class="week-rate">${week.rate}%</div>
      </div>
    `;
  }

  private renderTopHabit(hc: any, index: number): string {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    
    return `
      <div class="top-habit-item">
        <span class="habit-rank">${medals[index]}</span>
        <div class="habit-info">
          <div class="habit-name">${hc.habit.description}</div>
          <div class="habit-stats">
            <span class="habit-streak">🔥 ${hc.streak} day streak</span>
            <span class="habit-total">✓ ${hc.total} completions</span>
          </div>
        </div>
      </div>
    `;
  }

  private generateAnalyticsInsights(analytics: any): Array<{icon: string, text: string}> {
    const insights = [];

    if (analytics.momentum >= 70) {
      insights.push({ icon: '🚀', text: 'You\'re on fire! Your momentum is strong this week.' });
    } else if (analytics.momentum < 30) {
      insights.push({ icon: '💪', text: 'Time to rebuild momentum. Start with one small task today.' });
    }

    if (analytics.completionRate30Days >= 80) {
      insights.push({ icon: '⭐', text: 'Excellent completion rate! You\'re consistently following through.' });
    }

    if (analytics.habitConsistency.length > 0 && analytics.habitConsistency[0].streak >= 7) {
      insights.push({ icon: '🏆', text: `Your longest streak is ${analytics.habitConsistency[0].streak} days. Keep it going!` });
    }

    if (analytics.bestDay !== 'N/A') {
      insights.push({ icon: '📅', text: `${analytics.bestDay} is your most productive day.` });
    }

    if (insights.length === 0) {
      insights.push({ icon: '🌱', text: 'Keep building your habits. Consistency is key!' });
    }

    return insights;
  }
}

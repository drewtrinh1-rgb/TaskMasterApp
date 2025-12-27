/**
 * DashboardComponent - Analytics dashboard with charts
 */

import { Item, Category, CATEGORY_CONFIGS } from '../models/index';
import { AnalyticsCalculator, AnalyticsData, TimeRange, LifeBalanceAnalysis } from '../services/AnalyticsCalculator';

// Chart.js types (loaded from CDN)
declare const Chart: any;

export interface DashboardComponentOptions {
  getItems: () => Promise<Item[]>;
}

export class DashboardComponent {
  private analyticsCalculator: AnalyticsCalculator;
  private options: DashboardComponentOptions;
  private currentTimeRange: TimeRange = 'week';
  private distributionChart: any = null;
  private balanceChart: any = null;
  private completionChart: any = null;

  // DOM elements
  private totalItemsEl: HTMLElement;
  private completedTasksEl: HTMLElement;
  private completionRateEl: HTMLElement;
  private overdueCountEl: HTMLElement;
  private balanceSummaryEl: HTMLElement;
  private upcomingDeadlinesEl: HTMLElement;
  private recommendationsList: HTMLElement;
  private neglectedSection: HTMLElement;
  private neglectedCategories: HTMLElement;
  private timeButtons: NodeListOf<HTMLButtonElement>;

  constructor(options: DashboardComponentOptions) {
    this.options = options;
    this.analyticsCalculator = new AnalyticsCalculator();

    // Get DOM elements
    this.totalItemsEl = document.getElementById('total-items') as HTMLElement;
    this.completedTasksEl = document.getElementById('completed-tasks') as HTMLElement;
    this.completionRateEl = document.getElementById('completion-rate') as HTMLElement;
    this.overdueCountEl = document.getElementById('overdue-count') as HTMLElement;
    this.balanceSummaryEl = document.getElementById('balance-summary') as HTMLElement;
    this.upcomingDeadlinesEl = document.getElementById('upcoming-deadlines') as HTMLElement;
    this.recommendationsList = document.getElementById('recommendations-list') as HTMLElement;
    this.neglectedSection = document.getElementById('neglected-section') as HTMLElement;
    this.neglectedCategories = document.getElementById('neglected-categories') as HTMLElement;
    this.timeButtons = document.querySelectorAll('.time-btn') as NodeListOf<HTMLButtonElement>;

    this.initialize();
  }

  private initialize(): void {
    // Set up time range buttons
    this.timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.timeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTimeRange = btn.dataset.range as TimeRange;
        this.refresh();
      });
    });
  }

  /**
   * Refresh dashboard with latest data
   */
  async refresh(): Promise<void> {
    const items = await this.options.getItems();
    const analytics = this.analyticsCalculator.calculate(items, this.currentTimeRange);
    this.render(analytics);
  }

  /**
   * Render the dashboard
   */
  private render(analytics: AnalyticsData): void {
    // Update key metrics
    this.totalItemsEl.textContent = analytics.totalItems.toString();
    this.completedTasksEl.textContent = `${analytics.completedTasks}/${analytics.totalTasks}`;
    this.completionRateEl.textContent = `${Math.round(analytics.overallCompletionRate * 100)}%`;
    this.overdueCountEl.textContent = analytics.overdueCount.toString();
    
    // Style overdue count
    if (analytics.overdueCount > 0) {
      this.overdueCountEl.style.color = '#DC143C';
    } else {
      this.overdueCountEl.style.color = '#32CD32';
    }

    // Update charts
    this.renderDistributionChart(analytics);
    this.renderBalanceChart(analytics);
    this.renderCompletionChart(analytics);
    
    // Update upcoming deadlines
    this.renderUpcomingDeadlines(analytics.upcomingDeadlines);

    // Update recommendations
    this.renderRecommendations(analytics.recommendations);

    // Update neglected categories
    this.renderNeglectedCategories(analytics.neglectedCategories, analytics.lifeBalance);
  }

  private renderDistributionChart(analytics: AnalyticsData): void {
    const ctx = document.getElementById('distribution-chart') as HTMLCanvasElement;
    
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];

    for (const [category, count] of analytics.categoryDistribution) {
      if (count > 0) {
        const config = CATEGORY_CONFIGS[category];
        labels.push(config.name);
        data.push(count);
        colors.push(config.color);
      }
    }

    // Destroy existing chart
    if (this.distributionChart) {
      this.distributionChart.destroy();
    }

    // Handle empty state
    if (data.length === 0) {
      labels.push('No items yet');
      data.push(1);
      colors.push('#e0e0e0');
    }

    // Create new chart
    this.distributionChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 8
            }
          }
        }
      }
    });
  }

  private renderBalanceChart(analytics: AnalyticsData): void {
    const ctx = document.getElementById('balance-chart') as HTMLCanvasElement;
    const { wellnessCount, productivityCount } = analytics.lifeBalance;

    // Destroy existing chart
    if (this.balanceChart) {
      this.balanceChart.destroy();
    }

    const total = wellnessCount + productivityCount;
    
    // Handle empty state
    if (total === 0) {
      this.balanceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['No items yet'],
          datasets: [{
            data: [1],
            backgroundColor: ['#e0e0e0'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          cutout: '60%',
          plugins: {
            legend: { display: false }
          }
        }
      });
      this.balanceSummaryEl.innerHTML = '<p style="text-align:center;color:#666;">Add items to see your life balance</p>';
      return;
    }

    // Create balance chart
    this.balanceChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Wellness', 'Productivity'],
        datasets: [{
          data: [wellnessCount, productivityCount],
          backgroundColor: ['#32CD32', '#4169E1'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    // Update summary
    const ratio = productivityCount > 0 ? (wellnessCount / productivityCount * 100).toFixed(0) : '100';
    const status = analytics.lifeBalance.isImbalanced ? '⚠️ Imbalanced' : '✅ Balanced';
    this.balanceSummaryEl.innerHTML = `
      <p style="text-align:center;margin-top:10px;">
        <strong>${status}</strong><br>
        <span style="font-size:0.85rem;color:#666;">
          Wellness ${wellnessCount} : Productivity ${productivityCount} (${ratio}% ratio)
        </span>
      </p>
    `;
  }

  private renderCompletionChart(analytics: AnalyticsData): void {
    const ctx = document.getElementById('completion-chart') as HTMLCanvasElement;
    
    const labels: string[] = [];
    const completedData: number[] = [];
    const incompleteData: number[] = [];
    const colors: string[] = [];

    // Only show categories that have tasks
    for (const [category, stats] of analytics.categoryStats) {
      const totalTasks = stats.completed + stats.incomplete;
      if (totalTasks > 0) {
        const config = CATEGORY_CONFIGS[category];
        labels.push(config.name);
        completedData.push(stats.completed);
        incompleteData.push(stats.incomplete);
        colors.push(config.color);
      }
    }

    // Destroy existing chart
    if (this.completionChart) {
      this.completionChart.destroy();
    }

    // Handle empty state
    if (labels.length === 0) {
      this.completionChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['No tasks yet'],
          datasets: [{
            label: 'Tasks',
            data: [0],
            backgroundColor: '#e0e0e0'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, max: 1 }
          }
        }
      });
      return;
    }

    // Create stacked bar chart
    this.completionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Completed',
            data: completedData,
            backgroundColor: '#32CD32',
            borderRadius: 4
          },
          {
            label: 'Incomplete',
            data: incompleteData,
            backgroundColor: '#FFB6C1',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private renderUpcomingDeadlines(deadlines: Item[]): void {
    if (deadlines.length === 0) {
      this.upcomingDeadlinesEl.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#666;">
          <p>🎉 No upcoming deadlines!</p>
          <p style="font-size:0.85rem;">Tasks with due dates in the next 7 days will appear here.</p>
        </div>
      `;
      return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let html = '<ul class="deadline-items">';
    for (const item of deadlines) {
      const dueDate = new Date(item.dueDate!);
      const config = CATEGORY_CONFIGS[item.category];
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let urgency = '';
      if (daysUntil === 0) urgency = '🔴 Today';
      else if (daysUntil === 1) urgency = '🟠 Tomorrow';
      else if (daysUntil <= 3) urgency = `🟡 ${daysUntil} days`;
      else urgency = `🟢 ${daysUntil} days`;

      html += `
        <li class="deadline-item" style="border-left: 3px solid ${config.color};">
          <div class="deadline-info">
            <span class="deadline-desc">${this.escapeHtml(item.description)}</span>
            <span class="deadline-category" style="background:${config.color};color:${this.getContrastColor(config.color)}">${config.name}</span>
          </div>
          <span class="deadline-urgency">${urgency}</span>
        </li>
      `;
    }
    html += '</ul>';
    
    this.upcomingDeadlinesEl.innerHTML = html;
  }

  private renderRecommendations(recommendations: string[]): void {
    this.recommendationsList.innerHTML = '';
    
    for (const rec of recommendations) {
      const li = document.createElement('li');
      li.textContent = rec;
      this.recommendationsList.appendChild(li);
    }
  }

  private renderNeglectedCategories(neglected: Category[], lifeBalance: LifeBalanceAnalysis): void {
    if (neglected.length === 0 && !lifeBalance.isImbalanced) {
      this.neglectedSection.style.display = 'none';
      return;
    }

    this.neglectedSection.style.display = 'block';
    this.neglectedCategories.innerHTML = '';

    // Show neglected category badges
    for (const category of neglected) {
      const config = CATEGORY_CONFIGS[category];
      const badge = document.createElement('span');
      badge.className = 'neglected-badge';
      badge.style.backgroundColor = config.color;
      badge.style.color = this.getContrastColor(config.color);
      badge.textContent = config.name;
      this.neglectedCategories.appendChild(badge);
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private getContrastColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
}

export default DashboardComponent;

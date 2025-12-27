/**
 * AnalyticsCalculator - Calculates analytics and insights from items
 */

import { Item, Category, CATEGORY_CONFIGS } from '../models/index';

/**
 * Time range options for analytics
 */
export type TimeRange = 'week' | 'month' | 'all';

/**
 * Category statistics
 */
export interface CategoryStats {
  total: number;
  completed: number;
  incomplete: number;
  completionRate: number;
}

/**
 * Life balance analysis
 */
export interface LifeBalanceAnalysis {
  wellnessCount: number;
  productivityCount: number;
  ratio: number; // wellness / productivity (1.0 = balanced)
  isImbalanced: boolean;
  neglectedCategories: Category[];
}

/**
 * Analytics data structure
 */
export interface AnalyticsData {
  categoryDistribution: Map<Category, number>;
  categoryStats: Map<Category, CategoryStats>;
  totalItems: number;
  totalTasks: number;
  totalNotes: number;
  completedTasks: number;
  overallCompletionRate: number;
  overdueCount: number;
  upcomingDeadlines: Item[];
  neglectedCategories: Category[];
  recommendations: string[];
  lifeBalance: LifeBalanceAnalysis;
}

// Categories grouped by type
const WELLNESS_CATEGORIES = [
  Category.SELF_CARE,
  Category.EXERCISE,
  Category.PARTNER,
  Category.FRIENDS_SOCIAL
];

const PRODUCTIVITY_CATEGORIES = [
  Category.WORK,
  Category.IMPORTANT_PRIORITY,
  Category.TASKS
];

// Balance thresholds
const IDEAL_WELLNESS_RATIO = 0.4; // Wellness should be at least 40% of productivity
const IMBALANCE_THRESHOLD = 0.25; // Below 25% is considered imbalanced
const MIN_ITEMS_FOR_ANALYSIS = 5; // Need at least 5 items to analyze balance

/**
 * AnalyticsCalculator class for computing analytics
 */
export class AnalyticsCalculator {
  /**
   * Get the start date for a time range
   */
  private getStartDate(timeRange: TimeRange): Date | null {
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        return weekAgo;
      
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        return monthAgo;
      
      case 'all':
        return null;
    }
  }

  /**
   * Filter items by time range based on creation date
   */
  private filterByTimeRange(items: Item[], timeRange: TimeRange): Item[] {
    const startDate = this.getStartDate(timeRange);
    
    if (!startDate) {
      return items;
    }

    return items.filter(item => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= startDate;
    });
  }

  /**
   * Calculate category distribution
   */
  private calculateCategoryDistribution(items: Item[]): Map<Category, number> {
    const distribution = new Map<Category, number>();
    
    // Initialize all categories with 0
    for (const category of Object.values(Category)) {
      distribution.set(category, 0);
    }

    // Count items per category
    for (const item of items) {
      const count = distribution.get(item.category) ?? 0;
      distribution.set(item.category, count + 1);
    }

    return distribution;
  }

  /**
   * Calculate statistics per category
   */
  private calculateCategoryStats(items: Item[]): Map<Category, CategoryStats> {
    const stats = new Map<Category, CategoryStats>();

    // Initialize all categories
    for (const category of Object.values(Category)) {
      stats.set(category, {
        total: 0,
        completed: 0,
        incomplete: 0,
        completionRate: 0
      });
    }

    // Calculate stats
    for (const item of items) {
      const categoryStats = stats.get(item.category)!;
      categoryStats.total++;
      
      if (item.type === 'task') {
        if (item.completed) {
          categoryStats.completed++;
        } else {
          categoryStats.incomplete++;
        }
      }
    }

    // Calculate completion rates
    for (const [category, categoryStats] of stats) {
      const tasks = categoryStats.completed + categoryStats.incomplete;
      categoryStats.completionRate = tasks > 0 
        ? categoryStats.completed / tasks 
        : 0;
      stats.set(category, categoryStats);
    }

    return stats;
  }

  /**
   * Analyze life balance between wellness and productivity categories
   */
  private analyzeLifeBalance(distribution: Map<Category, number>): LifeBalanceAnalysis {
    // Count wellness categories
    let wellnessCount = 0;
    for (const category of WELLNESS_CATEGORIES) {
      wellnessCount += distribution.get(category) ?? 0;
    }

    // Count productivity categories
    let productivityCount = 0;
    for (const category of PRODUCTIVITY_CATEGORIES) {
      productivityCount += distribution.get(category) ?? 0;
    }

    // Calculate ratio (wellness relative to productivity)
    // A ratio of 1.0 means equal wellness and productivity items
    // A ratio of 0.5 means half as many wellness items as productivity
    const ratio = productivityCount > 0 ? wellnessCount / productivityCount : 1.0;

    // Determine if imbalanced
    const totalRelevant = wellnessCount + productivityCount;
    const isImbalanced = totalRelevant >= MIN_ITEMS_FOR_ANALYSIS && ratio < IMBALANCE_THRESHOLD;

    // Find specific neglected wellness categories
    const neglectedCategories: Category[] = [];
    
    if (totalRelevant >= MIN_ITEMS_FOR_ANALYSIS) {
      // Check each wellness category individually
      for (const category of WELLNESS_CATEGORIES) {
        const count = distribution.get(category) ?? 0;
        // A wellness category is neglected if it has 0 items while productivity has items
        // OR if it's significantly underrepresented
        if (productivityCount > 0 && count === 0) {
          neglectedCategories.push(category);
        } else if (productivityCount >= 3 && count < productivityCount * 0.1) {
          // Less than 10% of productivity count
          neglectedCategories.push(category);
        }
      }
    }

    return {
      wellnessCount,
      productivityCount,
      ratio,
      isImbalanced,
      neglectedCategories
    };
  }

  /**
   * Generate recommendations based on analytics
   */
  private generateRecommendations(
    lifeBalance: LifeBalanceAnalysis,
    categoryStats: Map<Category, CategoryStats>,
    overdueCount: number
  ): string[] {
    const recommendations: string[] = [];

    // Overdue tasks warning
    if (overdueCount > 0) {
      recommendations.push(
        `🚨 You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}. Consider addressing them soon!`
      );
    }

    // Life balance recommendations
    if (lifeBalance.isImbalanced) {
      recommendations.push(
        `⚠️ Your tasks are heavily skewed towards work/productivity (${lifeBalance.productivityCount} items) vs wellness (${lifeBalance.wellnessCount} items). Consider adding more self-care, exercise, or social activities.`
      );
    } else if (lifeBalance.ratio < IDEAL_WELLNESS_RATIO && lifeBalance.productivityCount >= MIN_ITEMS_FOR_ANALYSIS) {
      recommendations.push(
        `💡 Tip: Try to maintain a better balance between work and personal wellness activities.`
      );
    }

    // Specific neglected category recommendations
    for (const category of lifeBalance.neglectedCategories) {
      const config = CATEGORY_CONFIGS[category];
      switch (category) {
        case Category.SELF_CARE:
          recommendations.push(`🧘 You haven't added any ${config.name} activities. Remember to take care of yourself!`);
          break;
        case Category.EXERCISE:
          recommendations.push(`🏃 No ${config.name} items found. Physical activity is important for well-being!`);
          break;
        case Category.PARTNER:
          recommendations.push(`💕 Consider scheduling some quality time with your partner.`);
          break;
        case Category.FRIENDS_SOCIAL:
          recommendations.push(`👥 Don't forget to nurture your friendships and social connections!`);
          break;
      }
    }

    // Recommendations for low completion rates
    for (const [category, stats] of categoryStats) {
      if (stats.total > 0 && stats.completionRate < 0.3 && stats.incomplete > 2) {
        const config = CATEGORY_CONFIGS[category];
        recommendations.push(
          `📋 You have ${stats.incomplete} incomplete ${config.name} tasks. Consider prioritizing them.`
        );
      }
    }

    // Positive feedback if balanced
    if (recommendations.length === 0) {
      if (lifeBalance.wellnessCount > 0 && lifeBalance.productivityCount > 0) {
        recommendations.push('✨ Great job! Your tasks show a healthy balance between work and personal life.');
      } else {
        recommendations.push('👋 Start adding tasks to see personalized recommendations!');
      }
    }

    return recommendations;
  }

  /**
   * Get overdue tasks count
   */
  private getOverdueCount(items: Item[]): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return items.filter(item => {
      if (!item.dueDate || item.completed || item.type !== 'task') return false;
      const dueDate = new Date(item.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < now;
    }).length;
  }

  /**
   * Get upcoming deadlines (next 7 days)
   */
  private getUpcomingDeadlines(items: Item[]): Item[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return items
      .filter(item => {
        if (!item.dueDate || item.completed || item.type !== 'task') return false;
        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5); // Top 5 upcoming
  }

  /**
   * Calculate full analytics for items
   */
  calculate(items: Item[], timeRange: TimeRange = 'all'): AnalyticsData {
    // Filter by time range
    const filteredItems = this.filterByTimeRange(items, timeRange);

    // Calculate distributions and stats
    const categoryDistribution = this.calculateCategoryDistribution(filteredItems);
    const categoryStats = this.calculateCategoryStats(filteredItems);

    // Count totals
    const totalItems = filteredItems.length;
    const tasks = filteredItems.filter(item => item.type === 'task');
    const totalTasks = tasks.length;
    const totalNotes = filteredItems.filter(item => item.type === 'note').length;
    const completedTasks = tasks.filter(item => item.completed).length;
    const overallCompletionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

    // Analyze life balance
    const lifeBalance = this.analyzeLifeBalance(categoryDistribution);

    // Get overdue and upcoming
    const overdueCount = this.getOverdueCount(filteredItems);
    const upcomingDeadlines = this.getUpcomingDeadlines(filteredItems);

    // Generate recommendations
    const recommendations = this.generateRecommendations(lifeBalance, categoryStats, overdueCount);

    return {
      categoryDistribution,
      categoryStats,
      totalItems,
      totalTasks,
      totalNotes,
      completedTasks,
      overallCompletionRate,
      overdueCount,
      upcomingDeadlines,
      neglectedCategories: lifeBalance.neglectedCategories,
      recommendations,
      lifeBalance
    };
  }
}

export default AnalyticsCalculator;

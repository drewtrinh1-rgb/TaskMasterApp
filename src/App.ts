/**
 * App - Main application class with progress tracking and confetti
 */

import { Item, CreateItemInput, UpdateItemInput } from './models/index';
import { StorageManager, CategorizationEngine, ItemManager, ItemError } from './services/index';
import { ProjectManager } from './services/ProjectManager';
import { InputComponent } from './components/InputComponent';
import { TaskListComponent } from './components/TaskListComponent';
import { CalendarComponent } from './components/CalendarComponent';
import { ProjectsComponent } from './components/ProjectsComponent';
import { SettingsComponent } from './components/SettingsComponent';
import { DailyFocusComponent } from './components/DailyFocusComponent';
import { HabitTrackerComponent } from './components/HabitTrackerComponent';
import { QuickWinsComponent } from './components/QuickWinsComponent';
import { WeeklyReviewComponent } from './components/WeeklyReviewComponent';
import { HabitTemplatesComponent } from './components/HabitTemplatesComponent';
import { HabitHeatmapComponent } from './components/HabitHeatmapComponent';
import { IdentityGoalsComponent } from './components/IdentityGoalsComponent';
import { ProgressAnalyticsComponent } from './components/ProgressAnalyticsComponent';
import { EditModal } from './components/EditModal';
import { Toast } from './components/Toast';
import { Confetti } from './utils/confetti';
import { FloatingDotsBackground } from './utils/floatingDots';
import { seedProjects } from './utils/seedProjects';

export class App {
  private storageManager: StorageManager;
  private categorizationEngine: CategorizationEngine;
  private itemManager: ItemManager;
  private projectManager: ProjectManager;
  private floatingDots: FloatingDotsBackground | null = null;
  private taskListComponent!: TaskListComponent;
  private calendarComponent!: CalendarComponent;
  private projectsComponent!: ProjectsComponent;
  private settingsComponent!: SettingsComponent;
  private dailyFocusComponent!: DailyFocusComponent;
  private habitTrackerComponent!: HabitTrackerComponent;
  private quickWinsComponent!: QuickWinsComponent;
  private weeklyReviewComponent!: WeeklyReviewComponent;
  private habitTemplatesComponent!: HabitTemplatesComponent;
  private habitHeatmapComponent!: HabitHeatmapComponent;
  private identityGoalsComponent!: IdentityGoalsComponent;
  private progressAnalyticsComponent!: ProgressAnalyticsComponent;
  
  // Hub components (duplicates for Hub view)
  private hubWeeklyReviewComponent!: WeeklyReviewComponent;
  private hubProgressAnalyticsComponent!: ProgressAnalyticsComponent;
  private hubHabitHeatmapComponent!: HabitHeatmapComponent;
  private hubIdentityGoalsComponent!: IdentityGoalsComponent;
  
  private editModal!: EditModal;
  private toast!: Toast;
  private confetti!: Confetti;

  private hubBtn!: HTMLButtonElement;
  private tasksBtn!: HTMLButtonElement;
  private projectsBtn!: HTMLButtonElement;
  private calendarBtn!: HTMLButtonElement;
  private settingsBtn!: HTMLButtonElement;
  private hubView!: HTMLElement;
  private tasksView!: HTMLElement;
  private projectsView!: HTMLElement;
  private calendarView!: HTMLElement;
  private settingsView!: HTMLElement;
  
  // Progress elements
  private progressRingFill!: SVGCircleElement;
  private progressPercent!: HTMLElement;
  private progressDetail!: HTMLElement;

  constructor() {
    this.storageManager = new StorageManager();
    this.categorizationEngine = new CategorizationEngine();
    this.itemManager = new ItemManager(this.storageManager, this.categorizationEngine);
    this.projectManager = new ProjectManager();
  }

  setFloatingDots(floatingDots: FloatingDotsBackground): void {
    this.floatingDots = floatingDots;
  }

  async initialize(): Promise<void> {
    try {
      await this.itemManager.loadItems();
      if (!this.storageManager.isStorageAvailable()) {
        console.warn('localStorage not available');
      }
      this.initializeComponents();
      this.initializeNavigation();
      this.initializeProgress();
      
      // Check for missed habits (Phase 2)
      await this.itemManager.checkMissedHabits();
      
      await this.refreshAll();
      
      // Render habit templates
      this.habitTemplatesComponent.render();
      
      // Render Phase 3 components
      await this.habitHeatmapComponent.refresh();
      await this.identityGoalsComponent.refresh();
      await this.progressAnalyticsComponent.refresh();
      
      // Seed projects on first run
      seedProjects(this.projectManager);
      
      // Show calendar by default
      this.showView('calendar');
      
      console.log('App initialized');
    } catch (error) {
      console.error('Init failed:', error);
      this.toast?.error('Failed to initialize');
    }
  }

  private initializeComponents(): void {
    this.toast = new Toast();
    this.confetti = new Confetti();
    
    new InputComponent({
      onSubmit: this.handleCreateItem.bind(this),
      categorizationEngine: this.categorizationEngine
    });

    this.taskListComponent = new TaskListComponent({
      getItems: () => this.itemManager.getAllItems(),
      onComplete: this.handleToggleComplete.bind(this),
      onEdit: this.handleEditItem.bind(this),
      onDelete: this.handleDeleteItem.bind(this)
    });

    this.calendarComponent = new CalendarComponent({
      getItems: () => this.itemManager.getAllItems(),
      onTaskClick: this.handleEditItem.bind(this)
    });

    this.projectsComponent = new ProjectsComponent({
      projectManager: this.projectManager,
      onRefresh: () => this.projectsComponent.render()
    });

    this.settingsComponent = new SettingsComponent({
      onDataChange: () => this.handleDataImport()
    });

    this.dailyFocusComponent = new DailyFocusComponent({
      getItems: () => this.itemManager.getAllItems(),
      onComplete: this.handleToggleComplete.bind(this),
      onEdit: this.handleEditItem.bind(this),
      onSetPriority: this.handleSetPriority.bind(this)
    });

    this.habitTrackerComponent = new HabitTrackerComponent({
      getItems: () => this.itemManager.getAllItems(),
      onComplete: this.handleToggleComplete.bind(this),
      onEdit: this.handleEditItem.bind(this)
    });

    this.quickWinsComponent = new QuickWinsComponent({
      getItems: () => this.itemManager.getAllItems(),
      onComplete: this.handleToggleComplete.bind(this)
    });

    this.weeklyReviewComponent = new WeeklyReviewComponent({
      getItems: () => this.itemManager.getAllItems()
    });

    this.habitTemplatesComponent = new HabitTemplatesComponent({
      onSelectTemplate: this.handleCreateItem.bind(this)
    });

    this.habitHeatmapComponent = new HabitHeatmapComponent({
      getItems: () => this.itemManager.getAllItems()
    });

    this.identityGoalsComponent = new IdentityGoalsComponent({
      getItems: () => this.itemManager.getAllItems(),
      onAddGoal: () => {} // Placeholder
    });

    this.progressAnalyticsComponent = new ProgressAnalyticsComponent({
      getItems: () => this.itemManager.getAllItems()
    });

    // Hub components (separate instances)
    this.hubWeeklyReviewComponent = new WeeklyReviewComponent({
      getItems: () => this.itemManager.getAllItems(),
      containerId: 'hub-weekly-review-container'
    });

    this.hubProgressAnalyticsComponent = new ProgressAnalyticsComponent({
      getItems: () => this.itemManager.getAllItems(),
      containerId: 'hub-progress-analytics-container'
    });

    this.hubHabitHeatmapComponent = new HabitHeatmapComponent({
      getItems: () => this.itemManager.getAllItems(),
      containerId: 'hub-habit-heatmap-container'
    });

    this.hubIdentityGoalsComponent = new IdentityGoalsComponent({
      getItems: () => this.itemManager.getAllItems(),
      onAddGoal: () => {}, // Placeholder
      containerId: 'hub-identity-goals-container'
    });

    this.editModal = new EditModal({
      onSave: this.handleSaveEdit.bind(this)
    });
  }

  private initializeNavigation(): void {
    this.hubBtn = document.getElementById('nav-hub') as HTMLButtonElement;
    this.tasksBtn = document.getElementById('nav-tasks') as HTMLButtonElement;
    this.projectsBtn = document.getElementById('nav-projects') as HTMLButtonElement;
    this.calendarBtn = document.getElementById('nav-calendar') as HTMLButtonElement;
    this.settingsBtn = document.getElementById('nav-settings') as HTMLButtonElement;
    this.hubView = document.getElementById('hub-view') as HTMLElement;
    this.tasksView = document.getElementById('tasks-view') as HTMLElement;
    this.projectsView = document.getElementById('projects-view') as HTMLElement;
    this.calendarView = document.getElementById('calendar-view') as HTMLElement;
    this.settingsView = document.getElementById('settings-view') as HTMLElement;

    // Check if all elements exist
    if (!this.hubBtn || !this.tasksBtn || !this.projectsBtn || !this.calendarBtn || !this.settingsBtn) {
      console.error('Navigation buttons not found in DOM');
      return;
    }
    
    if (!this.hubView || !this.tasksView || !this.projectsView || !this.calendarView || !this.settingsView) {
      console.error('View containers not found in DOM');
      return;
    }

    this.hubBtn.addEventListener('click', () => this.showView('hub'));
    this.tasksBtn.addEventListener('click', () => this.showView('tasks'));
    this.projectsBtn.addEventListener('click', () => this.showView('projects'));
    this.calendarBtn.addEventListener('click', () => this.showView('calendar'));
    this.settingsBtn.addEventListener('click', () => this.showView('settings'));
  }

  private initializeProgress(): void {
    this.progressRingFill = document.getElementById('progress-ring-fill') as unknown as SVGCircleElement;
    this.progressPercent = document.getElementById('progress-percent') as HTMLElement;
    this.progressDetail = document.getElementById('progress-detail') as HTMLElement;
  }

  private async updateProgress(): Promise<void> {
    const items = await this.itemManager.getAllItems();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's tasks
    const todaysTasks = items.filter(item => {
      if (item.type !== 'task') return false;
      const created = new Date(item.createdAt);
      created.setHours(0, 0, 0, 0);
      return created.getTime() === today.getTime();
    });

    const total = todaysTasks.length;
    const completed = todaysTasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update UI
    this.progressPercent.textContent = `${percent}%`;
    this.progressDetail.textContent = `${completed} of ${total} tasks`;
    
    // Update ring (circumference = 2 * PI * 35 ≈ 220)
    const circumference = 220;
    const offset = circumference - (percent / 100) * circumference;
    this.progressRingFill.style.strokeDashoffset = offset.toString();

    // Confetti when all tasks completed
    if (total > 0 && completed === total) {
      this.confetti.fire();
    }
  }

  private showView(view: 'hub' | 'tasks' | 'projects' | 'calendar' | 'settings'): void {
    // Remove active from all
    this.hubView.classList.remove('active');
    this.tasksView.classList.remove('active');
    this.projectsView.classList.remove('active');
    this.calendarView.classList.remove('active');
    this.settingsView.classList.remove('active');
    this.hubBtn.classList.remove('active');
    this.tasksBtn.classList.remove('active');
    this.projectsBtn.classList.remove('active');
    this.calendarBtn.classList.remove('active');
    this.settingsBtn.classList.remove('active');

    // Update floating dots color
    if (this.floatingDots) {
      this.floatingDots.setTab(view);
    }

    if (view === 'hub') {
      this.hubView.classList.add('active');
      this.hubBtn.classList.add('active');
      this.refreshHub();
    } else if (view === 'tasks') {
      this.tasksView.classList.add('active');
      this.tasksBtn.classList.add('active');
      this.taskListComponent.refresh();
    } else if (view === 'projects') {
      this.projectsView.classList.add('active');
      this.projectsBtn.classList.add('active');
      this.projectsComponent.render();
    } else if (view === 'settings') {
      this.settingsView.classList.add('active');
      this.settingsBtn.classList.add('active');
      this.settingsComponent.render();
    } else {
      this.calendarView.classList.add('active');
      this.calendarBtn.classList.add('active');
      this.calendarComponent.refresh();
    }
  }

  private async handleDataImport(): Promise<void> {
    // Reload all data after import
    await this.itemManager.loadItems();
    this.projectManager = new ProjectManager(); // Reload projects
    await this.refreshAll();
    this.toast.success('Data imported successfully! Page will reload...');
    setTimeout(() => window.location.reload(), 2000);
  }

  private async refreshHub(): Promise<void> {
    await this.hubWeeklyReviewComponent.refresh();
    await this.hubProgressAnalyticsComponent.refresh();
    await this.hubHabitHeatmapComponent.refresh();
    await this.hubIdentityGoalsComponent.refresh();
  }

  private async refreshAll(): Promise<void> {
    try {
      await this.taskListComponent?.refresh();
    } catch (e) { console.warn('taskListComponent refresh failed:', e); }
    
    try {
      await this.calendarComponent?.refresh();
    } catch (e) { console.warn('calendarComponent refresh failed:', e); }
    
    try {
      await this.dailyFocusComponent?.refresh();
    } catch (e) { console.warn('dailyFocusComponent refresh failed:', e); }
    
    try {
      await this.habitTrackerComponent?.refresh();
    } catch (e) { console.warn('habitTrackerComponent refresh failed:', e); }
    
    try {
      await this.quickWinsComponent?.refresh();
    } catch (e) { console.warn('quickWinsComponent refresh failed:', e); }
    
    try {
      await this.weeklyReviewComponent?.refresh();
    } catch (e) { console.warn('weeklyReviewComponent refresh failed:', e); }
    
    try {
      await this.habitHeatmapComponent?.refresh();
    } catch (e) { console.warn('habitHeatmapComponent refresh failed:', e); }
    
    try {
      await this.identityGoalsComponent?.refresh();
    } catch (e) { console.warn('identityGoalsComponent refresh failed:', e); }
    
    try {
      await this.progressAnalyticsComponent?.refresh();
    } catch (e) { console.warn('progressAnalyticsComponent refresh failed:', e); }
    
    try {
      await this.updateProgress();
    } catch (e) { console.warn('updateProgress failed:', e); }
  }

  private async handleCreateItem(input: CreateItemInput): Promise<void> {
    try {
      const item = await this.itemManager.createItem(input);
      this.toast.success(`Added: ${item.description}`);
      await this.refreshAll();
    } catch (error) {
      if (error instanceof ItemError) this.toast.error(error.message);
      else this.toast.error('Failed to create item');
      throw error;
    }
  }

  private async handleToggleComplete(id: string): Promise<void> {
    try {
      const item = await this.itemManager.getItem(id);
      if (!item) return;

      if (item.completed) {
        await this.itemManager.markIncomplete(id);
        this.toast.info('Marked incomplete');
      } else {
        const updatedItem = await this.itemManager.markComplete(id);
        
        // Enhanced celebration based on item type
        if (updatedItem.isHabit && updatedItem.habitStreak) {
          const streak = updatedItem.habitStreak.currentStreak;
          const wasRecovery = updatedItem.habitStreak.missedYesterday;
          
          if (wasRecovery) {
            this.toast.success('💪 Never miss twice! Back on track! +10 bonus');
            this.confetti.fire();
          } else if (streak === 1) {
            this.toast.success('🎉 Habit started! Day 1 streak!');
          } else if (streak === 7) {
            this.toast.success('🔥 7-day streak! You\'re on fire!');
            this.confetti.fire();
          } else if (streak === 30) {
            this.toast.success('🏆 30-day streak! Incredible!');
            this.confetti.fire();
          } else if (streak % 10 === 0) {
            this.toast.success(`🔥 ${streak}-day streak! Keep going!`);
            this.confetti.fire();
          } else {
            this.toast.success(`✅ Habit completed! ${streak}-day streak 🔥`);
          }
        } else if (updatedItem.priority === 'daily-focus') {
          this.toast.success('🎯 Focus task completed! +25 points');
          this.confetti.fire();
        } else if (updatedItem.effortLevel === 'quick') {
          this.toast.success('⚡ Quick win! +5 points');
        } else {
          this.toast.success('✅ Task completed! +10 points');
        }
      }
      await this.refreshAll();
    } catch (error) {
      this.toast.error('Failed to update');
      console.error(error);
    }
  }

  private handleEditItem(item: Item): void {
    this.editModal.open(item);
  }

  private async handleSetPriority(id: string, priority: 'daily-focus' | null): Promise<void> {
    try {
      await this.itemManager.setPriority(id, priority);
      if (priority === 'daily-focus') {
        this.toast.success('Added to Daily Focus');
      } else {
        this.toast.info('Removed from Daily Focus');
      }
      await this.refreshAll();
    } catch (error) {
      this.toast.error('Failed to update priority');
      console.error(error);
    }
  }

  private async handleSaveEdit(id: string, updates: UpdateItemInput): Promise<void> {
    try {
      await this.itemManager.updateItem(id, updates);
      this.toast.success('Updated');
      await this.refreshAll();
    } catch (error) {
      if (error instanceof ItemError) this.toast.error(error.message);
      else this.toast.error('Failed to update');
      throw error;
    }
  }

  private async handleDeleteItem(id: string): Promise<void> {
    try {
      await this.itemManager.deleteItem(id);
      this.toast.info('Deleted');
      await this.refreshAll();
    } catch (error) {
      this.toast.error('Failed to delete');
      console.error(error);
    }
  }
}

export default App;

/**
 * InputComponent - Handles task/note input form with quick category buttons
 */

import { Category, CATEGORY_CONFIGS, CreateItemInput } from '../models/index';
import { CategorizationEngine } from '../services/CategorizationEngine';

export interface InputComponentOptions {
  onSubmit: (input: CreateItemInput) => Promise<void>;
  categorizationEngine: CategorizationEngine;
}

export class InputComponent {
  private form: HTMLFormElement;
  private descriptionInput: HTMLInputElement;
  private categorySelect: HTMLSelectElement;
  private dueDateInput: HTMLInputElement;
  private locationInput: HTMLInputElement;
  private tagsInput: HTMLInputElement;
  private effortLevelSelect: HTMLSelectElement;
  private prioritySelect: HTMLSelectElement;
  private isHabitCheckbox: HTMLInputElement;
  private intentionTimeInput: HTMLInputElement;
  private intentionLocationInput: HTMLInputElement;
  private intentionDurationInput: HTMLInputElement;
  private stackAfterHabitSelect: HTMLSelectElement;
  private categorySuggestion: HTMLElement;
  private suggestedCategorySpan: HTMLElement;
  private quickCategoryBtns: NodeListOf<HTMLButtonElement>;
  private categorizationEngine: CategorizationEngine;
  private onSubmit: (input: CreateItemInput) => Promise<void>;
  private selectedQuickCategory: Category | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: InputComponentOptions) {
    this.onSubmit = options.onSubmit;
    this.categorizationEngine = options.categorizationEngine;

    this.form = document.getElementById('item-form') as HTMLFormElement;
    this.descriptionInput = document.getElementById('description-input') as HTMLInputElement;
    this.categorySelect = document.getElementById('category-select') as HTMLSelectElement;
    this.dueDateInput = document.getElementById('due-date-input') as HTMLInputElement;
    this.locationInput = document.getElementById('location-input') as HTMLInputElement;
    this.tagsInput = document.getElementById('tags-input') as HTMLInputElement;
    this.effortLevelSelect = document.getElementById('effort-level-select') as HTMLSelectElement;
    this.prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
    this.isHabitCheckbox = document.getElementById('is-habit-checkbox') as HTMLInputElement;
    this.intentionTimeInput = document.getElementById('intention-time') as HTMLInputElement;
    this.intentionLocationInput = document.getElementById('intention-location') as HTMLInputElement;
    this.intentionDurationInput = document.getElementById('intention-duration') as HTMLInputElement;
    this.stackAfterHabitSelect = document.getElementById('stack-after-habit') as HTMLSelectElement;
    this.categorySuggestion = document.getElementById('category-suggestion') as HTMLElement;
    this.suggestedCategorySpan = document.getElementById('suggested-category') as HTMLElement;
    this.quickCategoryBtns = document.querySelectorAll('.quick-cat-btn') as NodeListOf<HTMLButtonElement>;

    this.initialize();
  }

  private initialize(): void {
    this.populateCategorySelect();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.descriptionInput.addEventListener('input', this.handleDescriptionChange.bind(this));
    
    // Quick category buttons
    this.quickCategoryBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleQuickCategoryClick(btn));
    });
  }

  private populateCategorySelect(): void {
    for (const [category, config] of Object.entries(CATEGORY_CONFIGS)) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = config.name;
      this.categorySelect.appendChild(option);
    }
  }

  private handleQuickCategoryClick(btn: HTMLButtonElement): void {
    const category = btn.dataset.category as Category;
    
    // Toggle selection
    if (this.selectedQuickCategory === category) {
      this.selectedQuickCategory = null;
      btn.classList.remove('selected');
    } else {
      // Remove selection from all buttons
      this.quickCategoryBtns.forEach(b => b.classList.remove('selected'));
      this.selectedQuickCategory = category;
      btn.classList.add('selected');
    }
    
    // Focus the input
    this.descriptionInput.focus();
  }

  private handleDescriptionChange(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.updateCategorySuggestion(), 100);
  }

  private updateCategorySuggestion(): void {
    const description = this.descriptionInput.value.trim();
    
    if (description.length >= 1 && !this.selectedQuickCategory) {
      const suggestedCategory = this.categorizationEngine.categorize(description);
      const config = CATEGORY_CONFIGS[suggestedCategory];
      
      this.suggestedCategorySpan.textContent = config.name;
      this.suggestedCategorySpan.style.backgroundColor = config.color;
      this.suggestedCategorySpan.style.color = this.getContrastColor(config.color);
      this.categorySuggestion.style.display = 'block';
    } else {
      this.categorySuggestion.style.display = 'none';
    }
  }

  private getContrastColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const description = this.descriptionInput.value.trim();
    if (!description) return;

    const implementationIntention = (this.intentionTimeInput.value || this.intentionLocationInput.value || this.intentionDurationInput.value) ? {
      time: this.intentionTimeInput.value || undefined,
      location: this.intentionLocationInput.value.trim() || undefined,
      duration: this.intentionDurationInput.value ? parseInt(this.intentionDurationInput.value) : undefined
    } : undefined;

    const habitStack = this.stackAfterHabitSelect.value ? {
      afterHabitId: this.stackAfterHabitSelect.value
    } : undefined;

    const input: CreateItemInput = {
      description,
      category: this.selectedQuickCategory || 
                (this.categorySelect.value ? this.categorySelect.value as Category : undefined),
      dueDate: this.dueDateInput.value ? new Date(this.dueDateInput.value) : undefined,
      location: this.locationInput.value.trim() || undefined,
      tags: this.tagsInput.value 
        ? this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
        : undefined,
      effortLevel: this.effortLevelSelect.value as any || undefined,
      priority: this.prioritySelect.value as any || 'normal',
      isHabit: this.isHabitCheckbox.checked,
      implementationIntention,
      habitStack
    };

    try {
      await this.onSubmit(input);
      this.resetForm();
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  }

  private resetForm(): void {
    this.form.reset();
    this.categorySuggestion.style.display = 'none';
    this.selectedQuickCategory = null;
    this.quickCategoryBtns.forEach(b => b.classList.remove('selected'));
    this.descriptionInput.focus();
  }

  public focus(): void {
    this.descriptionInput.focus();
  }
}

export default InputComponent;

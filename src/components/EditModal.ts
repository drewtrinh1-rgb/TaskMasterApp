/**
 * EditModal - Modal for editing items
 */

import { Item, Category, CATEGORY_CONFIGS, UpdateItemInput } from '../models/index';

export interface EditModalOptions {
  onSave: (id: string, updates: UpdateItemInput) => Promise<void>;
}

export class EditModal {
  private modal: HTMLElement;
  private form: HTMLFormElement;
  private itemIdInput: HTMLInputElement;
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
  private stackAfterSelect: HTMLSelectElement;
  private cancelBtn: HTMLButtonElement;
  private options: EditModalOptions;

  constructor(options: EditModalOptions) {
    this.options = options;

    // Get DOM elements
    this.modal = document.getElementById('edit-modal') as HTMLElement;
    this.form = document.getElementById('edit-form') as HTMLFormElement;
    this.itemIdInput = document.getElementById('edit-item-id') as HTMLInputElement;
    this.descriptionInput = document.getElementById('edit-description') as HTMLInputElement;
    this.categorySelect = document.getElementById('edit-category') as HTMLSelectElement;
    this.dueDateInput = document.getElementById('edit-due-date') as HTMLInputElement;
    this.locationInput = document.getElementById('edit-location') as HTMLInputElement;
    this.tagsInput = document.getElementById('edit-tags') as HTMLInputElement;
    this.effortLevelSelect = document.getElementById('edit-effort-level') as HTMLSelectElement;
    this.prioritySelect = document.getElementById('edit-priority') as HTMLSelectElement;
    this.isHabitCheckbox = document.getElementById('edit-is-habit') as HTMLInputElement;
    this.intentionTimeInput = document.getElementById('edit-intention-time') as HTMLInputElement;
    this.intentionLocationInput = document.getElementById('edit-intention-location') as HTMLInputElement;
    this.intentionDurationInput = document.getElementById('edit-intention-duration') as HTMLInputElement;
    this.stackAfterSelect = document.getElementById('edit-stack-after') as HTMLSelectElement;
    this.cancelBtn = document.getElementById('cancel-edit') as HTMLButtonElement;

    this.initialize();
  }

  private initialize(): void {
    // Populate category select
    for (const [category, config] of Object.entries(CATEGORY_CONFIGS)) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = config.name;
      this.categorySelect.appendChild(option);
    }

    // Event listeners
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.cancelBtn.addEventListener('click', this.close.bind(this));
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(item: Item): void {
    this.itemIdInput.value = item.id;
    this.descriptionInput.value = item.description;
    this.categorySelect.value = item.category;
    this.dueDateInput.value = item.dueDate 
      ? new Date(item.dueDate).toISOString().split('T')[0] 
      : '';
    this.locationInput.value = item.location || '';
    this.tagsInput.value = item.tags?.join(', ') || '';
    this.effortLevelSelect.value = item.effortLevel || '';
    this.prioritySelect.value = item.priority || 'normal';
    this.isHabitCheckbox.checked = item.isHabit || false;
    
    // Phase 2 fields
    this.intentionTimeInput.value = item.implementationIntention?.time || '';
    this.intentionLocationInput.value = item.implementationIntention?.location || '';
    this.intentionDurationInput.value = item.implementationIntention?.duration?.toString() || '';
    this.stackAfterSelect.value = item.habitStack?.afterHabitId || '';

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    this.descriptionInput.focus();
  }

  close(): void {
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    this.form.reset();
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const id = this.itemIdInput.value;
    
    const implementationIntention = (this.intentionTimeInput.value || this.intentionLocationInput.value || this.intentionDurationInput.value) ? {
      time: this.intentionTimeInput.value || undefined,
      location: this.intentionLocationInput.value.trim() || undefined,
      duration: this.intentionDurationInput.value ? parseInt(this.intentionDurationInput.value) : undefined
    } : undefined;

    const habitStack = this.stackAfterSelect.value ? {
      afterHabitId: this.stackAfterSelect.value
    } : undefined;
    
    const updates: UpdateItemInput = {
      description: this.descriptionInput.value.trim(),
      category: this.categorySelect.value as Category,
      dueDate: this.dueDateInput.value ? new Date(this.dueDateInput.value) : null,
      location: this.locationInput.value.trim() || null,
      tags: this.tagsInput.value 
        ? this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
        : [],
      effortLevel: this.effortLevelSelect.value as any || undefined,
      priority: this.prioritySelect.value as any || 'normal',
      isHabit: this.isHabitCheckbox.checked,
      implementationIntention,
      habitStack
    };

    try {
      await this.options.onSave(id, updates);
      this.close();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  }
}

export default EditModal;

/**
 * IdentityGoalsComponent - Identity-based goal setting
 */

import { Item } from '../models/index';

interface IdentityGoal {
  id: string;
  identity: string;
  description: string;
  linkedHabits: string[];
  createdAt: Date;
}

interface IdentityGoalsComponentOptions {
  getItems: () => Promise<Item[]>;
  onAddGoal: (goal: Omit<IdentityGoal, 'id' | 'createdAt'>) => void;
  containerId?: string;
}

export class IdentityGoalsComponent {
  private container: HTMLElement;
  private getItems: () => Promise<Item[]>;
  private goals: IdentityGoal[] = [];

  constructor(options: IdentityGoalsComponentOptions) {
    const containerId = options.containerId || 'identity-goals-container';
    this.container = document.getElementById(containerId) as HTMLElement;
    this.getItems = options.getItems;
    this.loadGoals();
  }

  private loadGoals(): void {
    const stored = localStorage.getItem('identity-goals');
    if (stored) {
      this.goals = JSON.parse(stored);
    }
  }

  private saveGoals(): void {
    localStorage.setItem('identity-goals', JSON.stringify(this.goals));
  }

  async refresh(): Promise<void> {
    const items = await this.getItems();
    this.render(items);
  }

  private render(items: Item[]): void {
    const habits = items.filter(i => i.isHabit);

    this.container.innerHTML = `
      <div class="identity-goals-card">
        <div class="identity-header">
          <div class="identity-title">
            <span class="identity-icon">🎯</span>
            <h3>Identity & Goals</h3>
          </div>
          <button class="add-identity-btn" id="add-identity-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Identity
          </button>
        </div>

        <div class="identity-description">
          <p>Define who you want to become. Your habits should align with your identity.</p>
        </div>

        ${this.goals.length > 0 ? `
          <div class="identity-goals-list">
            ${this.goals.map(goal => this.renderGoal(goal, habits)).join('')}
          </div>
        ` : `
          <div class="identity-empty">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" fill="#e3f2fd"/>
              <path d="M50 30v40M30 50h40" stroke="#4169E1" stroke-width="4" stroke-linecap="round"/>
            </svg>
            <h4>Define Your Identity</h4>
            <p>Start by defining who you want to become</p>
            <div class="identity-examples">
              <span class="example-badge">I am a healthy person</span>
              <span class="example-badge">I am a reader</span>
              <span class="example-badge">I am organized</span>
            </div>
          </div>
        `}

        <div class="identity-form" id="identity-form" style="display: none;">
          <h4>Add New Identity</h4>
          <div class="form-group">
            <label>I am a...</label>
            <input type="text" id="identity-input" placeholder="e.g., healthy person, reader, early riser" />
          </div>
          <div class="form-group">
            <label>What does this person do?</label>
            <textarea id="identity-description" placeholder="Describe the habits and behaviors of this identity..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Link Habits (optional)</label>
            <div class="habit-checkboxes">
              ${habits.map(h => `
                <label class="habit-checkbox-label">
                  <input type="checkbox" value="${h.id}" class="habit-link-checkbox" />
                  <span>${h.description}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-secondary" id="cancel-identity-btn">Cancel</button>
            <button class="btn-primary" id="save-identity-btn">Save Identity</button>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderGoal(goal: IdentityGoal, habits: Item[]): string {
    const linkedHabits = habits.filter(h => goal.linkedHabits.includes(h.id));
    const completedToday = linkedHabits.filter(h => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastCompleted = h.habitStreak?.lastCompletedDate ? new Date(h.habitStreak.lastCompletedDate) : null;
      if (lastCompleted) {
        lastCompleted.setHours(0, 0, 0, 0);
        return lastCompleted.getTime() === today.getTime();
      }
      return false;
    }).length;

    const alignmentScore = linkedHabits.length > 0 
      ? Math.round((completedToday / linkedHabits.length) * 100) 
      : 0;

    return `
      <div class="identity-goal-card">
        <div class="identity-goal-header">
          <div class="identity-badge">I am a ${goal.identity}</div>
          <button class="delete-identity-btn" data-id="${goal.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="identity-goal-description">${goal.description}</p>
        
        ${linkedHabits.length > 0 ? `
          <div class="identity-alignment">
            <div class="alignment-header">
              <span class="alignment-label">Identity Alignment</span>
              <span class="alignment-score">${alignmentScore}%</span>
            </div>
            <div class="alignment-bar">
              <div class="alignment-fill" style="width: ${alignmentScore}%; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
            </div>
            <div class="linked-habits">
              ${linkedHabits.map(h => {
                const completed = completedToday > 0 && goal.linkedHabits.includes(h.id);
                return `
                  <span class="linked-habit ${completed ? 'completed' : ''}">
                    ${completed ? '✓' : '○'} ${h.description}
                  </span>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private attachEventListeners(): void {
    const addBtn = document.getElementById('add-identity-btn');
    const cancelBtn = document.getElementById('cancel-identity-btn');
    const saveBtn = document.getElementById('save-identity-btn');
    const form = document.getElementById('identity-form');

    addBtn?.addEventListener('click', () => {
      if (form) form.style.display = 'block';
    });

    cancelBtn?.addEventListener('click', () => {
      if (form) form.style.display = 'none';
      this.clearForm();
    });

    saveBtn?.addEventListener('click', () => {
      this.handleSaveIdentity();
    });

    // Delete buttons
    const deleteBtns = this.container.querySelectorAll('.delete-identity-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) this.handleDeleteIdentity(id);
      });
    });
  }

  private handleSaveIdentity(): void {
    const identityInput = document.getElementById('identity-input') as HTMLInputElement;
    const descriptionInput = document.getElementById('identity-description') as HTMLTextAreaElement;
    const checkboxes = this.container.querySelectorAll('.habit-link-checkbox:checked') as NodeListOf<HTMLInputElement>;

    const identity = identityInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!identity || !description) return;

    const linkedHabits = Array.from(checkboxes).map(cb => cb.value);

    const newGoal: IdentityGoal = {
      id: Date.now().toString(),
      identity,
      description,
      linkedHabits,
      createdAt: new Date()
    };

    this.goals.push(newGoal);
    this.saveGoals();
    this.clearForm();
    this.refresh();
  }

  private handleDeleteIdentity(id: string): void {
    this.goals = this.goals.filter(g => g.id !== id);
    this.saveGoals();
    this.refresh();
  }

  private clearForm(): void {
    const identityInput = document.getElementById('identity-input') as HTMLInputElement;
    const descriptionInput = document.getElementById('identity-description') as HTMLTextAreaElement;
    const checkboxes = this.container.querySelectorAll('.habit-link-checkbox') as NodeListOf<HTMLInputElement>;

    if (identityInput) identityInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    checkboxes.forEach(cb => cb.checked = false);

    const form = document.getElementById('identity-form');
    if (form) form.style.display = 'none';
  }
}

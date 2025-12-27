/**
 * HabitTemplatesComponent - Pre-built habit templates for quick setup
 */

import { Category, CreateItemInput } from '../models/index';

interface HabitTemplate {
  name: string;
  description: string;
  category: Category;
  effortLevel: 'quick' | 'medium' | 'long';
  implementationIntention?: {
    time?: string;
    location?: string;
    duration?: number;
  };
  icon: string;
}

const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    name: 'Morning Meditation',
    description: 'Meditate for 10 minutes',
    category: Category.SELF_CARE,
    effortLevel: 'quick',
    implementationIntention: {
      time: '7:00 AM',
      location: 'Bedroom',
      duration: 10
    },
    icon: '🧘'
  },
  {
    name: 'Daily Exercise',
    description: 'Exercise for 30 minutes',
    category: Category.EXERCISE,
    effortLevel: 'medium',
    implementationIntention: {
      time: '6:00 AM',
      location: 'Gym',
      duration: 30
    },
    icon: '🏃'
  },
  {
    name: 'Read Before Bed',
    description: 'Read for 20 minutes',
    category: Category.KNOWLEDGE_HUB,
    effortLevel: 'quick',
    implementationIntention: {
      time: '9:00 PM',
      location: 'Bedroom',
      duration: 20
    },
    icon: '📚'
  },
  {
    name: 'Drink Water',
    description: 'Drink 8 glasses of water',
    category: Category.SELF_CARE,
    effortLevel: 'quick',
    icon: '💧'
  },
  {
    name: 'Gratitude Journal',
    description: 'Write 3 things I\'m grateful for',
    category: Category.SELF_CARE,
    effortLevel: 'quick',
    implementationIntention: {
      time: '9:00 PM',
      location: 'Desk',
      duration: 5
    },
    icon: '📝'
  },
  {
    name: 'Morning Walk',
    description: 'Take a 15-minute walk',
    category: Category.EXERCISE,
    effortLevel: 'quick',
    implementationIntention: {
      time: '7:30 AM',
      location: 'Neighborhood',
      duration: 15
    },
    icon: '🚶'
  },
  {
    name: 'Healthy Breakfast',
    description: 'Eat a nutritious breakfast',
    category: Category.SELF_CARE,
    effortLevel: 'quick',
    implementationIntention: {
      time: '8:00 AM',
      location: 'Kitchen',
      duration: 15
    },
    icon: '🥗'
  },
  {
    name: 'Deep Work Session',
    description: 'Focus on important work for 90 minutes',
    category: Category.WORK,
    effortLevel: 'long',
    implementationIntention: {
      time: '9:00 AM',
      location: 'Office',
      duration: 90
    },
    icon: '💼'
  },
  {
    name: 'Call a Friend',
    description: 'Connect with a friend or family member',
    category: Category.FRIENDS_SOCIAL,
    effortLevel: 'quick',
    implementationIntention: {
      duration: 10
    },
    icon: '📞'
  },
  {
    name: 'Evening Stretch',
    description: 'Stretch for 10 minutes',
    category: Category.EXERCISE,
    effortLevel: 'quick',
    implementationIntention: {
      time: '8:00 PM',
      location: 'Living Room',
      duration: 10
    },
    icon: '🤸'
  }
];

interface HabitTemplatesComponentOptions {
  onSelectTemplate: (input: CreateItemInput) => Promise<void>;
}

export class HabitTemplatesComponent {
  private container: HTMLElement;
  private onSelectTemplate: (input: CreateItemInput) => Promise<void>;

  constructor(options: HabitTemplatesComponentOptions) {
    this.container = document.getElementById('habit-templates-container') as HTMLElement;
    this.onSelectTemplate = options.onSelectTemplate;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="templates-header">
        <h4>🎯 Habit Templates</h4>
        <p>Quick-start popular habits</p>
      </div>
      <div class="templates-grid">
        ${HABIT_TEMPLATES.map(template => this.renderTemplate(template)).join('')}
      </div>
    `;

    this.attachEventListeners();
  }

  private renderTemplate(template: HabitTemplate): string {
    return `
      <div class="template-card" data-template="${template.name}">
        <div class="template-icon">${template.icon}</div>
        <div class="template-content">
          <div class="template-name">${template.name}</div>
          <div class="template-desc">${template.description}</div>
          ${template.implementationIntention?.time ? `
            <div class="template-time">⏰ ${template.implementationIntention.time}</div>
          ` : ''}
        </div>
        <button class="template-add-btn" data-template="${template.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const addBtns = this.container.querySelectorAll('.template-add-btn');
    addBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const templateName = (e.currentTarget as HTMLElement).getAttribute('data-template');
        const template = HABIT_TEMPLATES.find(t => t.name === templateName);
        if (template) {
          await this.handleTemplateSelect(template);
        }
      });
    });
  }

  private async handleTemplateSelect(template: HabitTemplate): Promise<void> {
    const input: CreateItemInput = {
      description: template.description,
      category: template.category,
      effortLevel: template.effortLevel,
      isHabit: true,
      implementationIntention: template.implementationIntention,
      priority: 'normal'
    };

    await this.onSelectTemplate(input);
  }
}

/**
 * ItemCard - Renders individual item cards
 */

import { Item, CATEGORY_CONFIGS } from '../models/index';
import { FilterManager } from '../services/FilterManager';

export interface ItemCardOptions {
  onComplete: (id: string) => Promise<void>;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => Promise<void>;
}

export class ItemCard {
  private filterManager: FilterManager;
  private options: ItemCardOptions;

  constructor(options: ItemCardOptions) {
    this.options = options;
    this.filterManager = new FilterManager();
  }

  /**
   * Render an item card
   */
  render(item: Item): HTMLElement {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.category = item.category;
    card.dataset.id = item.id;
    card.setAttribute('role', 'listitem');

    // Add type class
    if (item.type === 'note') {
      card.classList.add('note');
    }

    // Add completed class
    if (item.completed) {
      card.classList.add('completed');
    }

    // Add overdue class
    if (this.filterManager.isOverdue(item)) {
      card.classList.add('overdue');
    }

    // Build card content
    card.innerHTML = this.buildCardHTML(item);

    // Attach event listeners
    this.attachEventListeners(card, item);

    return card;
  }

  private buildCardHTML(item: Item): string {
    const config = CATEGORY_CONFIGS[item.category];
    const isOverdue = this.filterManager.isOverdue(item);

    let html = '';

    // Checkbox for tasks
    if (item.type === 'task') {
      html += `
        <input 
          type="checkbox" 
          class="item-checkbox" 
          ${item.completed ? 'checked' : ''}
          aria-label="Mark ${item.completed ? 'incomplete' : 'complete'}"
        >
      `;
    }

    // Content section
    html += `
      <div class="item-content">
        <div class="item-description">${this.escapeHtml(item.description)}</div>
        <div class="item-meta">
          <span class="item-category" style="background-color: ${config.color}; color: ${this.getContrastColor(config.color)}">
            ${config.name}
          </span>
    `;

    // Due date
    if (item.dueDate) {
      const dueDateStr = this.formatDate(item.dueDate);
      html += `<span class="item-due-date">${isOverdue ? '⚠️ ' : '📅 '}${dueDateStr}</span>`;
    }

    // Location
    if (item.location) {
      html += `<span class="item-location">📍 ${this.escapeHtml(item.location)}</span>`;
    }

    html += '</div>';

    // Tags
    if (item.tags && item.tags.length > 0) {
      html += '<div class="item-tags">';
      for (const tag of item.tags) {
        html += `<span class="item-tag">#${this.escapeHtml(tag)}</span>`;
      }
      html += '</div>';
    }

    html += '</div>';

    // Actions
    html += `
      <div class="item-actions">
        <button class="edit-btn" aria-label="Edit item">Edit</button>
        <button class="delete-btn" aria-label="Delete item">Delete</button>
      </div>
    `;

    return html;
  }

  private attachEventListeners(card: HTMLElement, item: Item): void {
    // Checkbox for completion
    const checkbox = card.querySelector('.item-checkbox') as HTMLInputElement;
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        this.options.onComplete(item.id);
      });
    }

    // Edit button
    const editBtn = card.querySelector('.edit-btn') as HTMLButtonElement;
    editBtn.addEventListener('click', () => {
      this.options.onEdit(item);
    });

    // Delete button
    const deleteBtn = card.querySelector('.delete-btn') as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => {
      this.options.onDelete(item.id);
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
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

export default ItemCard;

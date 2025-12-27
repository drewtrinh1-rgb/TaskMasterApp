/**
 * SettingsComponent - App settings and data management
 */

import { DataExportService } from '../services/DataExportService';
import { AuthService } from '../services/AuthService';

interface SettingsComponentOptions {
  onDataChange: () => void;
}

export class SettingsComponent {
  private container: HTMLElement;
  private onDataChange: () => void;

  constructor(options: SettingsComponentOptions) {
    this.container = document.getElementById('settings-container') as HTMLElement;
    this.onDataChange = options.onDataChange;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="settings-view">
        <div class="settings-header">
          <h2>⚙️ Settings & Data Management</h2>
          <p>Manage your data, backups, and app preferences</p>
        </div>

        <div class="settings-sections">
          <!-- Security Section -->
          <div class="settings-section">
            <div class="section-icon">🔒</div>
            <div class="section-content">
              <h3>Security & Access</h3>
              <p>Manage your password and session</p>
              <div class="settings-actions">
                <button class="btn-secondary" id="change-password-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Change Password
                </button>
                <button class="btn-danger" id="logout-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
              <p class="help-text">💡 Your session lasts 7 days. Sign out to require password on next visit.</p>
            </div>
          </div>

          <!-- Data Backup Section -->
          <div class="settings-section">
            <div class="section-icon">💾</div>
            <div class="section-content">
              <h3>Data Backup & Export</h3>
              <p>Download all your tasks, projects, and goals as a JSON file</p>
              <div class="settings-actions">
                <button class="btn-primary" id="export-data-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export All Data
                </button>
              </div>
            </div>
          </div>

          <!-- Data Import Section -->
          <div class="settings-section">
            <div class="section-icon">📥</div>
            <div class="section-content">
              <h3>Import Data</h3>
              <p>Restore from a previous backup file</p>
              <div class="settings-actions">
                <input type="file" id="import-file-input" accept=".json" style="display: none;">
                <button class="btn-secondary" id="import-data-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Import from File
                </button>
              </div>
              <p class="help-text">⚠️ This will replace your current data. Export first to create a backup!</p>
            </div>
          </div>

          <!-- Storage Info Section -->
          <div class="settings-section">
            <div class="section-icon">📊</div>
            <div class="section-content">
              <h3>Storage Information</h3>
              <div id="storage-info" class="storage-info">
                <div class="info-item">
                  <span class="info-label">Tasks & Habits:</span>
                  <span class="info-value" id="items-count">0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Projects:</span>
                  <span class="info-value" id="projects-count">0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Identity Goals:</span>
                  <span class="info-value" id="goals-count">0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Storage Used:</span>
                  <span class="info-value" id="storage-size">0 KB</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="settings-section danger-section">
            <div class="section-icon">⚠️</div>
            <div class="section-content">
              <h3>Danger Zone</h3>
              <p>Permanently delete all data from this device</p>
              <div class="settings-actions">
                <button class="btn-danger" id="clear-all-data-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Clear All Data
                </button>
              </div>
              <p class="help-text">⚠️ This action cannot be undone! Export your data first.</p>
            </div>
          </div>

          <!-- About Section -->
          <div class="settings-section">
            <div class="section-icon">ℹ️</div>
            <div class="section-content">
              <h3>About</h3>
              <div class="about-info">
                <p><strong>Productivity App</strong></p>
                <p>Version 1.0.0</p>
                <p>A comprehensive task management and habit tracking application</p>
                <p class="help-text">Built with TypeScript, Vite, and Chart.js</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.updateStorageInfo();
    this.attachEventListeners();
  }

  private updateStorageInfo(): void {
    const data = DataExportService.exportAllData();
    
    const itemsCount = document.getElementById('items-count');
    const projectsCount = document.getElementById('projects-count');
    const goalsCount = document.getElementById('goals-count');
    const storageSize = document.getElementById('storage-size');

    if (itemsCount) itemsCount.textContent = data.metadata.totalItems.toString();
    if (projectsCount) projectsCount.textContent = data.metadata.totalProjects.toString();
    if (goalsCount) goalsCount.textContent = data.metadata.totalGoals.toString();

    // Calculate approximate storage size
    const dataStr = JSON.stringify(data);
    const sizeKB = (new Blob([dataStr]).size / 1024).toFixed(2);
    if (storageSize) storageSize.textContent = `${sizeKB} KB`;
  }

  private attachEventListeners(): void {
    // Security buttons
    const logoutBtn = document.getElementById('logout-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    
    logoutBtn?.addEventListener('click', () => this.handleLogout());
    changePasswordBtn?.addEventListener('click', () => this.handleChangePassword());

    // Export data
    const exportBtn = document.getElementById('export-data-btn');
    exportBtn?.addEventListener('click', () => this.handleExport());

    // Import data
    const importBtn = document.getElementById('import-data-btn');
    const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
    
    importBtn?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => this.handleImport(e));

    // Clear all data
    const clearBtn = document.getElementById('clear-all-data-btn');
    clearBtn?.addEventListener('click', () => this.handleClearAll());
  }

  private handleExport(): void {
    try {
      const data = DataExportService.exportAllData();
      DataExportService.downloadAsJSON(data);
      this.showToast('✅ Data exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      this.showToast('❌ Failed to export data', 'error');
    }
  }

  private async handleImport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const result = DataExportService.importData(data);
      
      if (result.success) {
        this.showToast(`✅ ${result.message}`, 'success');
        setTimeout(() => {
          this.onDataChange();
          this.updateStorageInfo();
        }, 1000);
      } else {
        this.showToast(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Import failed:', error);
      this.showToast('❌ Invalid backup file', 'error');
    }

    // Reset file input
    input.value = '';
  }

  private handleClearAll(): void {
    DataExportService.clearAllData();
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  }

  private handleLogout(): void {
    if (confirm('Are you sure you want to sign out?')) {
      AuthService.logout();
      // Force hard reload with cache busting
      window.location.href = window.location.origin + window.location.pathname + '?_=' + Date.now();
    }
  }

  private async handleChangePassword(): Promise<void> {
    alert('⚠️ To change credentials, update the hashes in src/services/AuthService.ts\n\nCurrent credentials:\nUsername: drewdrew\nPassword: ChangeMe123!\nPIN: 13031996');
    this.showToast('Check AuthService.ts to update credentials', 'success');
  }
}


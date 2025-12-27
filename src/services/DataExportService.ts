/**
 * DataExportService - Export and import all app data
 */

export interface ExportData {
  version: string;
  exportDate: string;
  items: any[];
  projects: any[];
  identityGoals: any[];
  metadata: {
    totalItems: number;
    totalProjects: number;
    totalGoals: number;
  };
}

export class DataExportService {
  private static readonly VERSION = '1.0.0';

  static exportAllData(): ExportData {
    const items = localStorage.getItem('categorized-todo-items');
    const projects = localStorage.getItem('projects');
    const identityGoals = localStorage.getItem('identity-goals');

    const itemsData = items ? JSON.parse(items) : [];
    const projectsData = projects ? JSON.parse(projects) : [];
    const goalsData = identityGoals ? JSON.parse(identityGoals) : [];

    return {
      version: this.VERSION,
      exportDate: new Date().toISOString(),
      items: itemsData,
      projects: projectsData,
      identityGoals: goalsData,
      metadata: {
        totalItems: itemsData.length,
        totalProjects: projectsData.length,
        totalGoals: goalsData.length
      }
    };
  }

  static downloadAsJSON(data: ExportData, filename?: string): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `productivity-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static importData(data: ExportData): { success: boolean; message: string } {
    try {
      // Validate data structure
      if (!data.version || !data.items || !data.projects || !data.identityGoals) {
        return { success: false, message: 'Invalid backup file format' };
      }

      // Backup current data before import
      const currentBackup = this.exportAllData();
      sessionStorage.setItem('pre-import-backup', JSON.stringify(currentBackup));

      // Import data
      localStorage.setItem('categorized-todo-items', JSON.stringify(data.items));
      localStorage.setItem('projects', JSON.stringify(data.projects));
      localStorage.setItem('identity-goals', JSON.stringify(data.identityGoals));

      return {
        success: true,
        message: `Successfully imported ${data.metadata.totalItems} tasks, ${data.metadata.totalProjects} projects, and ${data.metadata.totalGoals} goals`
      };
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, message: 'Failed to import data. Please check the file format.' };
    }
  }

  static restorePreImportBackup(): boolean {
    try {
      const backup = sessionStorage.getItem('pre-import-backup');
      if (!backup) return false;

      const data = JSON.parse(backup);
      localStorage.setItem('categorized-todo-items', JSON.stringify(data.items));
      localStorage.setItem('projects', JSON.stringify(data.projects));
      localStorage.setItem('identity-goals', JSON.stringify(data.identityGoals));
      
      sessionStorage.removeItem('pre-import-backup');
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }

  static clearAllData(): void {
    if (confirm('⚠️ This will delete ALL your data. Are you sure? This cannot be undone!')) {
      if (confirm('Really delete everything? Last chance to cancel!')) {
        localStorage.removeItem('categorized-todo-items');
        localStorage.removeItem('projects');
        localStorage.removeItem('identity-goals');
        window.location.reload();
      }
    }
  }
}

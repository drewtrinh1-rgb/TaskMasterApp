/**
 * ProjectsComponent - Long-term projects and applications tracker
 */

import { Project, ProjectStatus } from '../models/Project';
import { ProjectManager } from '../services/ProjectManager';
import { ProjectParser } from '../utils/projectParser';

interface ProjectsComponentOptions {
  projectManager: ProjectManager;
  onRefresh: () => void;
}

export class ProjectsComponent {
  private container: HTMLElement;
  private projectManager: ProjectManager;
  private selectedProject: Project | null = null;
  private showArchived: boolean = false;

  constructor(options: ProjectsComponentOptions) {
    this.container = document.getElementById('projects-container') as HTMLElement;
    this.projectManager = options.projectManager;
  }

  render(): void {
    const projects = this.showArchived 
      ? this.projectManager.getArchivedProjects() 
      : this.projectManager.getActiveProjects();
    
    this.container.innerHTML = `
      <div class="projects-view">
        <div class="projects-header">
          <div class="projects-title">
            <h2>📋 Long-Term Projects & Applications</h2>
            <p>Track fellowships, scholarships, and speaking opportunities</p>
          </div>
          <div class="projects-header-actions">
            <button class="btn-secondary" id="toggle-archived-btn">
              ${this.showArchived ? '📂 View Active' : '📦 View Archived'}
            </button>
            <button class="btn-primary" id="add-project-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Project
            </button>
          </div>
        </div>

        ${!this.showArchived ? this.renderTimeline(projects) : ''}
        
        <div class="projects-grid">
          ${projects.length > 0 ? projects.map(p => this.renderProjectCard(p)).join('') : this.renderEmptyState()}
        </div>

        ${this.selectedProject ? this.renderProjectDetail(this.selectedProject) : ''}
      </div>

      <!-- Add Project Modal -->
      <div class="project-modal" id="add-project-modal" style="display: none;">
        <div class="project-modal-content">
          <div class="project-modal-header">
            <h2>Add New Project</h2>
            <button class="close-modal-btn" id="close-add-modal-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="project-modal-body">
            <div class="smart-paste-section">
              <label>📋 Smart Paste</label>
              <p class="help-text">Paste project details and we'll automatically extract the information</p>
              <textarea id="smart-paste-input" placeholder="Paste project details here (title, description, dates, URL, etc.)..." rows="6"></textarea>
              <button class="btn-secondary" id="parse-btn">🔍 Parse Information</button>
            </div>

            <div class="form-divider">
              <span>OR ENTER MANUALLY</span>
            </div>

            <form id="add-project-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="project-title">Title *</label>
                  <input type="text" id="project-title" required placeholder="e.g., Churchill Fellowship">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-description">Description *</label>
                  <textarea id="project-description" required rows="3" placeholder="Brief description of the project..."></textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-category">Category *</label>
                  <select id="project-category" required>
                    <option value="fellowship">Fellowship</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="speaking">Speaking</option>
                    <option value="leadership">Leadership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="project-priority">Priority</label>
                  <select id="project-priority">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div class="form-section-title">📅 Timeline</div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-open-date">Applications Open</label>
                  <input type="date" id="project-open-date">
                </div>
                <div class="form-group">
                  <label for="project-deadline">Application Deadline</label>
                  <input type="date" id="project-deadline">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-notification">Notification Date</label>
                  <input type="date" id="project-notification">
                </div>
                <div class="form-group">
                  <label for="project-url">Website URL</label>
                  <input type="url" id="project-url" placeholder="https://...">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="project-start">Program Start</label>
                  <input type="date" id="project-start">
                </div>
                <div class="form-group">
                  <label for="project-end">Program End</label>
                  <input type="date" id="project-end">
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" id="cancel-add-btn">Cancel</button>
                <button type="submit" class="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Project Modal -->
      <div class="project-modal" id="edit-project-modal" style="display: none;">
        <div class="project-modal-content">
          <div class="project-modal-header">
            <h2>Edit Project</h2>
            <button class="close-modal-btn" id="close-edit-modal-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="project-modal-body">
            <form id="edit-project-form">
              <input type="hidden" id="edit-project-id">
              
              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-title">Title *</label>
                  <input type="text" id="edit-project-title" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-description">Description *</label>
                  <textarea id="edit-project-description" required rows="3"></textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-status">Status</label>
                  <select id="edit-project-status">
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="edit-project-progress">Progress (0-100)</label>
                  <input type="number" id="edit-project-progress" min="0" max="100">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-category">Category *</label>
                  <select id="edit-project-category" required>
                    <option value="fellowship">Fellowship</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="speaking">Speaking</option>
                    <option value="leadership">Leadership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="edit-project-priority">Priority</label>
                  <select id="edit-project-priority">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div class="form-section-title">📅 Timeline</div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-open-date">Applications Open</label>
                  <input type="date" id="edit-project-open-date">
                </div>
                <div class="form-group">
                  <label for="edit-project-deadline">Application Deadline</label>
                  <input type="date" id="edit-project-deadline">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-notification">Notification Date</label>
                  <input type="date" id="edit-project-notification">
                </div>
                <div class="form-group">
                  <label for="edit-project-url">Website URL</label>
                  <input type="url" id="edit-project-url" placeholder="https://...">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="edit-project-start">Program Start</label>
                  <input type="date" id="edit-project-start">
                </div>
                <div class="form-group">
                  <label for="edit-project-end">Program End</label>
                  <input type="date" id="edit-project-end">
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" id="cancel-edit-btn">Cancel</button>
                <button type="submit" class="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderTimeline(projects: Project[]): string {
    const now = new Date();
    const sixMonthsAhead = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    
    // Get all timeline events
    const events: Array<{date: Date, project: Project, type: string, label: string}> = [];
    
    projects.forEach(project => {
      if (project.applicationOpenDate && project.applicationOpenDate >= now && project.applicationOpenDate <= sixMonthsAhead) {
        events.push({ date: project.applicationOpenDate, project, type: 'open', label: 'Opens' });
      }
      if (project.applicationDeadline && project.applicationDeadline >= now && project.applicationDeadline <= sixMonthsAhead) {
        events.push({ date: project.applicationDeadline, project, type: 'deadline', label: 'Deadline' });
      }
      if (project.notificationDate && project.notificationDate >= now && project.notificationDate <= sixMonthsAhead) {
        events.push({ date: project.notificationDate, project, type: 'notification', label: 'Notification' });
      }
      if (project.programStartDate && project.programStartDate >= now && project.programStartDate <= sixMonthsAhead) {
        events.push({ date: project.programStartDate, project, type: 'start', label: 'Starts' });
      }
    });

    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    if (events.length === 0) {
      return `
        <div class="timeline-section">
          <h3>📅 Upcoming Timeline</h3>
          <div class="timeline-empty">
            <p>No upcoming deadlines in the next 6 months</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="timeline-section">
        <h3>📅 Upcoming Timeline (Next 6 Months)</h3>
        <div class="timeline-container">
          ${events.map(event => this.renderTimelineEvent(event)).join('')}
        </div>
      </div>
    `;
  }

  private renderTimelineEvent(event: {date: Date, project: Project, type: string, label: string}): string {
    const daysUntil = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    const typeColors: Record<string, string> = {
      open: '#4169E1',
      deadline: '#DC143C',
      notification: '#FFA500',
      start: '#32CD32'
    };

    return `
      <div class="timeline-event" data-type="${event.type}">
        <div class="timeline-date" style="border-color: ${typeColors[event.type]}">
          <div class="timeline-day">${event.date.getDate()}</div>
          <div class="timeline-month">${event.date.toLocaleDateString('en-US', { month: 'short' })}</div>
        </div>
        <div class="timeline-content">
          <div class="timeline-project-name">${event.project.title}</div>
          <div class="timeline-event-type" style="color: ${typeColors[event.type]}">${event.label}</div>
          <div class="timeline-countdown">${daysUntil} days away</div>
        </div>
      </div>
    `;
  }

  private renderProjectCard(project: Project): string {
    const statusColors: Record<ProjectStatus, string> = {
      'planning': '#9370DB',
      'in-progress': '#4169E1',
      'submitted': '#FFA500',
      'completed': '#32CD32',
      'rejected': '#DC143C',
      'accepted': '#32CD32'
    };

    const categoryIcons: Record<string, string> = {
      fellowship: '🎓',
      scholarship: '📚',
      speaking: '🎤',
      leadership: '👥',
      other: '📋'
    };

    const deadline = project.applicationDeadline;
    const daysUntilDeadline = deadline ? Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
    const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 14 && daysUntilDeadline >= 0;

    return `
      <div class="project-card ${isUrgent ? 'urgent' : ''}" data-id="${project.id}">
        <div class="project-card-header">
          <div class="project-icon">${categoryIcons[project.category]}</div>
          <div class="project-status" style="background: ${statusColors[project.status]}">
            ${project.status.replace('-', ' ')}
          </div>
        </div>
        
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        
        <div class="project-progress">
          <div class="progress-header">
            <span>Progress</span>
            <span class="progress-value">${project.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%; background: ${statusColors[project.status]}"></div>
          </div>
        </div>

        ${deadline ? `
          <div class="project-deadline ${isUrgent ? 'urgent' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Deadline: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            ${daysUntilDeadline !== null && daysUntilDeadline >= 0 ? `<span class="days-left">(${daysUntilDeadline}d)</span>` : ''}
          </div>
        ` : ''}

        <div class="project-meta">
          <span class="project-notes-count">📝 ${project.notes.length} notes</span>
          <span class="project-milestones-count">✓ ${project.milestones.filter(m => m.completed).length}/${project.milestones.length} milestones</span>
        </div>

        <div class="project-actions">
          <button class="btn-view" data-id="${project.id}">View Details</button>
          <button class="btn-edit" data-id="${project.id}">Edit</button>
          ${project.archived 
            ? `<button class="btn-unarchive" data-id="${project.id}">Unarchive</button>`
            : `<button class="btn-archive" data-id="${project.id}">Archive</button>`
          }
          <button class="btn-delete" data-id="${project.id}">Delete</button>
        </div>
      </div>
    `;
  }

  private renderProjectDetail(project: Project): string {
    return `
      <div class="project-detail-modal" id="project-detail-modal">
        <div class="project-detail-content">
          <div class="project-detail-header">
            <h2>${project.title}</h2>
            <button class="close-detail-btn" id="close-detail-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="project-detail-body">
            <div class="detail-section">
              <h3>📋 Overview</h3>
              <p>${project.description}</p>
              ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">🔗 Visit Website</a>` : ''}
            </div>

            <div class="detail-section">
              <h3>📅 Timeline</h3>
              <div class="timeline-dates">
                ${project.applicationOpenDate ? `<div class="date-item"><strong>Opens:</strong> ${project.applicationOpenDate.toLocaleDateString()}</div>` : ''}
                ${project.applicationDeadline ? `<div class="date-item"><strong>Deadline:</strong> ${project.applicationDeadline.toLocaleDateString()}</div>` : ''}
                ${project.notificationDate ? `<div class="date-item"><strong>Notification:</strong> ${project.notificationDate.toLocaleDateString()}</div>` : ''}
                ${project.programStartDate ? `<div class="date-item"><strong>Program Starts:</strong> ${project.programStartDate.toLocaleDateString()}</div>` : ''}
                ${project.programEndDate ? `<div class="date-item"><strong>Program Ends:</strong> ${project.programEndDate.toLocaleDateString()}</div>` : ''}
              </div>
            </div>

            <div class="detail-section">
              <div class="section-header-with-action">
                <h3>✓ Milestones</h3>
                <button class="btn-small" id="add-milestone-btn">+ Add</button>
              </div>
              <div class="milestones-list">
                ${project.milestones.length > 0 ? project.milestones.map(m => `
                  <div class="milestone-item ${m.completed ? 'completed' : ''}">
                    <input type="checkbox" ${m.completed ? 'checked' : ''} data-milestone-id="${m.id}" class="milestone-checkbox">
                    <div class="milestone-content">
                      <span class="milestone-title">${m.title}</span>
                      <span class="milestone-date">${m.date.toLocaleDateString()}</span>
                    </div>
                    <button class="btn-icon-delete" data-milestone-id="${m.id}">×</button>
                  </div>
                `).join('') : '<p class="empty-message">No milestones yet</p>'}
              </div>
            </div>

            <div class="detail-section">
              <div class="section-header-with-action">
                <h3>📝 Notes</h3>
                <button class="btn-small" id="add-note-btn">+ Add</button>
              </div>
              <div class="notes-list">
                ${project.notes.length > 0 ? project.notes.map(n => `
                  <div class="note-item">
                    <div class="note-content">${n.content}</div>
                    <div class="note-meta">
                      <span>${n.createdAt.toLocaleDateString()}</span>
                      <button class="btn-icon-delete" data-note-id="${n.id}">×</button>
                    </div>
                  </div>
                `).join('') : '<p class="empty-message">No notes yet</p>'}
              </div>
            </div>

            <div class="detail-section">
              <div class="section-header-with-action">
                <h3>❓ Application Questions</h3>
                <button class="btn-small" id="add-question-btn">+ Add</button>
              </div>
              <div class="questions-list">
                ${project.questions.length > 0 ? project.questions.map((q, i) => `
                  <div class="question-item">
                    <span class="question-number">${i + 1}.</span>
                    <span class="question-text">${q}</span>
                    <button class="btn-icon-delete" data-question-index="${i}">×</button>
                  </div>
                `).join('') : '<p class="empty-message">No questions yet</p>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderEmptyState(): string {
    return `
      <div class="projects-empty">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" fill="#f0f0f0"/>
          <path d="M40 50h40M40 60h30M40 70h35" stroke="#ddd" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <h3>${this.showArchived ? 'No Archived Projects' : 'No Projects Yet'}</h3>
        <p>${this.showArchived ? 'Archived projects will appear here' : 'Start tracking your fellowships, scholarships, and applications'}</p>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Toggle archived button
    const toggleArchivedBtn = document.getElementById('toggle-archived-btn');
    toggleArchivedBtn?.addEventListener('click', () => {
      this.showArchived = !this.showArchived;
      this.render();
    });

    // Add project button
    const addBtn = document.getElementById('add-project-btn');
    addBtn?.addEventListener('click', () => this.showAddProjectModal());

    // Close add modal
    const closeAddModalBtn = document.getElementById('close-add-modal-btn');
    closeAddModalBtn?.addEventListener('click', () => this.hideAddProjectModal());

    const cancelAddBtn = document.getElementById('cancel-add-btn');
    cancelAddBtn?.addEventListener('click', () => this.hideAddProjectModal());

    // Parse button
    const parseBtn = document.getElementById('parse-btn');
    parseBtn?.addEventListener('click', () => this.handleSmartParse());

    // Add project form
    const addForm = document.getElementById('add-project-form');
    addForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddProject();
    });

    // Close edit modal
    const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
    closeEditModalBtn?.addEventListener('click', () => this.hideEditProjectModal());

    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    cancelEditBtn?.addEventListener('click', () => this.hideEditProjectModal());

    // Edit project form
    const editForm = document.getElementById('edit-project-form');
    editForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleEditProject();
    });

    // View details buttons
    const viewBtns = this.container.querySelectorAll('.btn-view');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) this.showProjectDetail(id);
      });
    });

    // Edit buttons
    const editBtns = this.container.querySelectorAll('.btn-edit');
    editBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) this.showEditProjectModal(id);
      });
    });

    // Delete buttons
    const deleteBtns = this.container.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id && confirm('Delete this project?')) {
          this.projectManager.deleteProject(id);
          this.render();
        }
      });
    });

    // Archive buttons
    const archiveBtns = this.container.querySelectorAll('.btn-archive');
    archiveBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) {
          this.projectManager.archiveProject(id);
          this.render();
        }
      });
    });

    // Unarchive buttons
    const unarchiveBtns = this.container.querySelectorAll('.btn-unarchive');
    unarchiveBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) {
          this.projectManager.unarchiveProject(id);
          this.render();
        }
      });
    });

    // Close detail modal
    const closeBtn = document.getElementById('close-detail-btn');
    closeBtn?.addEventListener('click', () => {
      this.selectedProject = null;
      this.render();
    });

    // Milestone checkboxes
    const milestoneCheckboxes = this.container.querySelectorAll('.milestone-checkbox');
    milestoneCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const milestoneId = (e.target as HTMLElement).getAttribute('data-milestone-id');
        if (milestoneId && this.selectedProject) {
          this.projectManager.toggleMilestone(this.selectedProject.id, milestoneId);
          this.selectedProject = this.projectManager.getProject(this.selectedProject.id) || null;
          this.render();
        }
      });
    });

    // Add milestone button
    const addMilestoneBtn = document.getElementById('add-milestone-btn');
    addMilestoneBtn?.addEventListener('click', () => this.showAddMilestoneForm());

    // Add note button
    const addNoteBtn = document.getElementById('add-note-btn');
    addNoteBtn?.addEventListener('click', () => this.showAddNoteForm());

    // Add question button
    const addQuestionBtn = document.getElementById('add-question-btn');
    addQuestionBtn?.addEventListener('click', () => this.showAddQuestionForm());

    // Delete milestone buttons
    const deleteMilestoneBtns = this.container.querySelectorAll('[data-milestone-id].btn-icon-delete');
    deleteMilestoneBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const milestoneId = (e.target as HTMLElement).getAttribute('data-milestone-id');
        if (milestoneId && this.selectedProject) {
          this.projectManager.deleteMilestone(this.selectedProject.id, milestoneId);
          this.selectedProject = this.projectManager.getProject(this.selectedProject.id) || null;
          this.render();
        }
      });
    });

    // Delete note buttons
    const deleteNoteBtns = this.container.querySelectorAll('[data-note-id].btn-icon-delete');
    deleteNoteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const noteId = (e.target as HTMLElement).getAttribute('data-note-id');
        if (noteId && this.selectedProject) {
          this.projectManager.deleteNote(this.selectedProject.id, noteId);
          this.selectedProject = this.projectManager.getProject(this.selectedProject.id) || null;
          this.render();
        }
      });
    });

    // Delete question buttons
    const deleteQuestionBtns = this.container.querySelectorAll('[data-question-index].btn-icon-delete');
    deleteQuestionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt((e.target as HTMLElement).getAttribute('data-question-index') || '');
        if (!isNaN(index) && this.selectedProject) {
          this.projectManager.deleteQuestion(this.selectedProject.id, index);
          this.selectedProject = this.projectManager.getProject(this.selectedProject.id) || null;
          this.render();
        }
      });
    });
  }

  private showAddProjectModal(): void {
    const modal = document.getElementById('add-project-modal');
    if (modal) modal.style.display = 'flex';
  }

  private hideAddProjectModal(): void {
    const modal = document.getElementById('add-project-modal');
    if (modal) modal.style.display = 'none';
    this.clearAddForm();
  }

  private clearAddForm(): void {
    const form = document.getElementById('add-project-form') as HTMLFormElement;
    if (form) form.reset();
    
    const smartPaste = document.getElementById('smart-paste-input') as HTMLTextAreaElement;
    if (smartPaste) smartPaste.value = '';
  }

  private handleSmartParse(): void {
    const smartPaste = document.getElementById('smart-paste-input') as HTMLTextAreaElement;
    if (!smartPaste || !smartPaste.value.trim()) return;

    const parsed = ProjectParser.parseProjectText(smartPaste.value);

    // Fill form fields with parsed data
    if (parsed.title) {
      const titleInput = document.getElementById('project-title') as HTMLInputElement;
      if (titleInput) titleInput.value = parsed.title;
    }

    if (parsed.description) {
      const descInput = document.getElementById('project-description') as HTMLTextAreaElement;
      if (descInput) descInput.value = parsed.description;
    }

    if (parsed.category) {
      const categorySelect = document.getElementById('project-category') as HTMLSelectElement;
      if (categorySelect) categorySelect.value = parsed.category;
    }

    if (parsed.priority) {
      const prioritySelect = document.getElementById('project-priority') as HTMLSelectElement;
      if (prioritySelect) prioritySelect.value = parsed.priority;
    }

    if (parsed.applicationOpenDate) {
      const openInput = document.getElementById('project-open-date') as HTMLInputElement;
      if (openInput) openInput.value = this.formatDateForInput(parsed.applicationOpenDate);
    }

    if (parsed.applicationDeadline) {
      const deadlineInput = document.getElementById('project-deadline') as HTMLInputElement;
      if (deadlineInput) deadlineInput.value = this.formatDateForInput(parsed.applicationDeadline);
    }

    if (parsed.notificationDate) {
      const notifInput = document.getElementById('project-notification') as HTMLInputElement;
      if (notifInput) notifInput.value = this.formatDateForInput(parsed.notificationDate);
    }

    if (parsed.programStartDate) {
      const startInput = document.getElementById('project-start') as HTMLInputElement;
      if (startInput) startInput.value = this.formatDateForInput(parsed.programStartDate);
    }

    if (parsed.programEndDate) {
      const endInput = document.getElementById('project-end') as HTMLInputElement;
      if (endInput) endInput.value = this.formatDateForInput(parsed.programEndDate);
    }

    if (parsed.url) {
      const urlInput = document.getElementById('project-url') as HTMLInputElement;
      if (urlInput) urlInput.value = parsed.url;
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private handleAddProject(): void {
    const titleInput = document.getElementById('project-title') as HTMLInputElement;
    const descInput = document.getElementById('project-description') as HTMLTextAreaElement;
    const categorySelect = document.getElementById('project-category') as HTMLSelectElement;
    const prioritySelect = document.getElementById('project-priority') as HTMLSelectElement;
    const openInput = document.getElementById('project-open-date') as HTMLInputElement;
    const deadlineInput = document.getElementById('project-deadline') as HTMLInputElement;
    const notifInput = document.getElementById('project-notification') as HTMLInputElement;
    const startInput = document.getElementById('project-start') as HTMLInputElement;
    const endInput = document.getElementById('project-end') as HTMLInputElement;
    const urlInput = document.getElementById('project-url') as HTMLInputElement;

    if (!titleInput.value.trim() || !descInput.value.trim()) {
      alert('Please fill in title and description');
      return;
    }

    this.projectManager.createProject({
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      category: categorySelect.value as any,
      priority: prioritySelect.value as any,
      applicationOpenDate: openInput.value ? new Date(openInput.value) : undefined,
      applicationDeadline: deadlineInput.value ? new Date(deadlineInput.value) : undefined,
      notificationDate: notifInput.value ? new Date(notifInput.value) : undefined,
      programStartDate: startInput.value ? new Date(startInput.value) : undefined,
      programEndDate: endInput.value ? new Date(endInput.value) : undefined,
      url: urlInput.value.trim() || undefined
    });

    this.hideAddProjectModal();
    this.render();
  }

  private showProjectDetail(id: string): void {
    this.selectedProject = this.projectManager.getProject(id) || null;
    this.render();
  }

  private showEditProjectModal(id: string): void {
    const project = this.projectManager.getProject(id);
    if (!project) return;

    // Fill form with project data
    const idInput = document.getElementById('edit-project-id') as HTMLInputElement;
    const titleInput = document.getElementById('edit-project-title') as HTMLInputElement;
    const descInput = document.getElementById('edit-project-description') as HTMLTextAreaElement;
    const statusSelect = document.getElementById('edit-project-status') as HTMLSelectElement;
    const progressInput = document.getElementById('edit-project-progress') as HTMLInputElement;
    const categorySelect = document.getElementById('edit-project-category') as HTMLSelectElement;
    const prioritySelect = document.getElementById('edit-project-priority') as HTMLSelectElement;
    const openInput = document.getElementById('edit-project-open-date') as HTMLInputElement;
    const deadlineInput = document.getElementById('edit-project-deadline') as HTMLInputElement;
    const notifInput = document.getElementById('edit-project-notification') as HTMLInputElement;
    const startInput = document.getElementById('edit-project-start') as HTMLInputElement;
    const endInput = document.getElementById('edit-project-end') as HTMLInputElement;
    const urlInput = document.getElementById('edit-project-url') as HTMLInputElement;

    if (idInput) idInput.value = project.id;
    if (titleInput) titleInput.value = project.title;
    if (descInput) descInput.value = project.description;
    if (statusSelect) statusSelect.value = project.status;
    if (progressInput) progressInput.value = project.progress.toString();
    if (categorySelect) categorySelect.value = project.category;
    if (prioritySelect) prioritySelect.value = project.priority;
    if (openInput && project.applicationOpenDate) openInput.value = this.formatDateForInput(project.applicationOpenDate);
    if (deadlineInput && project.applicationDeadline) deadlineInput.value = this.formatDateForInput(project.applicationDeadline);
    if (notifInput && project.notificationDate) notifInput.value = this.formatDateForInput(project.notificationDate);
    if (startInput && project.programStartDate) startInput.value = this.formatDateForInput(project.programStartDate);
    if (endInput && project.programEndDate) endInput.value = this.formatDateForInput(project.programEndDate);
    if (urlInput && project.url) urlInput.value = project.url;

    const modal = document.getElementById('edit-project-modal');
    if (modal) modal.style.display = 'flex';
  }

  private hideEditProjectModal(): void {
    const modal = document.getElementById('edit-project-modal');
    if (modal) modal.style.display = 'none';
  }

  private handleEditProject(): void {
    const idInput = document.getElementById('edit-project-id') as HTMLInputElement;
    const titleInput = document.getElementById('edit-project-title') as HTMLInputElement;
    const descInput = document.getElementById('edit-project-description') as HTMLTextAreaElement;
    const statusSelect = document.getElementById('edit-project-status') as HTMLSelectElement;
    const progressInput = document.getElementById('edit-project-progress') as HTMLInputElement;
    const categorySelect = document.getElementById('edit-project-category') as HTMLSelectElement;
    const prioritySelect = document.getElementById('edit-project-priority') as HTMLSelectElement;
    const openInput = document.getElementById('edit-project-open-date') as HTMLInputElement;
    const deadlineInput = document.getElementById('edit-project-deadline') as HTMLInputElement;
    const notifInput = document.getElementById('edit-project-notification') as HTMLInputElement;
    const startInput = document.getElementById('edit-project-start') as HTMLInputElement;
    const endInput = document.getElementById('edit-project-end') as HTMLInputElement;
    const urlInput = document.getElementById('edit-project-url') as HTMLInputElement;

    if (!idInput || !titleInput.value.trim() || !descInput.value.trim()) {
      alert('Please fill in title and description');
      return;
    }

    this.projectManager.updateProject(idInput.value, {
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      status: statusSelect.value as any,
      progress: parseInt(progressInput.value) || 0,
      category: categorySelect.value as any,
      priority: prioritySelect.value as any,
      applicationOpenDate: openInput.value ? new Date(openInput.value) : undefined,
      applicationDeadline: deadlineInput.value ? new Date(deadlineInput.value) : undefined,
      notificationDate: notifInput.value ? new Date(notifInput.value) : undefined,
      programStartDate: startInput.value ? new Date(startInput.value) : undefined,
      programEndDate: endInput.value ? new Date(endInput.value) : undefined,
      url: urlInput.value.trim() || undefined
    });

    this.hideEditProjectModal();
    this.render();
  }

  private showAddMilestoneForm(): void {
    if (!this.selectedProject) return;

    const title = prompt('Milestone title:');
    if (!title) return;

    const dateStr = prompt('Date (YYYY-MM-DD):');
    if (!dateStr) return;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      alert('Invalid date');
      return;
    }

    this.projectManager.addMilestone(this.selectedProject.id, title, date);
    this.selectedProject = this.projectManager.getProject(this.selectedProject.id) || null;
    this.render();
  }

  private showAddNoteForm(): void {
    if (!this.selectedProject) return;

    const content = prompt('Note content:');
    if (!content) return;

    this.projectManager.addNote(this.selectedProject.id, content);
    this.selectedProject = this.projectManager.getProject(this.selectedProject.id) || null;
    this.render();
  }

  private showAddQuestionForm(): void {
    if (!this.selectedProject) return;

    const question = prompt('Application question:');
    if (!question) return;

    this.projectManager.addQuestion(this.selectedProject.id, question);
    this.selectedProject = this.projectManager.getProject(this.selectedProject.id) || null;
    this.render();
  }
}

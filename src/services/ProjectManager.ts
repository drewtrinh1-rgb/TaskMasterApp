/**
 * ProjectManager - Manages long-term projects and applications
 */

import { Project, CreateProjectInput, UpdateProjectInput, ProjectMilestone, ProjectNote } from '../models/Project';

export class ProjectManager {
  private projects: Project[] = [];
  private readonly STORAGE_KEY = 'projects';

  constructor() {
    this.loadProjects();
  }

  private loadProjects(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.projects = parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          applicationOpenDate: p.applicationOpenDate ? new Date(p.applicationOpenDate) : undefined,
          applicationDeadline: p.applicationDeadline ? new Date(p.applicationDeadline) : undefined,
          notificationDate: p.notificationDate ? new Date(p.notificationDate) : undefined,
          programStartDate: p.programStartDate ? new Date(p.programStartDate) : undefined,
          programEndDate: p.programEndDate ? new Date(p.programEndDate) : undefined,
          milestones: p.milestones.map((m: any) => ({
            ...m,
            date: new Date(m.date)
          })),
          notes: p.notes.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt)
          }))
        }));
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  private saveProjects(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
    } catch (error) {
      console.error('Failed to save projects:', error);
    }
  }

  getAllProjects(): Project[] {
    return [...this.projects];
  }

  getActiveProjects(): Project[] {
    return this.projects.filter(p => !p.archived);
  }

  getArchivedProjects(): Project[] {
    return this.projects.filter(p => p.archived);
  }

  getProject(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  createProject(input: CreateProjectInput): Project {
    const project: Project = {
      id: Date.now().toString(),
      title: input.title,
      description: input.description,
      status: 'planning',
      category: input.category,
      applicationOpenDate: input.applicationOpenDate,
      applicationDeadline: input.applicationDeadline,
      notificationDate: input.notificationDate,
      programStartDate: input.programStartDate,
      programEndDate: input.programEndDate,
      progress: 0,
      milestones: [],
      notes: [],
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      url: input.url,
      priority: input.priority || 'medium'
    };

    this.projects.push(project);
    this.saveProjects();
    return project;
  }

  updateProject(id: string, updates: UpdateProjectInput): Project | undefined {
    const project = this.projects.find(p => p.id === id);
    if (!project) return undefined;

    Object.assign(project, updates, { updatedAt: new Date() });
    this.saveProjects();
    return project;
  }

  deleteProject(id: string): boolean {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    this.saveProjects();
    return true;
  }

  addMilestone(projectId: string, title: string, date: Date): ProjectMilestone | undefined {
    const project = this.getProject(projectId);
    if (!project) return undefined;

    const milestone: ProjectMilestone = {
      id: Date.now().toString(),
      title,
      date,
      completed: false
    };

    project.milestones.push(milestone);
    project.updatedAt = new Date();
    this.saveProjects();
    return milestone;
  }

  toggleMilestone(projectId: string, milestoneId: string): boolean {
    const project = this.getProject(projectId);
    if (!project) return false;

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) return false;

    milestone.completed = !milestone.completed;
    project.updatedAt = new Date();
    this.saveProjects();
    return true;
  }

  deleteMilestone(projectId: string, milestoneId: string): boolean {
    const project = this.getProject(projectId);
    if (!project) return false;

    const index = project.milestones.findIndex(m => m.id === milestoneId);
    if (index === -1) return false;

    project.milestones.splice(index, 1);
    project.updatedAt = new Date();
    this.saveProjects();
    return true;
  }

  addNote(projectId: string, content: string, tags?: string[]): ProjectNote | undefined {
    const project = this.getProject(projectId);
    if (!project) return undefined;

    const note: ProjectNote = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      tags
    };

    project.notes.push(note);
    project.updatedAt = new Date();
    this.saveProjects();
    return note;
  }

  deleteNote(projectId: string, noteId: string): boolean {
    const project = this.getProject(projectId);
    if (!project) return false;

    const index = project.notes.findIndex(n => n.id === noteId);
    if (index === -1) return false;

    project.notes.splice(index, 1);
    project.updatedAt = new Date();
    this.saveProjects();
    return true;
  }

  addQuestion(projectId: string, question: string): boolean {
    const project = this.getProject(projectId);
    if (!project) return false;

    project.questions.push(question);
    project.updatedAt = new Date();
    this.saveProjects();
    return true;
  }

  deleteQuestion(projectId: string, index: number): boolean {
    const project = this.getProject(projectId);
    if (!project) return false;

    if (index < 0 || index >= project.questions.length) return false;

    project.questions.splice(index, 1);
    project.updatedAt = new Date();
    this.saveProjects();
    return true;
  }

  archiveProject(id: string): boolean {
    const project = this.getProject(id);
    if (!project) return false;

    project.archived = true;
    project.updatedAt = new Date();
    this.saveProjects();
    return true;
  }

  unarchiveProject(id: string): boolean {
    const project = this.getProject(id);
    if (!project) return false;

    project.archived = false;
    project.updatedAt = new Date();
    this.saveProjects();
    return true;
  }
}

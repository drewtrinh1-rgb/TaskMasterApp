/**
 * Seed data for initial projects
 */

import { ProjectManager } from '../services/ProjectManager';

export function seedProjects(projectManager: ProjectManager): void {
  // Check if projects already exist
  if (projectManager.getAllProjects().length > 0) {
    return; // Don't seed if projects already exist
  }

  // Churchill Fellowship
  projectManager.createProject({
    title: 'Churchill Fellowship',
    description: 'Application for Churchill Fellowship to research and travel internationally. Requires detailed project proposal and community impact statement.',
    category: 'fellowship',
    applicationOpenDate: new Date('2025-02-01'),
    applicationDeadline: new Date('2025-03-31'),
    notificationDate: new Date('2025-06-15'),
    programStartDate: new Date('2025-09-01'),
    programEndDate: new Date('2026-03-01'),
    priority: 'high'
  });

  // Atlantic Council Millennium Fellowship
  projectManager.createProject({
    title: 'Atlantic Council Millennium Fellowship',
    description: 'Leadership program focused on global challenges and social innovation. Campus-based fellowship with international network.',
    category: 'fellowship',
    applicationOpenDate: new Date('2025-01-15'),
    applicationDeadline: new Date('2025-02-28'),
    notificationDate: new Date('2025-04-01'),
    programStartDate: new Date('2025-08-01'),
    programEndDate: new Date('2025-12-15'),
    priority: 'high'
  });

  // SXSW Sydney Speaker
  projectManager.createProject({
    title: 'SXSW Sydney (Speaker)',
    description: 'Submit speaking proposal for SXSW Sydney on innovation, technology, or social impact topics.',
    category: 'speaking',
    applicationOpenDate: new Date('2025-03-01'),
    applicationDeadline: new Date('2025-05-15'),
    notificationDate: new Date('2025-07-01'),
    programStartDate: new Date('2025-10-15'),
    programEndDate: new Date('2025-10-19'),
    priority: 'medium'
  });

  // Obama Foundation Leaders
  projectManager.createProject({
    title: 'Obama Foundation Leaders',
    description: 'Leadership development program for emerging leaders working on community change. Focus on civic engagement and social impact.',
    category: 'leadership',
    applicationOpenDate: new Date('2025-02-15'),
    applicationDeadline: new Date('2025-04-30'),
    notificationDate: new Date('2025-06-30'),
    programStartDate: new Date('2025-09-15'),
    programEndDate: new Date('2026-03-15'),
    priority: 'high'
  });

  // Westpac Social Change Fellowship
  projectManager.createProject({
    title: 'Westpac Social Change Fellowship',
    description: 'Fellowship supporting social entrepreneurs and changemakers in Australia. Includes funding and mentorship.',
    category: 'fellowship',
    applicationOpenDate: new Date('2025-04-01'),
    applicationDeadline: new Date('2025-06-15'),
    notificationDate: new Date('2025-08-15'),
    programStartDate: new Date('2025-10-01'),
    programEndDate: new Date('2026-10-01'),
    priority: 'high'
  });

  // Fulbright Professional Scholarship
  projectManager.createProject({
    title: 'Fulbright Professional Scholarship (Alliance Studies)',
    description: 'Fulbright scholarship for professional development and research in alliance studies. US-Australia exchange program.',
    category: 'scholarship',
    applicationOpenDate: new Date('2025-02-01'),
    applicationDeadline: new Date('2025-05-31'),
    notificationDate: new Date('2025-09-01'),
    programStartDate: new Date('2026-01-15'),
    programEndDate: new Date('2026-12-15'),
    priority: 'high'
  });

  // International Strategy Forum
  projectManager.createProject({
    title: 'International Strategy Forum (ISF)',
    description: 'Strategic leadership program focused on international relations and policy. Intensive seminar and networking.',
    category: 'leadership',
    applicationOpenDate: new Date('2025-03-15'),
    applicationDeadline: new Date('2025-05-15'),
    notificationDate: new Date('2025-06-30'),
    programStartDate: new Date('2025-09-01'),
    programEndDate: new Date('2025-09-10'),
    priority: 'medium'
  });

  // Asia 21 Young Leaders
  projectManager.createProject({
    title: 'Asia 21 Young Leaders (Asia Society)',
    description: 'Premier leadership initiative for young leaders across Asia-Pacific. Focus on regional challenges and collaboration.',
    category: 'leadership',
    applicationOpenDate: new Date('2025-01-01'),
    applicationDeadline: new Date('2025-03-15'),
    notificationDate: new Date('2025-05-01'),
    programStartDate: new Date('2025-08-15'),
    programEndDate: new Date('2025-08-20'),
    priority: 'high'
  });

  console.log('✅ Seeded 8 projects successfully');
}

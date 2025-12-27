# 📋 Categorized To-Do List

A comprehensive task management and habit tracking application with support for long-term project planning. Built with TypeScript, Vite, and Chart.js.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## ✨ Features

### Core Task Management
- **Smart Categorization**: 8 color-coded categories (Self Care, Exercise, Work, Friends/Social, Tasks, Important/Priority, Partner, Knowledge Hub)
- **AI-Powered Suggestions**: Automatic category detection based on task description
- **Flexible Organization**: Tags, due dates, locations, and priority levels
- **Quick Category Buttons**: One-click task categorization

### Habit Tracking (Atomic Habits Integration)
- **Daily Focus (Rule of 3)**: Focus on 3 most important tasks each day
- **Habit Streaks**: Track current and longest streaks with visual indicators
- **2-Minute Rule**: Quick wins for tasks under 2 minutes
- **Never Miss Twice**: Recovery bonus system for maintaining habits
- **Habit Stacking**: Link new habits to existing ones
- **Implementation Intentions**: Specify when, where, and how long
- **Habit Templates**: Pre-built habits for quick setup

### Analytics & Insights
- **Weekly Review**: 7-day progress summary with habit performance
- **Habit Heatmap**: GitHub-style 365-day visualization
- **Progress Analytics**: 30-day trends and momentum tracking
- **Identity-Based Goals**: Define identities and link habits
- **Hub Dashboard**: Comprehensive stats and recommendations

### Calendar View
- **Monthly Calendar**: Navigate 12 months back and forward
- **Task Visualization**: See all tasks on their due dates
- **Day Expansion**: Click days to see full task list
- **NSW Public Holidays**: Built-in Australian public holiday support
- **Weekend Highlighting**: Visual distinction for weekends

### Projects Tab
Track long-term applications, fellowships, and speaking opportunities:

- **Timeline Visualization**: See upcoming deadlines for the next 6 months
- **Progress Tracking**: Monitor completion percentage for each project
- **Milestones**: Break projects into trackable milestones
- **Notes System**: Keep detailed notes for each project
- **Application Questions**: Track questions you need to answer
- **Status Management**: Planning → In Progress → Submitted → Completed/Accepted/Rejected
- **Smart Paste**: AI-powered parsing of project details from copied text
- **Deadline Alerts**: Visual warnings for urgent deadlines (< 14 days)

#### Pre-loaded Projects
The app comes with 8 pre-configured projects:
1. Churchill Fellowship
2. Atlantic Council Millennium Fellowship
3. SXSW Sydney (Speaker)
4. Obama Foundation Leaders
5. Westpac Social Change Fellowship
6. Fulbright Professional Scholarship (Alliance Studies)
7. International Strategy Forum (ISF)
8. Asia 21 Young Leaders (Asia Society)

### Settings & Data Management
- **Export Data**: Download all your data as JSON backup
- **Import Data**: Restore from previous backups
- **Storage Info**: View data usage statistics
- **Clear Data**: Reset app to fresh state

### Offline Support
- **Service Worker**: Works offline after first load
- **Local Storage**: All data stored on your device
- **No Server Required**: Fully client-side application

## 🎯 Usage

### Adding Tasks
1. Type your task in the input field
2. Use quick category buttons (🧘 🏃 💼 👥 📝 🔴 💕 💡) or let AI suggest
3. Expand "More options" for:
   - Due date
   - Effort level (Quick/Medium/Long)
   - Priority (Daily Focus/Normal/Low)
   - Location and tags
   - Habit tracking
   - Implementation intentions
   - Habit stacking

### Managing Projects
1. Click "Projects" tab in navigation
2. View timeline of upcoming deadlines
3. Click "Add Project" to create new projects
4. Use "Smart Paste" to automatically parse project details
5. Click "View Details" on any project to:
   - Add milestones
   - Take notes
   - Track application questions
   - Update progress and status

### Tracking Habits
1. Mark tasks as habits when creating
2. Complete daily to build streaks
3. View habit performance in Weekly Review
4. Use Habit Heatmap to visualize consistency
5. Link habits to identities in Identity Goals

### Setting Daily Focus
1. Go to Tasks page
2. Set 3 tasks as "Daily Focus" priority
3. Complete them for bonus points and confetti celebration

### Backing Up Data
1. Go to Settings tab
2. Click "Export All Data"
3. Save the JSON file to a safe location
4. To restore: Click "Import from File" and select your backup

## 📁 Project Structure

```
├── public/           # Static assets
│   ├── index.html    # Main HTML file
│   ├── styles.css    # Global styles
│   └── sw.js         # Service worker for offline support
├── src/              # Source code
│   ├── components/   # UI components
│   │   ├── CalendarComponent.ts
│   │   ├── DailyFocusComponent.ts
│   │   ├── HabitTrackerComponent.ts
│   │   ├── ProjectsComponent.ts
│   │   ├── SettingsComponent.ts
│   │   └── ... (more components)
│   ├── models/       # Data models and types
│   ├── services/     # Business logic services
│   │   ├── DataExportService.ts
│   │   ├── ItemManager.ts
│   │   └── ProjectManager.ts
│   ├── utils/        # Utility functions
│   │   ├── projectParser.ts (Smart Paste)
│   │   └── seedProjects.ts
│   ├── App.ts        # Main application class
│   └── main.ts       # Application entry point
├── tests/            # Test files
├── .github/          # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml
├── DEPLOYMENT.md     # Deployment guide
├── PRODUCTION_CHECKLIST.md  # Pre-deployment checklist
├── SMART_PASTE_EXAMPLES.md  # Smart Paste usage guide
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite build configuration
├── netlify.toml      # Netlify deployment config
└── vercel.json       # Vercel deployment config
```

## 🚀 Deployment

The app is ready for production deployment. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Options

**Netlify** (Recommended):
```bash
npm run deploy:netlify
```

**Vercel**:
```bash
npm run deploy:vercel
```

**GitHub Pages**:
- Push to GitHub
- Enable Pages in repository settings
- Workflow will auto-deploy

See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for pre-deployment verification steps.

## 🎨 Categories

| Category | Color | Icon | Use Case |
|----------|-------|------|----------|
| Self Care | Yellow | 🧘 | Meditation, journaling, relaxation |
| Exercise | Orange | 🏃 | Workouts, sports, physical activity |
| Work | Blue | 💼 | Professional tasks, meetings |
| Friends/Social | Green | 👥 | Social events, calls, meetups |
| Tasks | Purple | 📝 | General to-dos, errands |
| Important/Priority | Red | 🔴 | Urgent, high-priority items |
| Partner | Pink | 💕 | Relationship activities |
| Knowledge Hub | Teal | 💡 | Learning, notes, ideas |

## 🛠️ Technology Stack
- **Frontend**: TypeScript, Vite
- **Styling**: Custom CSS with CSS Variables
- **Storage**: LocalStorage (client-side only)
- **Charts**: Chart.js
- **Build**: Vite
- **Testing**: Jest
- **Offline**: Service Worker

## 📊 Points System

- Complete task: **+10 points**
- Complete Quick Win (2-min): **+5 points**
- Complete Daily Focus task: **+25 points**
- Complete habit: **+10 points**
- 7-day streak: **+50 bonus**
- 30-day streak: **+200 bonus**
- Never Miss Twice recovery: **+10 bonus**

## 🔒 Privacy & Security

- **100% Local**: All data stored in your browser's localStorage
- **No Server**: No data sent to external servers
- **No Tracking**: No analytics or tracking by default
- **Offline First**: Works without internet connection
- **Export Anytime**: Full data export in JSON format

## 📝 License
MIT

## 🤝 Contributing

This is a personal productivity app, but feel free to fork and customize for your own needs!

## 📚 Additional Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Comprehensive deployment guide
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Pre-deployment verification
- [SMART_PASTE_EXAMPLES.md](SMART_PASTE_EXAMPLES.md) - Smart Paste feature guide

---

**Version**: 1.0.0  
**Status**: Production Ready ✅

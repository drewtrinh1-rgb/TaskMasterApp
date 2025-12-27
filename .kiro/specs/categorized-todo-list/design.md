# Design Document: Categorized To-Do List

## Overview

The Categorized To-Do List is a web application that helps users organize their tasks and notes across different life areas using intelligent auto-categorization and visual color coding. The system automatically categorizes user input based on keyword analysis while allowing manual overrides, provides analytics to identify neglected areas, and persists all data locally in the browser.

## Architecture

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (UI Components, Event Handlers)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Business Logic, Categorization)       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  (Storage Interface, Data Models)       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Browser Storage                 │
│  (localStorage API)                     │
└─────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Vanilla JavaScript with HTML5 and CSS3 (or React/Vue if preferred)
- **Storage**: Browser localStorage API
- **Charting Library**: Chart.js (simple, beginner-friendly, MIT licensed)
- **Build Tool**: Optional (Vite or Webpack for bundling)

## Components and Interfaces

### 1. Data Models

#### Task/Note Model
```typescript
interface Item {
  id: string;              // UUID
  description: string;     // User-provided text
  category: Category;      // One of 8 categories
  type: 'task' | 'note';  // Distinguishes actionable vs informational
  completed: boolean;      // Only relevant for tasks
  dueDate?: Date;         // Optional
  location?: string;      // Optional
  tags?: string[];        // For Knowledge Hub items
  createdAt: Date;
  completedAt?: Date;
}
```

#### Category Model
```typescript
enum Category {
  SELF_CARE = 'self-care',
  EXERCISE = 'exercise',
  WORK = 'work',
  FRIENDS_SOCIAL = 'friends-social',
  TASKS = 'tasks',
  IMPORTANT_PRIORITY = 'important-priority',
  PARTNER = 'partner',
  KNOWLEDGE_HUB = 'knowledge-hub'
}

interface CategoryConfig {
  name: string;
  color: string;  // CSS color value
  keywords: string[];  // For auto-categorization
}
```

### 2. Categorization Engine

The categorization engine uses keyword matching with weighted scoring:

```typescript
interface CategorizationEngine {
  categorize(description: string): Category;
  updateKeywords(category: Category, keywords: string[]): void;
}
```

**Algorithm**:
1. Tokenize input text (lowercase, remove punctuation)
2. For each category, calculate match score based on keyword presence
3. Apply weights: exact matches (1.0), partial matches (0.5)
4. Return category with highest score
5. If no clear winner (score < threshold), default to "Tasks" category

**Keyword Sets** (examples):
- Self Care: ["meditation", "spa", "relax", "sleep", "therapy", "mindfulness"]
- Exercise: ["gym", "workout", "run", "yoga", "fitness", "exercise"]
- Work: ["meeting", "deadline", "project", "email", "presentation", "client"]
- Friends/Social: ["dinner", "party", "hangout", "catch up", "birthday"]
- Partner: ["date", "anniversary", "romantic", "together", "couple"]
- Important/Priority: ["urgent", "asap", "critical", "important", "priority"]
- Knowledge Hub: ["remember", "note", "likes", "favorite", "gift idea", "preference"]

### 3. Storage Manager

```typescript
interface StorageManager {
  saveItem(item: Item): Promise<void>;
  getItem(id: string): Promise<Item | null>;
  getAllItems(): Promise<Item[]>;
  updateItem(id: string, updates: Partial<Item>): Promise<void>;
  deleteItem(id: string): Promise<void>;
  clearAll(): Promise<void>;
}
```

**Implementation Details**:
- Store items as JSON array in localStorage under key "categorized-todo-items"
- Serialize/deserialize dates properly
- Handle storage quota exceeded errors gracefully
- Implement debouncing for frequent updates

### 4. Analytics Calculator

```typescript
interface AnalyticsData {
  categoryDistribution: Map<Category, number>;
  completionRates: Map<Category, number>;
  weeklyStats: Map<Category, { completed: number; total: number }>;
  neglectedCategories: Category[];
  recommendations: string[];
}

interface AnalyticsCalculator {
  calculate(items: Item[], timeRange: 'week' | 'month' | 'all'): AnalyticsData;
}
```

**Calculation Logic**:
- Filter items by creation date based on time range
- Count items per category
- Calculate completion rate: completed / total (for tasks only)
- Identify neglected categories: < 20% of average category count
- Generate recommendations based on patterns

### 5. UI Components

#### Dashboard Component
- Displays analytics charts and recommendations
- Shows category distribution pie chart
- Shows completion rates bar chart
- Highlights neglected areas with visual indicators

#### Task List Component
- Displays all items with color-coded categories
- Supports filtering by category, completion status
- Supports sorting by due date, creation date
- Inline editing capabilities

#### Input Component
- Single text input for description
- Optional category selector (collapsed by default)
- Optional due date picker
- Optional location input
- Auto-categorization indicator showing suggested category

#### Item Card Component
- Displays item with category color border/background
- Shows description, due date, location
- Action buttons: complete, edit, delete
- Visual distinction between tasks and notes

## Data Models

### Storage Schema

```json
{
  "categorized-todo-items": [
    {
      "id": "uuid-v4",
      "description": "Go to the gym",
      "category": "exercise",
      "type": "task",
      "completed": false,
      "dueDate": "2025-12-25T10:00:00Z",
      "location": "LA Fitness",
      "tags": [],
      "createdAt": "2025-12-24T08:00:00Z"
    }
  ],
  "app-settings": {
    "defaultCategory": "tasks",
    "autoCategorizationEnabled": true
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Item Creation Preserves All Fields
*For any* valid description, category, optional due date, optional location, and optional tags, creating an item with these values should result in an item being stored with exactly those values preserved.
**Validates: Requirements 1.1, 1.7, 1.8**

### Property 2: Empty Descriptions Are Rejected
*For any* string composed entirely of whitespace or empty string, attempting to create an item with that description should be rejected and no item should be created.
**Validates: Requirements 1.2**

### Property 3: Manual Category Selection Overrides Auto-Categorization
*For any* description and explicitly selected category, creating an item with both should result in the item having the manually selected category, regardless of what auto-categorization would suggest.
**Validates: Requirements 1.3**

### Property 4: Unique Identifiers
*For any* set of created items, all item IDs should be unique with no duplicates.
**Validates: Requirements 1.5**

### Property 5: Keyword-Based Categorization
*For any* description containing keywords from a specific category's keyword set, auto-categorization should assign that category when no manual category is provided.
**Validates: Requirements 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**

### Property 6: Type Detection
*For any* description without action-oriented keywords (like "do", "complete", "finish"), the system should classify the item as a note rather than a task.
**Validates: Requirements 1.10**

### Property 7: Knowledge Hub Items Don't Require Completion Fields
*For any* item categorized as Knowledge Hub, the item should be valid without a due date or completion status.
**Validates: Requirements 3.3**

### Property 8: Tag Storage and Retrieval
*For any* Knowledge Hub item with tags, adding tags should store them with the item, and searching by those tags should return the item.
**Validates: Requirements 3.7**

### Property 9: Search Functionality
*For any* search query and set of items, the search results should include all and only items whose description or tags contain the search query.
**Validates: Requirements 3.5**

### Property 10: Item Rendering Completeness
*For any* item, rendering that item should include its description, category color, and any optional fields (due date, location) that are present.
**Validates: Requirements 1.6, 4.10, 5.2, 5.3, 5.4**

### Property 11: Filter Correctness
*For any* filter criteria (category, completion status), applying that filter should return all and only items that match the criteria.
**Validates: Requirements 5.6, 6.4, 6.5**

### Property 12: Overdue Task Detection
*For any* task with a due date in the past and current date, the task should be marked as overdue.
**Validates: Requirements 5.7**

### Property 13: Due Date Sorting
*For any* list of items with due dates, sorting by due date should result in items ordered chronologically from earliest to latest.
**Validates: Requirements 5.8**

### Property 14: Task Completion State Transition
*For any* task, marking it as complete should update its completed status to true and set the completedAt timestamp.
**Validates: Requirements 6.1**

### Property 15: Item Deletion
*For any* item in the system, deleting that item should remove it from the item list and it should not appear in subsequent queries.
**Validates: Requirements 7.1, 7.2**

### Property 16: Description Update
*For any* item and new non-empty description, updating the item's description should change the description while preserving the item ID and other fields.
**Validates: Requirements 8.1, 8.4**

### Property 17: Empty Description Edits Rejected
*For any* existing item, attempting to update its description to an empty or whitespace-only string should be rejected and the original description should be preserved.
**Validates: Requirements 8.3**

### Property 18: Category Update
*For any* item and new category, updating the item's category should change the category while preserving all other fields.
**Validates: Requirements 8.2, 8.4**

### Property 19: Optional Field Updates
*For any* item, updating or clearing optional fields (due date, location) should persist the changes while preserving all other fields.
**Validates: Requirements 8.5, 8.6, 8.7, 8.8**

### Property 20: Storage Persistence Round Trip
*For any* item, creating it, persisting to storage, clearing memory, and reloading from storage should result in an equivalent item with all fields preserved.
**Validates: Requirements 9.1, 9.2, 9.4**

### Property 21: Deletion Persistence
*For any* item, deleting it and persisting to storage should result in the item not being present when reloading from storage.
**Validates: Requirements 9.3**

### Property 22: Analytics Category Distribution
*For any* set of items, the analytics category distribution should show counts that sum to the total number of items, with each category count matching the actual number of items in that category.
**Validates: Requirements 10.2, 10.4**

### Property 23: Time-Based Analytics Filtering
*For any* set of items with creation dates and time period (week, month, all), the analytics should only include items whose creation date falls within that time period.
**Validates: Requirements 10.3, 10.10**

### Property 24: Neglected Category Detection
*For any* set of items where one category has significantly fewer items (< 20% of average), that category should be identified as neglected.
**Validates: Requirements 10.7**

### Property 25: Recommendation Generation
*For any* set of items with identified neglected categories, the system should generate recommendations suggesting focus on those categories.
**Validates: Requirements 10.8**

## Error Handling

### Input Validation Errors
- Empty or whitespace-only descriptions → Display error message, prevent creation
- Invalid date formats → Display error message, use current date as fallback
- Invalid category selection → Use auto-categorization as fallback

### Storage Errors
- localStorage quota exceeded → Notify user, suggest clearing old completed tasks
- localStorage unavailable (private browsing) → Display warning, operate in memory-only mode
- Corrupted data in storage → Attempt to recover valid items, log errors

### Categorization Errors
- No clear category match → Default to "Tasks" category
- Multiple equally-weighted categories → Use first match in priority order

### UI Errors
- Failed to render chart → Display error message, show data in table format
- Network errors (if using external resources) → Use cached/fallback resources

## Testing Strategy

### Unit Testing
The application will use unit tests for specific examples and edge cases:
- Test each category's keyword set with example descriptions
- Test date parsing with various formats
- Test storage manager with mock localStorage
- Test analytics calculator with known data sets
- Test edge cases: empty lists, single items, maximum storage

### Property-Based Testing
The application will use property-based testing to verify universal properties across all inputs using a JavaScript PBT library (fast-check or jsverify):

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: categorized-todo-list, Property {number}: {property_text}**
- Generators for: random descriptions, categories, dates, UUIDs, item objects

**Test Organization**:
- Group tests by component (Storage, Categorization, Analytics, UI)
- Each correctness property implemented as a single property test
- Use shrinking to find minimal failing examples

**Coverage Goals**:
- All 25 correctness properties tested
- Edge cases covered: empty inputs, boundary dates, storage limits
- Integration points tested: storage ↔ business logic ↔ UI

### Integration Testing
- Test complete user flows: create → edit → complete → delete
- Test analytics dashboard with realistic data sets
- Test storage persistence across page reloads
- Test auto-categorization with real-world task descriptions

### Manual Testing
- UI/UX testing for visual design and usability
- Accessibility testing (keyboard navigation, screen readers)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing

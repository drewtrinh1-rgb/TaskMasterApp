/**
 * CategorizationEngine - Automatically categorizes items based on description keywords
 * Uses fuzzy matching, substring matching, and comprehensive keyword lists
 */

import { Category, ItemType } from '../models/index';

// Comprehensive keyword mappings for each category
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  [Category.SELF_CARE]: [
    // Relaxation & Rest
    'meditation', 'meditate', 'spa', 'relax', 'relaxing', 'sleep', 'nap', 'rest', 'resting',
    'therapy', 'therapist', 'counseling', 'counselor', 'mindfulness', 'mindful',
    'massage', 'facial', 'manicure', 'pedicure', 'salon', 'haircut', 'hair appointment',
    // Self-care activities
    'skincare', 'skin care', 'bath', 'bubble bath', 'wellness', 'self-care', 'selfcare',
    'journal', 'journaling', 'gratitude', 'affirmation', 'breathing', 'breathe',
    'detox', 'cleanse', 'pamper', 'treat myself', 'me time', 'alone time',
    // Mental health
    'mental health', 'anxiety', 'stress relief', 'destress', 'unwind', 'decompress',
    'read', 'reading', 'book', 'audiobook', 'podcast'
  ],
  
  [Category.EXERCISE]: [
    // Gym & Fitness
    'gym', 'workout', 'work out', 'exercise', 'exercising', 'fitness', 'fit',
    'training', 'train', 'trainer', 'personal trainer', 'weights', 'lifting', 'lift',
    'cardio', 'treadmill', 'elliptical', 'stairmaster', 'rowing', 'rower',
    'crossfit', 'hiit', 'bootcamp', 'boot camp', 'circuit', 'strength',
    // Running & Walking
    'run', 'running', 'jog', 'jogging', 'sprint', 'sprinting', 'marathon', 'half marathon',
    'walk', 'walking', 'hike', 'hiking', 'trek', 'trekking', 'trail',
    // Sports - Racquet
    'badminton', 'tennis', 'squash', 'racquetball', 'ping pong', 'table tennis', 'pickleball',
    // Sports - Team
    'basketball', 'football', 'soccer', 'volleyball', 'baseball', 'softball',
    'hockey', 'rugby', 'cricket', 'lacrosse', 'handball',
    // Sports - Individual
    'golf', 'golfing', 'bowling', 'archery', 'fencing', 'wrestling',
    'boxing', 'kickboxing', 'mma', 'martial arts', 'karate', 'judo', 'taekwondo',
    'jiu jitsu', 'bjj', 'muay thai', 'kung fu',
    // Water sports
    'swim', 'swimming', 'pool', 'lap', 'laps', 'dive', 'diving', 'snorkel', 'snorkeling',
    'surf', 'surfing', 'kayak', 'kayaking', 'canoe', 'paddle', 'paddleboard', 'sup',
    'water polo', 'sailing', 'sail', 'boat', 'rowing',
    // Winter sports
    'ski', 'skiing', 'snowboard', 'snowboarding', 'skate', 'skating', 'ice skating',
    // Cycling
    'bike', 'biking', 'bicycle', 'cycling', 'cycle', 'spin', 'spinning', 'peloton',
    // Yoga & Flexibility
    'yoga', 'pilates', 'stretch', 'stretching', 'flexibility', 'barre',
    // Dance
    'dance', 'dancing', 'zumba', 'aerobics', 'step class',
    // Climbing
    'climb', 'climbing', 'boulder', 'bouldering', 'rock climbing',
    // General
    'sport', 'sports', 'athletic', 'athlete', 'game', 'match', 'practice', 'play',
    'court', 'field', 'track', 'stadium', 'arena', 'league', 'team', 'competition'
  ],
  
  [Category.WORK]: [
    // Meetings & Communication
    'meeting', 'meetings', 'meet with', 'call', 'conference', 'conference call',
    'zoom', 'teams', 'slack', 'standup', 'stand-up', 'sync', 'one-on-one', '1:1', '1on1',
    'presentation', 'present', 'demo', 'pitch', 'webinar',
    // Tasks & Projects
    'deadline', 'project', 'task', 'assignment', 'deliverable', 'milestone',
    'report', 'document', 'documentation', 'proposal', 'draft', 'review',
    'email', 'emails', 'inbox', 'respond', 'reply', 'follow up', 'follow-up',
    // Work-related
    'work', 'working', 'office', 'workplace', 'desk', 'computer',
    'client', 'clients', 'customer', 'customers', 'stakeholder', 'vendor',
    'boss', 'manager', 'supervisor', 'colleague', 'coworker', 'team',
    // Business
    'business', 'company', 'corporate', 'enterprise', 'startup',
    'budget', 'invoice', 'contract', 'agreement', 'negotiate', 'negotiation',
    'quarterly', 'annual', 'fiscal', 'revenue', 'profit', 'sales',
    'kpi', 'metrics', 'analytics', 'data', 'spreadsheet', 'excel',
    // Career
    'interview', 'job', 'career', 'resume', 'cv', 'linkedin', 'networking',
    'promotion', 'raise', 'salary', 'hr', 'human resources', 'onboarding',
    // Professional
    'professional', 'certification', 'training', 'workshop', 'seminar'
  ],
  
  [Category.FRIENDS_SOCIAL]: [
    // Social activities
    'friend', 'friends', 'buddy', 'buddies', 'pal', 'pals', 'bestie', 'bff',
    'hangout', 'hang out', 'hanging out', 'catch up', 'catching up', 'get together',
    'social', 'socialize', 'socializing', 'meetup', 'meet up',
    // Food & Drinks
    'dinner', 'lunch', 'brunch', 'breakfast', 'coffee', 'drinks', 'happy hour',
    'restaurant', 'cafe', 'bar', 'pub', 'club', 'nightclub', 'lounge',
    'bbq', 'barbecue', 'cookout', 'potluck', 'picnic',
    // Events & Celebrations
    'party', 'parties', 'birthday', 'celebration', 'celebrate', 'celebrating',
    'wedding', 'shower', 'baby shower', 'bridal shower', 'bachelor', 'bachelorette',
    'graduation', 'anniversary', 'reunion', 'gathering', 'event',
    'housewarming', 'house warming', 'farewell', 'going away',
    // Entertainment
    'movie', 'movies', 'cinema', 'theater', 'theatre', 'show', 'concert',
    'festival', 'fair', 'carnival', 'parade', 'fireworks',
    'game night', 'board game', 'card game', 'trivia', 'karaoke',
    'bowling', 'escape room', 'arcade', 'mini golf', 'laser tag',
    // Travel & Outings
    'trip', 'travel', 'vacation', 'getaway', 'road trip', 'weekend trip',
    'outing', 'excursion', 'adventure', 'explore',
    // Communication
    'call friend', 'text', 'message', 'chat', 'video call', 'facetime'
  ],
  
  [Category.TASKS]: [
    // Errands
    'errand', 'errands', 'chore', 'chores', 'todo', 'to-do', 'to do',
    // Shopping
    'buy', 'purchase', 'shop', 'shopping', 'grocery', 'groceries', 'store',
    'order', 'amazon', 'online', 'pickup', 'pick up', 'pick-up',
    // Home tasks
    'clean', 'cleaning', 'vacuum', 'mop', 'dust', 'dusting', 'sweep', 'sweeping',
    'laundry', 'wash', 'washing', 'dishes', 'dishwasher', 'trash', 'garbage', 'recycle',
    'organize', 'organizing', 'declutter', 'tidy', 'tidying',
    'fix', 'repair', 'maintenance', 'maintain', 'replace', 'install',
    // Administrative
    'appointment', 'schedule', 'book', 'reserve', 'reservation',
    'renew', 'cancel', 'reschedule', 'confirm', 'confirmation',
    'pay', 'payment', 'bill', 'bills', 'bank', 'banking', 'deposit', 'transfer',
    'mail', 'post office', 'package', 'delivery', 'ship', 'shipping', 'return',
    // Documents
    'paperwork', 'form', 'forms', 'sign', 'signature', 'notary',
    'tax', 'taxes', 'insurance', 'registration', 'license', 'permit',
    // Misc tasks
    'get', 'grab', 'drop off', 'drop-off', 'bring', 'take', 'move',
    'call', 'contact', 'reach out', 'check', 'verify', 'update', 'change'
  ],
  
  [Category.IMPORTANT_PRIORITY]: [
    // Urgency
    'urgent', 'urgently', 'asap', 'immediately', 'right away', 'right now',
    'now', 'today', 'tonight', 'this morning', 'this afternoon', 'this evening',
    // Priority
    'important', 'priority', 'high priority', 'top priority', 'critical', 'crucial',
    'essential', 'vital', 'key', 'must', 'must do', 'have to', 'need to',
    // Time-sensitive
    'deadline', 'due', 'overdue', 'late', 'behind', 'time sensitive', 'time-sensitive',
    'expiring', 'expires', 'last chance', 'final', 'last day', 'ends today',
    // Emergency
    'emergency', 'emergent', 'crisis', 'urgent care', 'er', 'hospital',
    // Reminders
    'reminder', 'remind', 'don\'t forget', 'dont forget', 'remember',
    'before', 'by', 'no later than'
  ],
  
  [Category.PARTNER]: [
    // Relationship terms
    'partner', 'spouse', 'husband', 'wife', 'boyfriend', 'girlfriend',
    'bf', 'gf', 'babe', 'baby', 'honey', 'sweetie', 'darling', 'love',
    'significant other', 'so', 'fiance', 'fiancee',
    // Romantic activities
    'date', 'date night', 'romantic', 'romance', 'anniversary', 'valentine',
    'dinner date', 'movie date', 'lunch date', 'breakfast date',
    // Quality time
    'together', 'couple', 'couples', 'us', 'we', 'our',
    'quality time', 'spend time', 'cuddle', 'cuddling',
    // Gifts & Gestures
    'gift for', 'present for', 'surprise', 'flowers', 'chocolate', 'jewelry',
    'card', 'love letter', 'romantic gesture',
    // Milestones
    'engagement', 'wedding', 'honeymoon', 'wedding anniversary',
    'first date', 'proposal', 'propose'
  ],
  
  [Category.KNOWLEDGE_HUB]: [
    // Information storage
    'remember', 'note', 'notes', 'note to self', 'memo', 'jot down',
    'info', 'information', 'fact', 'facts', 'reference', 'lookup', 'look up',
    // Preferences & Ideas
    'likes', 'like', 'favorite', 'favourite', 'preference', 'prefers',
    'idea', 'ideas', 'thought', 'thoughts', 'inspiration', 'inspired',
    'gift idea', 'gift ideas', 'wishlist', 'wish list', 'want', 'wants',
    // Learning & Research
    'learn', 'learning', 'study', 'studying', 'research', 'researching',
    'course', 'class', 'lesson', 'tutorial', 'how to', 'howto',
    // Saving & Bookmarking
    'save', 'saved', 'bookmark', 'bookmarked', 'keep', 'store',
    'quote', 'quotes', 'saying', 'sayings',
    // Recipes & Tips
    'recipe', 'recipes', 'ingredient', 'ingredients', 'cooking tip',
    'tip', 'tips', 'trick', 'tricks', 'hack', 'hacks', 'lifehack',
    // Recommendations
    'recommendation', 'recommend', 'recommended', 'suggestion', 'suggest',
    'review', 'reviews', 'rating', 'rated',
    // Lists
    'bucket list', 'list of', 'collection', 'catalog', 'catalogue'
  ]
};

// Action keywords that indicate a task vs note
const ACTION_KEYWORDS = [
  'do', 'complete', 'finish', 'make', 'create', 'build', 'fix', 'repair',
  'buy', 'get', 'pick up', 'return', 'call', 'email', 'send', 'schedule',
  'book', 'reserve', 'attend', 'go to', 'meet', 'visit', 'clean', 'organize',
  'submit', 'prepare', 'setup', 'set up', 'install', 'update', 'check',
  'pay', 'renew', 'cancel', 'confirm', 'sign up', 'register'
];

/**
 * CategorizationEngine class for auto-categorizing items
 */
export class CategorizationEngine {
  /**
   * Normalize text for matching (lowercase, remove extra spaces)
   */
  private normalize(text: string): string {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Check if text contains a keyword (supports multi-word keywords)
   */
  private containsKeyword(text: string, keyword: string): boolean {
    const normalizedText = this.normalize(text);
    const normalizedKeyword = this.normalize(keyword);
    
    // Direct substring match
    if (normalizedText.includes(normalizedKeyword)) {
      return true;
    }
    
    // Word boundary match for single words
    if (!normalizedKeyword.includes(' ')) {
      const words = normalizedText.split(/\s+/);
      for (const word of words) {
        // Exact match
        if (word === normalizedKeyword) return true;
        // Word starts with keyword (e.g., "running" matches "run")
        if (word.startsWith(normalizedKeyword) && word.length <= normalizedKeyword.length + 4) return true;
        // Keyword starts with word (e.g., "run" matches "running")
        if (normalizedKeyword.startsWith(word) && normalizedKeyword.length <= word.length + 4) return true;
      }
    }
    
    return false;
  }

  /**
   * Calculate match score for a category
   */
  private calculateScore(text: string, keywords: string[]): number {
    let score = 0;
    const matchedKeywords = new Set<string>();
    
    for (const keyword of keywords) {
      if (this.containsKeyword(text, keyword) && !matchedKeywords.has(keyword)) {
        // Longer keywords get higher scores (more specific)
        const keywordScore = 1 + (keyword.length / 10);
        score += keywordScore;
        matchedKeywords.add(keyword);
        
        // Bonus for exact word match
        const words = this.normalize(text).split(/\s+/);
        if (words.includes(this.normalize(keyword))) {
          score += 0.5;
        }
      }
    }
    
    return score;
  }

  /**
   * Categorize a description and return the best matching category
   */
  categorize(description: string): Category {
    if (!description || description.trim().length === 0) {
      return Category.TASKS;
    }

    const scores: Map<Category, number> = new Map();
    
    // Calculate scores for each category
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = this.calculateScore(description, keywords);
      scores.set(category as Category, score);
    }

    // Find the category with the highest score
    let bestCategory = Category.TASKS;
    let bestScore = 0;

    for (const [category, score] of scores) {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    // If no clear match (score too low), default to Tasks
    if (bestScore < 0.5) {
      return Category.TASKS;
    }

    return bestCategory;
  }

  /**
   * Detect whether the description represents a task or note
   */
  detectType(description: string): ItemType {
    const normalizedDesc = this.normalize(description);
    
    // Check for action keywords
    for (const keyword of ACTION_KEYWORDS) {
      if (this.containsKeyword(normalizedDesc, keyword)) {
        return 'task';
      }
    }

    // Check if it's likely a Knowledge Hub item
    const knowledgeScore = this.calculateScore(description, CATEGORY_KEYWORDS[Category.KNOWLEDGE_HUB]);
    if (knowledgeScore >= 1) {
      return 'note';
    }

    // Default to task for ambiguous cases
    return 'task';
  }

  /**
   * Get all categories with their scores for debugging/display
   */
  getCategoryScores(description: string): Map<Category, number> {
    const scores: Map<Category, number> = new Map();
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = this.calculateScore(description, keywords);
      scores.set(category as Category, score);
    }
    
    return scores;
  }

  /**
   * Get keywords for a category
   */
  getKeywords(category: Category): string[] {
    return CATEGORY_KEYWORDS[category] || [];
  }
}

export default CategorizationEngine;

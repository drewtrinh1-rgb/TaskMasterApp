/**
 * Project Parser - Intelligently extracts project information from text
 */

import { CreateProjectInput } from '../models/Project';

export class ProjectParser {
  static parseProjectText(text: string): Partial<CreateProjectInput> {
    const result: Partial<CreateProjectInput> = {};

    // Extract title (first line or first sentence)
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      result.title = lines[0].trim().replace(/^[#*\-]+\s*/, ''); // Remove markdown symbols
    }

    // Extract description (everything else or second paragraph)
    if (lines.length > 1) {
      result.description = lines.slice(1).join(' ').trim().substring(0, 500);
    }

    // Detect category based on keywords
    const lowerText = text.toLowerCase();
    if (lowerText.includes('fellowship')) {
      result.category = 'fellowship';
    } else if (lowerText.includes('scholarship')) {
      result.category = 'scholarship';
    } else if (lowerText.includes('speaker') || lowerText.includes('speaking') || lowerText.includes('presentation')) {
      result.category = 'speaking';
    } else if (lowerText.includes('leader') || lowerText.includes('leadership')) {
      result.category = 'leadership';
    } else {
      result.category = 'other';
    }

    // Extract dates
    result.applicationOpenDate = this.extractDate(text, ['open', 'opens', 'opening', 'applications open']);
    result.applicationDeadline = this.extractDate(text, ['deadline', 'due', 'close', 'closes', 'closing', 'submit by', 'applications close']);
    result.notificationDate = this.extractDate(text, ['notification', 'notify', 'announce', 'results', 'decision']);
    result.programStartDate = this.extractDate(text, ['start', 'begins', 'commence', 'program start', 'fellowship start']);
    result.programEndDate = this.extractDate(text, ['end', 'finish', 'conclude', 'program end', 'fellowship end']);

    // Extract URL
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      result.url = urlMatch[0];
    }

    // Detect priority
    if (lowerText.includes('urgent') || lowerText.includes('high priority') || lowerText.includes('important')) {
      result.priority = 'high';
    } else if (lowerText.includes('low priority')) {
      result.priority = 'low';
    } else {
      result.priority = 'medium';
    }

    return result;
  }

  private static extractDate(text: string, keywords: string[]): Date | undefined {
    const lowerText = text.toLowerCase();
    
    // Look for dates near keywords
    for (const keyword of keywords) {
      const keywordIndex = lowerText.indexOf(keyword);
      if (keywordIndex === -1) continue;

      // Get text around the keyword (100 chars before and after)
      const contextStart = Math.max(0, keywordIndex - 50);
      const contextEnd = Math.min(text.length, keywordIndex + keyword.length + 100);
      const context = text.substring(contextStart, contextEnd);

      // Try various date formats
      const date = this.findDateInText(context);
      if (date) return date;
    }

    return undefined;
  }

  private static findDateInText(text: string): Date | undefined {
    // Format: DD/MM/YYYY or DD-MM-YYYY
    let match = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const year = parseInt(match[3]);
      return new Date(year, month, day);
    }

    // Format: YYYY-MM-DD
    match = text.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const day = parseInt(match[3]);
      return new Date(year, month, day);
    }

    // Format: Month DD, YYYY or DD Month YYYY
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                        'july', 'august', 'september', 'october', 'november', 'december'];
    const monthAbbr = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                       'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    // Try "Month DD, YYYY" or "Month DD YYYY"
    for (let i = 0; i < monthNames.length; i++) {
      const patterns = [
        new RegExp(`${monthNames[i]}\\s+(\\d{1,2}),?\\s+(\\d{4})`, 'i'),
        new RegExp(`${monthAbbr[i]}\\s+(\\d{1,2}),?\\s+(\\d{4})`, 'i'),
        new RegExp(`(\\d{1,2})\\s+${monthNames[i]}\\s+(\\d{4})`, 'i'),
        new RegExp(`(\\d{1,2})\\s+${monthAbbr[i]}\\s+(\\d{4})`, 'i')
      ];

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const day = parseInt(match[1]);
          const year = parseInt(match[2]);
          return new Date(year, i, day);
        }
      }
    }

    return undefined;
  }
}

// Enhanced event parsing with NLP-like capabilities

interface ParsedEvent {
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  location: string;
  confidence: number;
}

// Event type keywords and their confidence scores
const EVENT_TYPE_KEYWORDS = {
  hackathon: {
    keywords: ['hackathon', 'hack', 'coding competition', 'dev challenge', 'programming contest', 'buildathon'],
    confidence: 0.9
  },
  conference: {
    keywords: ['conference', 'conf', 'summit', 'symposium', 'convention', 'expo', 'forum'],
    confidence: 0.85
  },
  seminar: {
    keywords: ['seminar', 'workshop', 'webinar', 'training', 'session', 'class', 'tutorial', 'bootcamp'],
    confidence: 0.8
  },
  meetup: {
    keywords: ['meetup', 'gathering', 'networking', 'social', 'community'],
    confidence: 0.75
  },
  talk: {
    keywords: ['talk', 'presentation', 'lecture', 'keynote', 'speech'],
    confidence: 0.7
  }
};

// Technology keywords for better categorization
const TECH_KEYWORDS = {
  ai: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network'],
  web: ['web', 'frontend', 'backend', 'fullstack', 'javascript', 'react', 'vue', 'angular', 'node'],
  mobile: ['mobile', 'ios', 'android', 'flutter', 'react native', 'swift', 'kotlin'],
  blockchain: ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3', 'defi', 'nft'],
  cloud: ['cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops'],
  data: ['data', 'analytics', 'big data', 'database', 'sql', 'nosql', 'data science']
};

// Date parsing patterns
const DATE_PATTERNS = [
  // ISO format: 2024-07-15
  /(\d{4}-\d{1,2}-\d{1,2})/g,
  // US format: 07/15/2024 or 7/15/24
  /(\d{1,2}\/\d{1,2}\/\d{2,4})/g,
  // European format: 15/07/2024
  /(\d{1,2}\/\d{1,2}\/\d{4})/g,
  // Natural language: July 15, 2024
  /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/gi,
  // Short natural: Jul 15
  /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}/gi,
  // Relative dates
  /(today|tomorrow|next\s+week|next\s+month|this\s+week|this\s+month)/gi,
  // Day names
  /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|next\s+monday|next\s+tuesday|next\s+wednesday|next\s+thursday|next\s+friday|next\s+saturday|next\s+sunday)/gi
];

// Time parsing patterns
const TIME_PATTERNS = [
  // 24-hour format: 14:30, 09:00
  /(\d{1,2}:\d{2})/g,
  // 12-hour format: 2:30 PM, 9:00 AM
  /(\d{1,2}:\d{2}\s*[ap]m)/gi,
  // Natural time: morning, afternoon, evening
  /(morning|afternoon|evening|night)/gi
];

// Location patterns
const LOCATION_PATTERNS = [
  // Online indicators
  /(online|virtual|remote|zoom|teams|meet|webinar)/gi,
  // Physical locations
  /(at\s+[\w\s,]+|in\s+[\w\s,]+|@\s*[\w\s,]+)/gi
];

export function parseEventInput(input: string): ParsedEvent {
  const text = input.toLowerCase().trim();
  
  // Extract event type
  const eventType = extractEventType(text);
  
  // Extract dates
  const dates = extractDates(text);
  
  // Extract times
  const times = extractTimes(text);
  
  // Extract location
  const location = extractLocation(text);
  
  // Extract title (everything before common separators)
  const title = extractTitle(input, eventType.type);
  
  // Generate description
  const description = generateDescription(input, eventType);
  
  // Calculate overall confidence
  const confidence = calculateConfidence(eventType, dates, times, location);
  
  return {
    title: title || input,
    type: eventType.type,
    date: dates.length > 0 ? formatDate(dates[0]) : '',
    time: times.length > 0 ? formatTime(times[0]) : '09:00',
    description,
    location: location || 'TBD',
    confidence
  };
}

function extractEventType(text: string): { type: string; confidence: number } {
  let bestMatch = { type: 'hackathon', confidence: 0.3 }; // Default
  
  for (const [type, config] of Object.entries(EVENT_TYPE_KEYWORDS)) {
    for (const keyword of config.keywords) {
      if (text.includes(keyword)) {
        if (config.confidence > bestMatch.confidence) {
          bestMatch = { type, confidence: config.confidence };
        }
      }
    }
  }
  
  // Boost confidence if tech keywords are present
  for (const techCategory of Object.values(TECH_KEYWORDS)) {
    for (const keyword of techCategory) {
      if (text.includes(keyword)) {
        bestMatch.confidence = Math.min(1.0, bestMatch.confidence + 0.1);
        break;
      }
    }
  }
  
  return bestMatch;
}

function extractDates(text: string): string[] {
  const dates: string[] = [];
  
  for (const pattern of DATE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      dates.push(...matches);
    }
  }
  
  return dates;
}

function extractTimes(text: string): string[] {
  const times: string[] = [];
  
  for (const pattern of TIME_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      times.push(...matches);
    }
  }
  
  return times;
}

function extractLocation(text: string): string {
  for (const pattern of LOCATION_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      return matches[0].replace(/^(at|in|@)\s*/i, '').trim();
    }
  }
  
  return '';
}

function extractTitle(input: string, eventType: string): string {
  // Remove common separators and extract the main title
  const separators = [' on ', ' at ', ' in ', ' - ', ' | '];
  let title = input;
  
  for (const separator of separators) {
    const parts = title.split(separator);
    if (parts.length > 1) {
      title = parts[0].trim();
      break;
    }
  }
  
  // If title is too short, try to enhance it
  if (title.length < 5) {
    const techKeywords = findTechKeywords(input.toLowerCase());
    if (techKeywords.length > 0) {
      title = `${techKeywords[0]} ${eventType}`;
    }
  }
  
  return title;
}

function findTechKeywords(text: string): string[] {
  const found: string[] = [];
  
  for (const [_category, keywords] of Object.entries(TECH_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        found.push(keyword.toUpperCase());
        break; // Only add one per category
      }
    }
  }
  
  return found;
}

function generateDescription(input: string, eventType: { type: string; confidence: number }): string {
  const techKeywords = findTechKeywords(input.toLowerCase());
  const techPart = techKeywords.length > 0 ? ` focusing on ${techKeywords.join(', ')}` : '';
  
  const baseDescription = `Auto-created ${eventType.type}${techPart} from: "${input}"`;
  
  if (eventType.confidence > 0.8) {
    return baseDescription + ` (High confidence: ${Math.round(eventType.confidence * 100)}%)`;
  }
  
  return baseDescription;
}

function calculateConfidence(
  eventType: { confidence: number },
  dates: string[],
  times: string[],
  location: string
): number {
  let confidence = eventType.confidence;
  
  // Boost confidence for each extracted element
  if (dates.length > 0) confidence += 0.1;
  if (times.length > 0) confidence += 0.1;
  if (location) confidence += 0.05;
  
  return Math.min(1.0, confidence);
}

function formatDate(dateStr: string): string {
  // Try to parse and format the date consistently
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  
  // Handle relative dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (dateStr.includes('today')) {
    return today.toISOString().split('T')[0];
  }
  if (dateStr.includes('tomorrow')) {
    return tomorrow.toISOString().split('T')[0];
  }
  
  return dateStr; // Return as-is if can't parse
}

function formatTime(timeStr: string): string {
  // Convert to 24-hour format
  const time = timeStr.toLowerCase().trim();
  
  if (time.includes('morning')) return '09:00';
  if (time.includes('afternoon')) return '14:00';
  if (time.includes('evening')) return '18:00';
  if (time.includes('night')) return '20:00';
  
  // Handle AM/PM format
  if (time.includes('am') || time.includes('pm')) {
    const match = time.match(/(\d{1,2}):(\d{2})\s*([ap]m)/);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const period = match[3];
      
      if (period === 'pm' && hours !== 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;
      
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }
  
  return timeStr; // Return as-is if already in correct format
}

// Smart Recommendation Service using ML-like algorithms

export interface UserProfile {
  id: string;
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredEventTypes: string[];
  location?: string;
  preferOnline: boolean;
  pastEvents: string[];
  favoriteOrganizers: string[];
  timePreferences: {
    weekdays: boolean;
    weekends: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
  };
}

export interface RecommendationScore {
  eventId: string;
  score: number;
  reasons: string[];
  confidence: number;
}

export class RecommendationService {
  private static instance: RecommendationService;

  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  // Calculate recommendation score for an event based on user profile
  calculateRecommendationScore(event: any, userProfile: UserProfile): RecommendationScore {
    let score = 0;
    const reasons: string[] = [];
    let confidence = 0;

    // Interest matching (40% weight)
    const interestScore = this.calculateInterestScore(event, userProfile);
    score += interestScore.score * 0.4;
    reasons.push(...interestScore.reasons);
    confidence += interestScore.confidence * 0.4;

    // Skill level matching (20% weight)
    const skillScore = this.calculateSkillScore(event, userProfile);
    score += skillScore.score * 0.2;
    reasons.push(...skillScore.reasons);
    confidence += skillScore.confidence * 0.2;

    // Event type preference (15% weight)
    const typeScore = this.calculateTypeScore(event, userProfile);
    score += typeScore.score * 0.15;
    reasons.push(...typeScore.reasons);
    confidence += typeScore.confidence * 0.15;

    // Location/Online preference (10% weight)
    const locationScore = this.calculateLocationScore(event, userProfile);
    score += locationScore.score * 0.1;
    reasons.push(...locationScore.reasons);
    confidence += locationScore.confidence * 0.1;

    // Time preference (10% weight)
    const timeScore = this.calculateTimeScore(event, userProfile);
    score += timeScore.score * 0.1;
    reasons.push(...timeScore.reasons);
    confidence += timeScore.confidence * 0.1;

    // Organizer preference (5% weight)
    const organizerScore = this.calculateOrganizerScore(event, userProfile);
    score += organizerScore.score * 0.05;
    reasons.push(...organizerScore.reasons);
    confidence += organizerScore.confidence * 0.05;

    return {
      eventId: event.id,
      score: Math.min(score, 1), // Cap at 1.0
      reasons: reasons.filter(reason => reason.length > 0),
      confidence: Math.min(confidence, 1)
    };
  }

  private calculateInterestScore(event: any, userProfile: UserProfile) {
    const matchingInterests = event.tags.filter((tag: string) =>
      userProfile.interests.some(interest =>
        tag.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(tag.toLowerCase())
      )
    );

    const score = matchingInterests.length / Math.max(event.tags.length, userProfile.interests.length);
    const reasons = matchingInterests.length > 0 
      ? [`Matches your interests: ${matchingInterests.join(', ')}`]
      : [];

    return {
      score,
      reasons,
      confidence: matchingInterests.length > 0 ? 0.9 : 0.1
    };
  }

  private calculateSkillScore(event: any, userProfile: UserProfile) {
    const skillLevels = { beginner: 1, intermediate: 2, advanced: 3 };
    const userLevel = skillLevels[userProfile.skillLevel];
    const eventLevel = skillLevels[event.difficulty];

    let score = 0;
    let reason = '';

    if (userLevel === eventLevel) {
      score = 1.0;
      reason = `Perfect skill level match (${event.difficulty})`;
    } else if (Math.abs(userLevel - eventLevel) === 1) {
      score = 0.7;
      reason = `Good skill level fit (${event.difficulty})`;
    } else {
      score = 0.3;
      reason = `Different skill level (${event.difficulty})`;
    }

    return {
      score,
      reasons: [reason],
      confidence: 0.8
    };
  }

  private calculateTypeScore(event: any, userProfile: UserProfile) {
    const score = userProfile.preferredEventTypes.includes(event.type) ? 1.0 : 0.3;
    const reasons = score === 1.0 
      ? [`Matches your preferred event type: ${event.type}`]
      : [];

    return {
      score,
      reasons,
      confidence: 0.9
    };
  }

  private calculateLocationScore(event: any, userProfile: UserProfile) {
    let score = 0.5; // Default neutral score
    const reasons: string[] = [];

    if (event.isOnline && userProfile.preferOnline) {
      score = 1.0;
      reasons.push('Online event matches your preference');
    } else if (!event.isOnline && !userProfile.preferOnline) {
      if (userProfile.location && event.location.toLowerCase().includes(userProfile.location.toLowerCase())) {
        score = 1.0;
        reasons.push('Event is in your preferred location');
      } else {
        score = 0.6;
        reasons.push('In-person event');
      }
    } else if (event.isOnline && !userProfile.preferOnline) {
      score = 0.7;
      reasons.push('Online event (you prefer in-person)');
    } else {
      score = 0.4;
      reasons.push('In-person event (you prefer online)');
    }

    return {
      score,
      reasons,
      confidence: 0.7
    };
  }

  private calculateTimeScore(event: any, userProfile: UserProfile) {
    const eventDate = new Date(event.date);
    const dayOfWeek = eventDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const eventHour = parseInt(event.time.split(':')[0]);

    let score = 0.5;
    const reasons: string[] = [];

    // Check day preference
    if (isWeekend && userProfile.timePreferences.weekends) {
      score += 0.3;
      reasons.push('Weekend event matches your preference');
    } else if (!isWeekend && userProfile.timePreferences.weekdays) {
      score += 0.3;
      reasons.push('Weekday event matches your preference');
    }

    // Check time preference
    if (eventHour < 12 && userProfile.timePreferences.mornings) {
      score += 0.2;
      reasons.push('Morning time matches your preference');
    } else if (eventHour >= 12 && eventHour < 17 && userProfile.timePreferences.afternoons) {
      score += 0.2;
      reasons.push('Afternoon time matches your preference');
    } else if (eventHour >= 17 && userProfile.timePreferences.evenings) {
      score += 0.2;
      reasons.push('Evening time matches your preference');
    }

    return {
      score: Math.min(score, 1),
      reasons,
      confidence: 0.6
    };
  }

  private calculateOrganizerScore(event: any, userProfile: UserProfile) {
    const score = userProfile.favoriteOrganizers.includes(event.organizer) ? 1.0 : 0.5;
    const reasons = score === 1.0 
      ? [`Organized by ${event.organizer} (your favorite organizer)`]
      : [];

    return {
      score,
      reasons,
      confidence: score === 1.0 ? 0.9 : 0.1
    };
  }

  // Generate personalized recommendations
  async getPersonalizedRecommendations(
    events: any[], 
    userProfile: UserProfile, 
    limit: number = 10
  ): Promise<{ event: any; recommendation: RecommendationScore }[]> {
    const recommendations = events.map(event => ({
      event,
      recommendation: this.calculateRecommendationScore(event, userProfile)
    }));

    // Sort by score (descending) and confidence
    recommendations.sort((a, b) => {
      if (Math.abs(a.recommendation.score - b.recommendation.score) < 0.1) {
        return b.recommendation.confidence - a.recommendation.confidence;
      }
      return b.recommendation.score - a.recommendation.score;
    });

    return recommendations.slice(0, limit);
  }

  // Update user profile based on interactions
  updateUserProfile(userProfile: UserProfile, interactions: {
    addedEvents: string[];
    viewedEvents: string[];
    registeredEvents: string[];
  }): UserProfile {
    // This would typically involve ML algorithms to learn from user behavior
    // For now, we'll do simple updates

    const updatedProfile = { ...userProfile };

    // Add viewed events to past events
    updatedProfile.pastEvents = [
      ...new Set([...updatedProfile.pastEvents, ...interactions.viewedEvents])
    ];

    // Extract interests from registered events (simplified)
    // In a real system, this would use NLP and ML
    
    return updatedProfile;
  }

  // Create default user profile
  createDefaultProfile(userId: string): UserProfile {
    return {
      id: userId,
      interests: ['JavaScript', 'React', 'AI', 'Web Development'],
      skillLevel: 'intermediate',
      preferredEventTypes: ['hackathon', 'conference', 'workshop'],
      preferOnline: false,
      pastEvents: [],
      favoriteOrganizers: [],
      timePreferences: {
        weekdays: true,
        weekends: true,
        mornings: false,
        afternoons: true,
        evenings: true
      }
    };
  }
}

export interface RoutineLogMetrics {
  id: string;
  date: string;
  raw_text: string;
  workout_done: boolean;
  workout_focus: string | null;
  calories_estimated: number | null;
  protein_grams: number | null;
  study_or_coding_hours: number;
  habit_score: number;
  coach_feedback: string;
  morning_intention?: string | null;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aegis';
  text: string;
  timestamp: string;
  metrics?: RoutineLogMetrics;
  isLogEntry?: boolean;
}

export interface CoachApiResponse {
  success: boolean;
  coachFeedback: string;
  metrics: RoutineLogMetrics;
  rawAiText: string;
  error?: string;
}

export interface UserTargets {
  dailyCaloriesTarget: number;
  dailyProteinTarget: number;
  dailyStudyHoursTarget: number;
  weeklyWorkoutsTarget: number;
}

export interface UserSession {
  phoneNumber: string;
  countryCode: string;
  isLoggedIn: boolean;
  loginTime: number;
  fullName?: string;
  age?: number;
  weightKg?: number;
  targetWeightKg?: number;
  fitnessGoal?: string;
  experienceLevel?: string;
  activePlanId?: string;
  planName?: string;
  planExpiryDate?: string;
  hasCoachAccess?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  title: string;
  duration: string;
  priceRupees: number;
  originalPriceRupees?: number;
  isTrial?: boolean;
  isPopular?: boolean;
  isBestValue?: boolean;
  hasCoach: boolean;
  features: string[];
  badge?: string;
}

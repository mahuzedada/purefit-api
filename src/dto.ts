export interface UserInfo {
  gender: string;
  age_range: string;
  lifestyle: string;
  marital_status: string;
  number_of_kids: string;
  kids_age_ranges: string;
  allergies: string;
  preferred_cuisine: string;
  preferred_protein: string;
  preferred_fat: string;
  preferred_carbs: string;
  specific_diet: string;
  diet_goal: string;
  meals_per_day: string;
  time_for_cook: string;
  dietary_restrictions: string;
}

export interface DietRules {
  no_artificial_sugar: boolean;
  limited_salt: boolean;
  intermittent_fasting: string | boolean;
  reduced_portion: string | boolean;
  reduced_times_eating: string | boolean;
}

export interface DietPlanDTO {
  user_info: UserInfo;
  diet_rules: DietRules;
}

export class CreateMealPlanDTO {
  email: string;
  user_info: UserInfo;
  diet_rules: DietRules;
}

export interface GenerateDocsDTO {
  ide_selection: string[];
  languages_used: string[];
  frameworks_used: string[];
  doc_preference: string;
  preferred_doc_platforms: string[];
  search_first_choice: string;
  frequent_coding_concepts: string[];
  recent_queries: string[];
}

export interface CandidateAndJobInfoDto {
  firstName: string;
  lastName: string;
  resumeText: string;
  jdText: string;
  tone: 'Formal' | 'Friendly' | 'Enthusiastic';
}

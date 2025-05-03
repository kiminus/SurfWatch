// TypeScript interfaces based on user.py Pydantic models

/**
 * Represents user authentication data (typically not sent to frontend).
 * Corresponds to the Python UserAuth model.
 * Note: Be cautious about exposing hashed_password.
 */
export interface UserAuth {
  user_id: number;
  username: string;
  hashed_password: string; // Sensitive data, handle with care
}

/**
 * Represents user settings.
 * Corresponds to the Python UserSettings model.
 */
export interface UserSettings {
  user_id: number;
  show_streak?: boolean; // Defaults to true in Python, optional here
}

/**
 * Represents user preferences, specifically preferred sites.
 * Corresponds to the Python UserPreference model.
 */
export interface UserPreference {
  user_id: number;
  preferred_sites?: number[] | null; // Optional list of site IDs
}

/**
 * Represents the user profile information visible publicly.
 * Corresponds to the Python UserViewProfile model.
 */
export interface UserViewProfile {
  user_id: number;
  displayName: string;
  streak_days?: number; // Defaults to 0 in Python, optional here
  avatar_url?: string | null; // Optional field
}

/**
 * Represents the full user profile information, including private details.
 * Extends UserViewProfile.
 * Corresponds to the Python UserProfile model.
 */
export interface UserProfile extends UserViewProfile {
  email: string; // Sensitive data, handle with care
  preferences?: UserPreference | null; // Optional nested object
  settings?: UserSettings | null; // Optional nested object
}

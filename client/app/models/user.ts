// Generated from user.py

/**
 * Corresponds to UserAuth in Python
 */
export interface UserAuth {
  user_id: number;
  username: string;
  hashed_password: string;
}

/**
 * this is the form used to login
 * Corresponds to UserLogin in Python
 */
export interface UserLogin {
  username: string;
  password: string;
}

/**
 * this is the form used to register
 * Corresponds to UserRegister in Python
 */
export interface UserRegister {
  username: string;
  email: string;
  password: string;
  displayName?: string | null; // Optional field with default None maps to optional or null
}

/**
 * this profile is displayed in public
 * Corresponds to UserViewProfile in Python
 */
export interface UserViewProfile {
  user_id: number;
  display_name: string;
  streak_days?: number; // Optional field with default 0
  show_streak?: boolean;
  avatar_url?: string | null; // Optional field with default None maps to optional or null
}

/**
 * this profile is displayed in private
 * Corresponds to UserProfile in Python
 * Extends UserViewProfile
 */
export interface UserProfile extends UserViewProfile {
  email: string;
}

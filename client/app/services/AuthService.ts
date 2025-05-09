import ApiClient from './ApiClient';
import { AxiosError } from 'axios';

// --- Interfaces ---
import { UserProfile } from '../models/user';
import { UserLogin, UserRegister } from '../models/user';

// --- AuthService Class ---
export default {
  /**
   * fetches the current user profile from the server. if not cached
   * @returns {Promise<UserProfile | null>} - The user profile or null if not authenticated
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await ApiClient.get<UserProfile>('/users/me/');
      return response.data as unknown as UserProfile;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        console.log('No active session found (401).');
      } else {
        console.error('Error fetching current user:', axiosError.message);
      }
      return null;
    }
  },

  /**
   * Logs in a user and returns a session ID.
   * @param credentials - User credentials for login
   * @returns {Promise<string | null>} - The session ID or null if login failed
   */
  async login(credentials: UserLogin): Promise<string | void> {
    try {
      const response = await ApiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error; // Re-throw the error for the caller to handle
    }
  },

  /**
   * Logs out the current user and clears the session.
   * @param data - User registration data
   * @returns {Promise<string | null>} - The session ID or null if registration failed
   */
  async register(data: UserRegister): Promise<string | null> {
    try {
      const response = await ApiClient.post<{ session_id: string }>(
        '/auth/register',
        data
      );
      return response.data.session_id;
    } catch (error) {
      throw error; // Re-throw the error for the caller to handle
    }
  },
  /**
   * Logs out the current user and clears the session.
   */
  async logout(): Promise<void> {
    try {
      await ApiClient.post('/auth/logout');
      console.log('Logged out successfully.');
    } catch (error) {
      throw error; // Re-throw the error for the caller to handle
    }
  },
};

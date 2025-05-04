// context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../utils/apiClient'; // Adjust path if needed
import { AxiosError } from 'axios'; // Import AxiosError for typing

// --- Interfaces ---

// Define the UserProfile interface matching backend schemas.UserProfile
// Make sure this matches the structure returned by your /users/me and /auth/login endpoints
export interface UserProfile {
    id: number;
    username: string;
    email?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
    streak_days: number;
    show_streak: boolean;
    // Add any other fields returned by your UserProfile schema
}

// Define the shape of the context data and functions
interface AuthContextData {
  user: UserProfile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<UserProfile>; // Returns UserProfile on success
  logout: () => Promise<void>;
  register: (username: string, password: string, email?: string | null) => Promise<any>; // Returns backend response data
}

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode; // Use ReactNode for children prop type
}

// --- Context Creation ---

// Create the context with a default value (use type assertion for initial empty object)
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// --- AuthProvider Component ---

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  // Check auth status on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        // Specify expected response type for apiClient.get
        const response = await apiClient.get<UserProfile>('/users/me/');
        if (response.status === 200 && response.data) {
          setUser(response.data);
          console.log('Session valid, user:', response.data.username);
        } else {
          // This path might not be hit if API returns 401, which is caught below
          setUser(null);
        }
      } catch (error) {
        // Type the error as AxiosError or Error
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
            console.log('No active session found (401).');
        } else {
            console.error('Error checking session:', axiosError.message);
        }
        setUser(null); // Ensure user is null if session check fails
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Login function
  const login = async (username: string, password: string): Promise<UserProfile> => {
    try {
      // Specify expected response type for apiClient.post
      const response = await apiClient.post<UserProfile>('/auth/login', { username, password });
      if (response.status === 200 && response.data) {
        setUser(response.data);
        console.log('Login successful:', response.data.username);
        return response.data; // Return user profile on success
      } else {
        // This case might indicate an unexpected success status code
        throw new Error(`Login failed with status: ${response.status}`);
      }
    } catch (error) {
      setUser(null); // Clear user on login failure
      const axiosError = error as AxiosError;
      // Try to extract detail message from backend response
      const detail = (axiosError.response?.data as any)?.detail;
      console.error('Login Context Error:', detail || axiosError.message);
      throw error; // Re-throw for the screen to handle (pass the original error)
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
      console.log('Logout successful on backend.');
    } catch (error) {
       const axiosError = error as AxiosError;
       const detail = (axiosError.response?.data as any)?.detail;
       console.error('Logout Context Error:', detail || axiosError.message);
      // Optionally handle backend logout errors differently
    } finally {
      setUser(null); // Always clear user state locally
      console.log('Local user state cleared.');
    }
  };

  // Register function
  const register = async (username: string, password: string, email: string | null = null): Promise<any> => {
     try {
       // Construct payload carefully, omitting email if null/undefined
       const payload: { username: string; password: string; email?: string } = {
         username,
         password,
       };
       if (email) {
         payload.email = email;
       }

       // Assuming registration returns some data (e.g., the created user profile or a message)
       const response = await apiClient.post<any>('/auth/register', payload); // Use 'any' or a specific response type
       console.log('Registration successful (response data):', response.data);
       return response.data; // Return response data
     } catch (error) {
        const axiosError = error as AxiosError;
        const detail = (axiosError.response?.data as any)?.detail;
        console.error('Register Context Error:', detail || axiosError.message);
        throw error; // Re-throw for the screen to handle
     }
  };

  // Provide context value
  const contextValue: AuthContextData = {
      user,
      isLoading,
      login,
      logout,
      register
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
// Custom hook to consume the context
export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

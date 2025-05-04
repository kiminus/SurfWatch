// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

// Import your existing service and types
import { UserProfile, UserLogin, UserRegister } from '../models/user'; // Adjust path
import AuthService from '../services/AuthService';

const SESSION_STORAGE_KEY = 'userSessionId';

// Define Context shape
interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean; // Derived from user state
  isLoading: boolean; // Loading state for login/register/logout
  isAuthLoading: boolean; // Loading state for initial session check
  login: (credentials: UserLogin) => Promise<boolean>; // Returns true on success
  register: (data: UserRegister) => Promise<boolean>; // Returns true on success
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null); // Manage session ID state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // --- Helper: Function to fetch user profile (requires valid session) ---
  const fetchAndSetUser = useCallback(async (): Promise<UserProfile | null> => {
    // Assumes ApiClient is configured to use the current valid session ID
    const fetchedUser = await AuthService.getCurrentUser();
    setUser(fetchedUser); // Update user state
    return fetchedUser;
  }, []);
  // --- Initial Auth Check ---
  useEffect(() => {
    const checkSession = async () => {
      let storedSessionId: string | null = null;
      try {
        storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
        if (storedSessionId) {
          console.log('Found stored session ID.');
          setSessionId(storedSessionId);
          // If the session ID is stored as a cookie, it is typically sent automatically
          // with requests by the browser, provided the cookie domain and path match.
          // However, ensure your API client or fetch library does not override this behavior.
          await fetchAndSetUser(); // Attempt to fetch user with the stored session
        } else {
          console.log('No stored session ID found.');
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
        // Clear potentially invalid state/storage if error occurs
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionId(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkSession();
  }, [fetchAndSetUser]);

  // --- Login Logic ---
  const login = useCallback(
    async (credentials: UserLogin): Promise<boolean> => {
      setIsLoading(true);
      try {
        const newSessionId = await AuthService.login(credentials);

        if (newSessionId) {
          setSessionId(newSessionId);
          localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
          const fetchedUser = await fetchAndSetUser();
          setIsLoading(false);
          return !!fetchedUser; // Success if user profile was fetched
        } else {
          // Should not happen if AuthService throws error, but good practice
          throw new Error('Login did not return a session ID.');
        }
      } catch (error) {
        console.error('Login failed in context:', error);
        // Clear potentially bad session on login failure
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionId(null);
        setUser(null);
        setIsLoading(false);
        return false; // Indicate failure
      }
    },
    [fetchAndSetUser]
  );

  // --- Register Logic ---
  const register = useCallback(
    async (data: UserRegister): Promise<boolean> => {
      setIsLoading(true);
      try {
        // Call the service's register method
        const newSessionId = await AuthService.register(data);

        if (newSessionId) {
          // Store session ID
          setSessionId(newSessionId);
          localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
          // !!! IMPORTANT: Ensure ApiClient uses this session ID now !!!

          // Fetch user profile
          const fetchedUser = await fetchAndSetUser();
          setIsLoading(false);
          return !!fetchedUser; // Success if user profile was fetched
        } else {
          throw new Error('Register did not return a session ID.');
        }
      } catch (error) {
        console.error('Register failed in context:', error);
        // Clear potentially bad session on register failure
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionId(null);
        setUser(null);
        setIsLoading(false);
        return false; // Indicate failure
      }
    },
    [fetchAndSetUser]
  );

  // --- Logout Logic ---
  const logout = useCallback(async () => {
    setIsLoading(true); // Optional: show loader
    console.log('Logging out...');
    try {
      await AuthService.logout();
      // Clear session ID from state and storage
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setSessionId(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      await localStorage.removeItem(SESSION_STORAGE_KEY);
      setSessionId(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Derived State & Context Value ---
  const isLoggedIn = !!user; // Determine login status based on having user data

  const contextValue = useMemo(
    () => ({
      user,
      isLoggedIn,
      isLoading,
      isAuthLoading,
      login,
      register,
      logout,
    }),
    [user, isLoggedIn, isLoading, isAuthLoading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

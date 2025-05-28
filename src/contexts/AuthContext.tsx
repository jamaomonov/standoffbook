import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import defaultAvatar from '../assets/default-avatar.jpg';

// Define the authentication providers we support
export type AuthProvider = 'steam' | 'google' | 'telegram';

// Define the User type
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  provider: AuthProvider;
  providerId: string;
  tradeLink?: string;
  memberSince: string; // ISO date string
}

// Define the Auth context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authWithProvider: (provider: AuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<User>;
}

// Create the Auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'steam_user',
    displayName: 'Steam Player',
    avatar: defaultAvatar,
    provider: 'steam',
    providerId: '76561198030327391',
    tradeLink: 'https://steamcommunity.com/tradeoffer/new/?partner=12345678&token=abcdef',
    memberSince: '2023-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    username: 'google_user',
    displayName: 'Google User',
    avatar: defaultAvatar,
    provider: 'google',
    providerId: 'google123456',
    memberSince: '2023-02-20T00:00:00.000Z'
  },
  {
    id: '3',
    username: 'telegram_user',
    displayName: 'Telegram User',
    avatar: defaultAvatar,
    provider: 'telegram',
    providerId: 'telegram987654',
    memberSince: '2023-03-10T00:00:00.000Z'
  }
];

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is already logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('csm_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('csm_user');
      }
    }
    setLoading(false);
  }, []);

  // Authenticate with provider (Steam, Google, Telegram)
  const authWithProvider = async (provider: AuthProvider): Promise<void> => {
    setLoading(true);

    // In a real app, this would redirect to the OAuth provider
    // For mock purposes, we'll simulate successful authentication

    return new Promise((resolve, reject) => {
      // Simulate OAuth flow delay
      setTimeout(() => {
        try {
          // Find a mock user with the selected provider
          const user = MOCK_USERS.find(u => u.provider === provider);

          if (user) {
            setCurrentUser(user);
            localStorage.setItem('csm_user', JSON.stringify(user));
            setLoading(false);
            resolve();
          } else {
            // If no user exists for this provider, create a new one
            const newUser: User = {
              id: Math.random().toString(36).substring(2, 11),
              username: `${provider}_${Math.random().toString(36).substring(2, 7)}`,
              displayName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
              avatar: defaultAvatar,
              provider: provider,
              providerId: `${provider}${Math.random().toString().substring(2, 10)}`,
              memberSince: new Date().toISOString()
            };

            MOCK_USERS.push(newUser);
            setCurrentUser(newUser);
            localStorage.setItem('csm_user', JSON.stringify(newUser));
            setLoading(false);
            resolve();
          }
        } catch (error) {
          setLoading(false);
          reject(error);
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = async (): Promise<void> => {
    localStorage.removeItem('csm_user');
    setCurrentUser(null);
    return Promise.resolve();
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
    setLoading(true);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          setLoading(false);
          reject(new Error('Not authenticated'));
          return;
        }

        // Find the user in mock data
        const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
          setLoading(false);
          reject(new Error('User not found'));
          return;
        }

        // Update user data (only allowed fields)
        const updatedUser = {
          ...MOCK_USERS[userIndex],
          displayName: userData.displayName || MOCK_USERS[userIndex].displayName,
          tradeLink: userData.tradeLink || MOCK_USERS[userIndex].tradeLink,
        };

        MOCK_USERS[userIndex] = updatedUser;

        // Update stored user
        setCurrentUser(updatedUser);
        localStorage.setItem('csm_user', JSON.stringify(updatedUser));
        setLoading(false);
        resolve(updatedUser);
      }, 1000);
    });
  };

  const value = {
    currentUser,
    loading,
    authWithProvider,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook separately from the context export
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

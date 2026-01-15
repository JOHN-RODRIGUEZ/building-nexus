import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  theme: Theme;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setTheme: (theme: Theme) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      theme: 'system',
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (email && password) {
          set({
            isAuthenticated: true,
            user: {
              id: '1',
              name: 'Admin User',
              email: email,
              role: 'admin',
            },
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
      
      setTheme: (theme: Theme) => {
        set({ theme });
        
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

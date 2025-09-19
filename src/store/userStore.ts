import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types/Message';

interface UserState {
  isAuthenticated: boolean;
  role: UserRole;
  username: string;
  
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: 'user',
      username: '',

      login: async (username: string, password: string) => {
        // Мок авторизации - любые данные проходят
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Определяем роль по логину (для демо)
        const role: UserRole = username.toLowerCase().includes('admin') ? 'admin' : 'user';
        
        set({
          isAuthenticated: true,
          username,
          role,
        });
        
        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          username: '',
          role: 'user',
        });
      },

      setRole: (role) => set({ role }),
    }),
    {
      name: 'rmk-user-storage',
    }
  )
);
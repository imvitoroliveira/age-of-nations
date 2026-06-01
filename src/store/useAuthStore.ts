import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  profile: any | null;
  partner: any | null;
  setProfile: (profile: any) => void;
  setPartner: (partner: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      partner: null,
      setProfile: (profile) => set({ profile }),
      setPartner: (partner) => set({ partner }),
      clearAuth: () => set({ profile: null, partner: null }),
    }),
    {
      name: 'fitcouple-auth',
    }
  )
);

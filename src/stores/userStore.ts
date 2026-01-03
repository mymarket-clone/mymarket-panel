import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserStore } from '../types/User'

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      setUser: (data) => set(() => ({ ...data })),
      clearUser: () =>
        set(() => ({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          user: null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

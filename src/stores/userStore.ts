import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserStore } from '../types/User'

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
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
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      getAccessToken: () => get().accessToken,
      setRefreshToken: (token: string | null) => set({ refreshToken: token }),
      getRefreshToken: () => get().refreshToken,
    }),
    {
      name: 'auth-storage',
    }
  )
)

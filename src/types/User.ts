export type User = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: {
    id: number
    name: string
    lastname: string
    email: string
    emailVerified: boolean
  }
}

export type UserStore = {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string | null
  user: {
    id: number
    name: string
    lastname: string
    email: string
    emailVerified: boolean
  } | null
  setUser: (data: {
    accessToken: string
    refreshToken: string
    expiresAt: string
    user: UserStore['user']
  }) => void
  clearUser: () => void
}

export type AdminUserRow = {
  id: number
  firstname: string
  lastname: string
  email: string
  gender: number
  birthYear: number
  phoneNumber: string
  emailVerified: boolean
  isBlocked: boolean
  accessLevel: number
  balance: number
  postsCount: number
  createdAt: string
  updatedAt?: string | null
}

export type AdminUserFormValues = {
  firstname: string
  lastname: string
  email: string
  gender: number
  birthYear: number
  phoneNumber: string
  password?: string
  emailVerified: boolean
  isBlocked?: boolean
  isSuperAdmin?: boolean
}

export type AdminUsersQuery = {
  page: number
  pageSize: number
  search?: string
  isBlocked?: boolean
}

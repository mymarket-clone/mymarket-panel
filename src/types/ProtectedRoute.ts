import type { ReactNode } from 'react'

export type ProtectedRouteProps = {
  children: ReactNode
  redirectTo?: string
  guard: boolean
}

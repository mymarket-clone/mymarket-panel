import type { ReactNode } from 'react'
import type { PermissionsType } from './enums/PermissionsType'

export type ProtectedRouteProps = {
  children: ReactNode
  redirectTo?: string
  guard: boolean
  permissions?: PermissionsType | PermissionsType[]
  superAdminRequired?: boolean
}

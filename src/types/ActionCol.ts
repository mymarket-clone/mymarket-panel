import type { ReactNode } from 'react'
import type { PermissionsType } from './enums/PermissionsType'

export type ActionPermissions = {
  add?: PermissionsType | PermissionsType[]
  edit?: PermissionsType | PermissionsType[]
  delete?: PermissionsType | PermissionsType[]
}

export type ActionColExtraAction<T extends { id: number }> = {
  key: string
  title: string
  icon: ReactNode
  onClick: (record: T) => void
  danger?: boolean
  permission?: PermissionsType | PermissionsType[]
  superAdminRequired?: boolean
}

export type ActionColProps<TExtra = unknown> = {
  onAdd: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  actionPermissions?: ActionPermissions
  userPermissions?: PermissionsType[]
  isSuperAdmin?: boolean
  superAdminRequired?: boolean
  extraActions?: ActionColExtraAction<{ id: number }>[]
} & TExtra

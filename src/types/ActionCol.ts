import type { PermissionsType } from './enums/PermissionsType'

export type ActionPermissions = {
  add?: PermissionsType | PermissionsType[]
  edit?: PermissionsType | PermissionsType[]
  delete?: PermissionsType | PermissionsType[]
}

export type ActionColProps<TExtra = unknown> = {
  onAdd: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  actionPermissions?: ActionPermissions
  userPermissions?: PermissionsType[]
  isSuperAdmin?: boolean
  superAdminRequired?: boolean
} & TExtra

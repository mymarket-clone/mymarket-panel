import type { PermissionsType } from '../types/enums/PermissionsType'

export const hasPermission = (
  routePermission: PermissionsType | PermissionsType[],
  userPermissions: PermissionsType[]
) => {
  const required = Array.isArray(routePermission) ? routePermission : [routePermission]

  return required.some((p) => userPermissions.includes(p))
}

import { AccessLevelType } from '../types/enums/AccessLevelType'
import { decodeJwt } from './decodeJwt'

export const getAccessLevel = (token: string): AccessLevelType | null => {
  const accessLevel = Number(decodeJwt(token).al)

  return Number.isNaN(accessLevel) ? null : accessLevel
}

export const isSuperAdmin = (token?: string | null) => {
  if (!token) return false

  return getAccessLevel(token) === AccessLevelType.SuperAdmin
}

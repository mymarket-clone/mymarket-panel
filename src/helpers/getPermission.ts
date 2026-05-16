import { PermissionsType } from '../types/enums/PermissionsType'
import { decodeJwt } from './decodeJwt'

export const getPermissions = (token: string): PermissionsType[] => {
  const prm = decodeJwt(token).prm
  const raw = Array.isArray(prm) ? prm : [prm]

  return raw.map(Number).filter((n) => !isNaN(n))
}

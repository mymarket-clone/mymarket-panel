import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '../types/JwtPayload'

export const decodeJwt = (token: string) => jwtDecode<JwtPayload>(token)

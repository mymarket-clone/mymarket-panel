export interface JwtPayload {
  id: string
  un: string
  em: string
  al: string
  prm: string | string[]
  nbf: number
  exp: number
  iss: string
  aud: string
}

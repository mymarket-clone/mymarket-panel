export interface IBaseError {
  type: string
  title: string
  status: number
  instance: string
  errors: Record<string, string[]>
  code: string
  email?: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, PropsWithChildren } from 'react'

export type Route = {
  path: string
  label?: string
  view?: React.ComponentType<any>
  children?: Route[]
  provider?: ComponentType<PropsWithChildren>
  guard?: boolean
  redirectTo?: string | ((options?: unknown) => string)
}

import type { ColumnType } from 'antd/es/table'
import type { LookupConfig } from './LookupConfig'

export interface CustomColumnType<T> extends ColumnType<T> {
  required?: boolean
  type?: 'string' | 'password' | 'number' | 'boolean' | 'lookup' | 'enum' | 'file' | 'nullableBoolean'
  lookup?: LookupConfig
  lookupData?: unknown[]
  enumObj?: Record<string | number, string>
  tree?: boolean
}

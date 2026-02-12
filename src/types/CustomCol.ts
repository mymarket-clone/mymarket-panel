import type { ColumnType } from 'antd/es/table'

export interface CustomColumnType<T> extends ColumnType<T> {
  required?: boolean
}

import { Table } from 'antd'

import type { Category, CategoryAttribute } from '../../type'
import type { Attribute } from '../../../attributes/type'
import type { ActionColProps } from '../../../../types/ActionCol'
import { CategoryAttributesColumns } from './CategoryAttributesColumns'

type Props = {
  data: CategoryAttribute[]
  loading: boolean
  attributes: Attribute[]
  categories: Category[]
} & ActionColProps

const CategoryAttributesTable = ({
  data,
  loading,
  onAdd,
  onDelete,
  onEdit,
  attributes,
  categories,
}: Props) => {
  return (
    <Table
      bordered
      rowKey="id"
      columns={CategoryAttributesColumns({ onAdd, onDelete, onEdit, attributes, categories })}
      dataSource={data}
      loading={loading}
      pagination={false}
      scroll={{ y: 500 }}
      style={{ paddingBlock: 12 }}
    />
  )
}
export default CategoryAttributesTable

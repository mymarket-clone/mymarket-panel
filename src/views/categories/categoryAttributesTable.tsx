import { Table } from 'antd'
import { categoryAttributesColumns } from './categoryAttributesColumns'
import type { Category, CategoryAttribute } from './type'
import type { ActionColProps } from '../../types/ActionCol'
import type { Attribute } from '../attributes/type'

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
      columns={categoryAttributesColumns({ onAdd, onDelete, onEdit, attributes, categories })}
      dataSource={data}
      loading={loading}
      pagination={false}
      scroll={{ y: 500 }}
      style={{ paddingBlock: 12 }}
    />
  )
}
export default CategoryAttributesTable

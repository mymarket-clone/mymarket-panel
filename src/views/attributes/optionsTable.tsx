import { Table } from 'antd'
import type { AttributeOption } from './type'
import type { ActionColProps } from '../../types/ActionCol'
import { optionColumns } from './optionsColumns'

type Props = {
  data: AttributeOption[]
  loading: boolean
} & ActionColProps

const AttributeOptionsTable = ({
  data,
  loading,
  onAdd,
  onDelete,
  onEdit,
  userPermissions,
  isSuperAdmin,
}: Props) => {
  return (
    <Table
      bordered
      rowKey="id"
      columns={optionColumns({ onAdd, onDelete, onEdit, userPermissions, isSuperAdmin })}
      dataSource={data}
      loading={loading}
      pagination={false}
      scroll={{ y: 500 }}
    />
  )
}
export default AttributeOptionsTable

import { Table } from 'antd'
import type { AttributeOption } from './type'
import type { ActionColProps } from '../../types/ActionCol'
import { optionColumns } from './optionsColumns'

type Props = {
  data: AttributeOption[]
  loading: boolean
} & ActionColProps

const AttributeOptionsTable = ({ data, loading, onAdd, onDelete, onEdit }: Props) => {
  return (
    <Table
      columns={optionColumns({ onAdd, onDelete, onEdit })}
      dataSource={data}
      loading={loading}
      pagination={false}
      scroll={{ y: 500 }}
    />
  )
}
export default AttributeOptionsTable

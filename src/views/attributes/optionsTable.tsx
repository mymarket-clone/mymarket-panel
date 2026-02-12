import { Table } from 'antd'
import type { AttributeOption } from './type'
import { optionColumns, type ColumnsProps } from './optionsColumns'

type Props = {
  data: AttributeOption[]
  loading: boolean
} & ColumnsProps

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

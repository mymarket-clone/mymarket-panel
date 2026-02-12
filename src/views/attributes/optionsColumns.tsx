import type { AttributeOption } from './type'
import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'

export type ColumnsProps = {
  onAdd: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const optionColumns = ({
  onAdd,
  onEdit,
  onDelete,
}: ColumnsProps): CustomColumnType<AttributeOption>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      type: 'number',
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      required: true,
      type: 'number',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      required: true,
      type: 'string',
    },
    {
      title: 'NameEn',
      dataIndex: 'nameEn',
      key: 'nameEn',
      type: 'string',
      render: (v) => v || '-',
    },
    {
      title: 'NameRu',
      dataIndex: 'nameRu',
      key: 'nameRu',
      type: 'string',
      render: (v) => v || '-',
    },
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

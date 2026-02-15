import type { AttributeOption } from './type'
import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { ActionColProps } from '../../types/ActionCol'

export const optionColumns = ({
  onAdd,
  onEdit,
  onDelete,
}: ActionColProps): CustomColumnType<AttributeOption>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      type: 'number',
      width: 50,
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      required: true,
      type: 'number',
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      required: true,
      type: 'string',
      width: 200,
    },
    {
      title: 'NameEn',
      dataIndex: 'nameEn',
      key: 'nameEn',
      type: 'string',
      render: (v) => v || '-',
      width: 200,
    },
    {
      title: 'NameRu',
      dataIndex: 'nameRu',
      key: 'nameRu',
      type: 'string',
      render: (v) => v || '-',
      width: 200,
    },
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

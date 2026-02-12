import type { Attribute } from './type'
import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'

export type ColumnsProps = {
  onAdd: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const columns = ({ onAdd, onEdit, onDelete }: ColumnsProps): CustomColumnType<Attribute>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      required: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      required: true,
    },
    {
      title: 'NameEn',
      dataIndex: 'nameEn',
      key: 'nameEn',
      required: true,
    },
    {
      title: 'NameRu',
      dataIndex: 'nameRu',
      key: 'nameRu',
      required: true,
    },
    {
      title: 'Type',
      dataIndex: 'attributeType',
      key: 'attributeType',
      required: true,
    },
    {
      title: 'Unit',
      dataIndex: 'unitId',
      key: 'unitId',
      required: true,
    },
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

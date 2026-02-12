import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { Unit } from './type'

export type ColumnsProps = {
  onAdd: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const columns = ({ onAdd, onEdit, onDelete }: ColumnsProps): CustomColumnType<Unit>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
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
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

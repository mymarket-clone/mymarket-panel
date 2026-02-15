import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { Category } from './type'
import { getEnumLabels } from '../../utils/getEnumlabels'
import { CategoryPostType } from '../../types/enums/CategoryPostType'

type CategoryExtras = {
  categories: Category[]
}

export const columns = ({
  onAdd,
  onEdit,
  onDelete,
  categories,
}: ActionColProps<CategoryExtras>): CustomColumnType<Category>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Parent',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 200,
      type: 'lookup',
      lookupData: categories,
      lookup: { label: 'name', value: 'id' },
      render: (_, record) => {
        const attr = categories.find((a) => a.id === record.parentId)
        return attr?.name ?? record.parentId ?? '-'
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      required: true,
      width: 200,
    },
    {
      title: 'NameEn',
      dataIndex: 'nameEn',
      key: 'nameEn',
      required: true,
      width: 200,
      render: (v) => v || '-',
    },
    {
      title: 'NameRu',
      dataIndex: 'nameRu',
      key: 'nameRu',
      required: true,
      width: 200,
      render: (v) => v || '-',
    },
    {
      title: 'Type',
      dataIndex: 'categoryPostType',
      key: 'categoryPostType',
      type: 'enum',
      width: 200,
      enumObj: getEnumLabels(CategoryPostType),
      render: (v: number) => getEnumLabels(CategoryPostType)[v] ?? 'Unknown',
      required: true,
    },
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

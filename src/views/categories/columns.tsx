import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { Category } from './type'
import { getEnumLabels } from '../../utils/getEnumlabels'
import { CategoryPostType } from '../../types/enums/CategoryPostType'
import { Img, ImgWrapper } from '../brands/styles'

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
      title: '',
      key: 'expand',
      width: 40,
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Parent',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 200,
      type: 'lookup',
      lookupData: categories,
      tree: true,
      lookup: { label: 'name', value: 'id' },
      render: (_, record) => {
        const attr = categories.find((a) => a.id === record.parentId)
        return attr?.name ?? record.parentId ?? '-'
      },
      sorter: (a, b) => (a.parentId ?? 0) - (b.parentId ?? 0),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      required: true,
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 100,
      type: 'file',
      render: (v) => <ImgWrapper>{v ? <Img src={v} /> : '-'}</ImgWrapper>,
    },
    {
      title: 'BrandRequired',
      dataIndex: 'brandRequired',
      key: 'brandRequired',
      type: 'boolean',
      width: 120,
      render: (v) => (v === true ? 'True' : v === false ? 'False' : 'Unset'),
    },
    {
      title: 'BrandVisible',
      dataIndex: 'brandVisible',
      key: 'brandVisible',
      type: 'boolean',
      width: 120,
      render: (v) => (v === true ? 'True' : v === false ? 'False' : 'Unset'),
    },
    {
      title: 'Type',
      dataIndex: 'categoryPostType',
      key: 'categoryPostType',
      type: 'enum',
      width: 100,
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

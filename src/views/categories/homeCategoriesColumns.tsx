import type { HomeCategory } from '.'
import type { CustomColumnType } from '../../types/CustomCol'
import type { Category } from './type'

export const homeCategoriesColumns = ({
  categories,
}: {
  categories: Category[]
}): CustomColumnType<HomeCategory>[] => {
  return [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 100,
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 200,
      type: 'lookup',
      lookupData: categories,
      tree: true,
      lookup: { label: 'name', value: 'id' },
      render: (_, record) => {
        const attr = categories.find((a) => a.id === record.categoryId)
        return attr?.name ?? '-'
      },
      sorter: (a, b) => (a.categoryId ?? 0) - (b.categoryId ?? 0),
    },
  ]
}

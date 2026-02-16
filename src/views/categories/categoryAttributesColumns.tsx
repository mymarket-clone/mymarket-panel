import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { Category, CategoryAttribute } from './type'
import type { Attribute } from '../attributes/type'

type CategoryAttributeExtras = {
  attributes: Attribute[]
  categories: Category[]
}

export const categoryAttributesColumns = ({
  onAdd,
  onEdit,
  onDelete,
  attributes,
  categories,
}: ActionColProps<CategoryAttributeExtras>): CustomColumnType<CategoryAttribute>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      type: 'number',
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      type: 'lookup',
      width: 200,
      required: true,
      lookupData: categories,
      lookup: { label: 'name', value: 'id' },
      render: (_, record) => {
        const attr = categories.find((a) => a.id === record.categoryId)
        return attr?.name ?? record.categoryId ?? '-'
      },
    },
    {
      title: 'Attribute',
      dataIndex: 'attributeId',
      key: 'attributeId',
      type: 'lookup',
      width: 200,
      required: true,
      lookupData: attributes,
      lookup: { label: 'name', value: 'id' },
      render: (_, record) => {
        const attr = attributes.find((a) => a.id === record.attributeId)
        return attr?.name ?? record.attributeId ?? '-'
      },
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 200,
      type: 'number',
      required: true,
    },
    {
      title: 'Required',
      dataIndex: 'isRequired',
      key: 'isRequired',
      width: 200,
      type: 'boolean',
      render: (v) => (v ? 'Yes' : 'No'),
    },
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

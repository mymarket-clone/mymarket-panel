import { ActionCol } from '../../../../components/ActionCol'
import type { ActionColProps } from '../../../../types/ActionCol'
import type { CustomColumnType } from '../../../../types/CustomCol'
import { PermissionsType } from '../../../../types/enums/PermissionsType'
import type { Attribute } from '../../../attributes/type'
import type { Category, CategoryAttribute } from '../../type'

type CategoryAttributeExtras = {
  attributes: Attribute[]
  categories: Category[]
}

export const CategoryAttributesColumns = ({
  onAdd,
  onEdit,
  onDelete,
  attributes,
  categories,
  userPermissions,
  isSuperAdmin,
}: ActionColProps<CategoryAttributeExtras>): CustomColumnType<CategoryAttribute>[] => {
  const cols: CustomColumnType<CategoryAttribute>[] = [
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
  ]

  const actionCol = ActionCol<CategoryAttribute>({
    onAdd,
    onEdit,
    onDelete,
    userPermissions,
    isSuperAdmin,
    actionPermissions: {
      add: PermissionsType.CategoriesEdit,
      edit: PermissionsType.CategoriesEdit,
      delete: PermissionsType.CategoriesEdit,
    },
  })

  if (actionCol) cols.push(actionCol)

  return cols
}

import type { AttributeOption } from './type'
import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { ActionColProps } from '../../types/ActionCol'
import { PermissionsType } from '../../types/enums/PermissionsType'

export const optionColumns = ({
  onAdd,
  onEdit,
  onDelete,
  userPermissions,
  isSuperAdmin,
}: ActionColProps): CustomColumnType<AttributeOption>[] => {
  const cols: CustomColumnType<AttributeOption>[] = [
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
  ]

  const actionCol = ActionCol<AttributeOption>({
    onAdd,
    onEdit,
    onDelete,
    userPermissions,
    isSuperAdmin,
    actionPermissions: {
      add: PermissionsType.AttributeAdd,
      edit: PermissionsType.AttributeEdit,
      delete: PermissionsType.AttributeDelete,
    },
  })

  if (actionCol) cols.push(actionCol)

  return cols
}

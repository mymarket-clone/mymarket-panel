import { ActionCol } from '../../components/ActionCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import { PermissionsType } from '../../types/enums/PermissionsType'
import type { Unit } from './type'

export const columns = ({
  onAdd,
  onEdit,
  onDelete,
  userPermissions,
  isSuperAdmin,
}: ActionColProps): CustomColumnType<Unit>[] => {
  const cols: CustomColumnType<Unit>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
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
    },
    {
      title: 'NameRu',
      dataIndex: 'nameRu',
      key: 'nameRu',
      required: true,
      width: 200,
    },
  ]

  const actionCol = ActionCol<Unit>({
    onAdd,
    onEdit,
    onDelete,
    userPermissions,
    isSuperAdmin,
    actionPermissions: {
      add: PermissionsType.UnitsAdd,
      edit: PermissionsType.UnitsEdit,
      delete: PermissionsType.UnitsDelete,
    },
  })

  if (actionCol) cols.push(actionCol)

  return cols
}

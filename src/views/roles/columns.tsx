import { ActionCol } from '../../components/ActionCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { Role } from './type'

export const columns = ({
  onAdd,
  onEdit,
  onDelete,
  isSuperAdmin,
}: ActionColProps): CustomColumnType<Role>[] => {
  const cols: CustomColumnType<Role>[] = [
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
  ]

  const actionCol = ActionCol<Role>({
    onAdd,
    onEdit,
    onDelete,
    isSuperAdmin,
    superAdminRequired: true,
  })

  if (actionCol) cols.push(actionCol)

  return cols
}

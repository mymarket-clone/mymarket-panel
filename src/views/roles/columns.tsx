import { SettingOutlined } from '@ant-design/icons'
import { ActionCol } from '../../components/ActionCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import type { Role } from './type'

type RoleColumnExtras = {
  onPermissions: (id: number) => void
}

export const columns = ({
  onAdd,
  onEdit,
  onDelete,
  isSuperAdmin,
  onPermissions,
}: ActionColProps<RoleColumnExtras>): CustomColumnType<Role>[] => {
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
    extraActions: [
      {
        key: 'permissions',
        title: 'Permissions',
        icon: <SettingOutlined />,
        onClick: (record) => onPermissions(record.id),
        superAdminRequired: true,
      },
    ],
  })

  if (actionCol) cols.push(actionCol)

  return cols
}

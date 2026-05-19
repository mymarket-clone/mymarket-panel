import { StopOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { ActionCol } from '../../components/ActionCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import { AccessLevelType } from '../../types/enums/AccessLevelType'
import { PermissionsType } from '../../types/enums/PermissionsType'
import type { AdminUserFormValues, AdminUserRow } from './type'

const genderLabels: Record<number, string> = {
  1: 'Male',
  2: 'Female',
}

const accessLevelLabels: Record<number, string> = {
  [AccessLevelType.User]: 'User',
  [AccessLevelType.Admin]: 'Admin',
  [AccessLevelType.SuperAdmin]: 'Super admin',
}

type UserColumnExtras = {
  onBlock: (record: AdminUserRow) => void
  onSuperAdmin: (record: AdminUserRow) => void
}

export const userFormColumns = (editing: boolean): CustomColumnType<AdminUserFormValues>[] => [
  {
    title: 'First name',
    dataIndex: 'firstname',
    key: 'firstname',
    type: 'string',
    required: true,
  },
  {
    title: 'Last name',
    dataIndex: 'lastname',
    key: 'lastname',
    type: 'string',
    required: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    type: 'string',
    required: true,
  },
  {
    title: 'Phone',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    type: 'string',
    required: true,
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    type: 'enum',
    enumObj: genderLabels,
    required: true,
  },
  {
    title: 'Birth year',
    dataIndex: 'birthYear',
    key: 'birthYear',
    type: 'number',
    required: true,
  },
  ...(!editing
    ? [
        {
          title: 'Password',
          dataIndex: 'password',
          key: 'password',
          type: 'password' as const,
          required: true,
        },
      ]
    : []),
  {
    title: 'Verified',
    dataIndex: 'emailVerified',
    key: 'emailVerified',
    type: 'boolean',
  },
  ...(!editing
    ? [
        {
          title: 'Blocked',
          dataIndex: 'isBlocked',
          key: 'isBlocked',
          type: 'boolean' as const,
        },
        {
          title: 'Super admin',
          dataIndex: 'isSuperAdmin',
          key: 'isSuperAdmin',
          type: 'boolean' as const,
        },
      ]
    : []),
]

export const columns = ({
  onAdd,
  onEdit,
  onDelete,
  onBlock,
  onSuperAdmin,
  userPermissions,
  isSuperAdmin,
}: ActionColProps<UserColumnExtras>): CustomColumnType<AdminUserRow>[] => {
  const cols: CustomColumnType<AdminUserRow>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'First name',
      dataIndex: 'firstname',
      key: 'firstname',
      width: 140,
    },
    {
      title: 'Last name',
      dataIndex: 'lastname',
      key: 'lastname',
      width: 140,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 240,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 160,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 110,
      render: (value: number) => genderLabels[value] ?? value,
    },
    {
      title: 'Birth year',
      dataIndex: 'birthYear',
      key: 'birthYear',
      width: 110,
    },
    {
      title: 'Verified',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      width: 100,
      render: (value: boolean) => (
        <Tag color={value ? 'success' : 'default'}>{value ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Blocked',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      width: 100,
      render: (value: boolean) => (
        <Tag color={value ? 'error' : 'success'}>{value ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Access',
      dataIndex: 'accessLevel',
      key: 'accessLevel',
      width: 130,
      render: (value: number) => (
        <Tag color={value === AccessLevelType.SuperAdmin ? 'gold' : 'blue'}>
          {accessLevelLabels[value] ?? value}
        </Tag>
      ),
    },
    {
      title: 'Posts',
      dataIndex: 'postsCount',
      key: 'postsCount',
      width: 90,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (value: string) => (value ? new Date(value).toLocaleString() : ''),
    },
  ]

  const actionCol = ActionCol<AdminUserRow>({
    onAdd,
    onEdit,
    onDelete,
    userPermissions,
    isSuperAdmin,
    actionPermissions: {
      add: PermissionsType.UsersAdd,
      edit: PermissionsType.UsersEdit,
      delete: PermissionsType.UsersDelete,
    },
    extraActions: [
      {
        key: 'block',
        title: 'Block / unblock',
        icon: <StopOutlined />,
        danger: true,
        permission: PermissionsType.UsersBlock,
        onClick: (record) => onBlock(record as AdminUserRow),
      },
      {
        key: 'superadmin',
        title: 'Toggle super admin',
        icon: <UserSwitchOutlined />,
        superAdminRequired: true,
        onClick: (record) => onSuperAdmin(record as AdminUserRow),
      },
    ],
  })

  if (actionCol) cols.push({ ...actionCol, fixed: 'right', width: 180 })

  return cols
}

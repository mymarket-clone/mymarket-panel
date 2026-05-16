import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { ActionColProps } from '../types/ActionCol'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { hasPermission } from '../helpers/hasPermission'
import type { PermissionsType } from '../types/enums/PermissionsType'

export const ActionCol = <T extends { id: number }>({
  onAdd,
  onEdit,
  onDelete,
  actionPermissions,
  userPermissions,
  isSuperAdmin,
  superAdminRequired,
}: ActionColProps): ColumnType<T> | null => {
  const canUseAction = (permission?: PermissionsType | PermissionsType[]) => {
    if (superAdminRequired) return Boolean(isSuperAdmin)
    if (isSuperAdmin) return true
    if (!permission) return true
    return hasPermission(permission, userPermissions ?? [])
  }

  const canAdd = canUseAction(actionPermissions?.add)
  const canEdit = canUseAction(actionPermissions?.edit)
  const canDelete = canUseAction(actionPermissions?.delete)

  if (!canAdd && !canEdit && !canDelete) return null

  return {
    title: (
      <Space size="small">
        <span>Actions</span>
        {canAdd && (
          <Tooltip title="Add">
            <Button
              size="small"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                onAdd()
              }}
            />
          </Tooltip>
        )}
      </Space>
    ),
    key: 'actions',
    render: (_: unknown, record: T) => (
      <Space>
        {canEdit && (
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                onEdit(record.id)
              }}
            />
          </Tooltip>
        )}

        {canDelete && (
          <Popconfirm
            title="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={(e) => {
              e?.stopPropagation()
              onDelete(record.id)
            }}
            onCancel={(e) => e?.stopPropagation()}
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
            </Tooltip>
          </Popconfirm>
        )}
      </Space>
    ),
  }
}

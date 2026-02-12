import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { ActionColProps } from '../types/ActionCol'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import type { ColumnType } from 'antd/es/table'

export const ActionCol = <T extends { id: number }>({
  onAdd,
  onEdit,
  onDelete,
}: ActionColProps): ColumnType<T> => ({
  title: (
    <>
      <span>Actions</span>
      <Tooltip title="Add">
        <Button
          style={{ marginLeft: 7 }}
          size="small"
          icon={<PlusCircleOutlined />}
          onClick={(e) => {
            e.stopPropagation()
            onAdd()
          }}
        />
      </Tooltip>
    </>
  ),
  key: 'actions',
  render: (_: unknown, record: T) => (
    <Space>
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

      <Popconfirm
        title="Are you sure you want to delete this category?"
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
    </Space>
  ),
})

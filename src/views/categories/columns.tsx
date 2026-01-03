import { Button, Popconfirm, Space, Tooltip, type TableColumnsType } from 'antd'
import type { Category } from './type'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'

type Props = {
  handleOpenDrawer: (id: number) => void
  handleDelete: (id: number) => void
  handleAdd: (id?: number) => void
}

export const columns = ({ handleOpenDrawer, handleDelete, handleAdd }: Props): TableColumnsType<Category> => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 400,
    render: (value) => value ?? '-',
  },
  {
    title: 'NameEn',
    dataIndex: 'nameEn',
    key: 'nameEn',
    width: 400,
    render: (value) => value ?? '-',
  },
  {
    title: 'NameRu',
    dataIndex: 'nameRu',
    key: 'nameRu',
    width: 400,
    render: (value) => value ?? '-',
  },
  {
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
              handleAdd()
            }}
          />
        </Tooltip>
      </>
    ),
    key: 'actions',
    width: 400,
    render: (_, record) => {
      return (
        <Space>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleOpenDrawer(record.id)
              }}
            />
          </Tooltip>

          <Tooltip title="Add">
            <Button
              size="small"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleAdd(record.id)
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure you want to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={(e) => {
              e?.stopPropagation()
              handleDelete(record.id)
            }}
            onCancel={(e) => e?.stopPropagation()}
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    },
  },
]

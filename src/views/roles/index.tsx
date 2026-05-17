/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Form, message, Table } from 'antd'
import type { TablePaginationConfig } from 'antd'
import { useElementSize } from '@custom-react-hooks/use-element-size'
import { axiosDefaultInstance } from '../../api/axios'
import SideDrawer from '../../components/SideDrawer'
import { useFetch } from '../../hooks/useFetch'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { bindErrorToForm } from '../../utils/bindErrorToForm'
import { PageWrapper } from '../../style'
import { RolesTableWrapper } from './styles'
import { columns } from './columns'
import type { Role } from './type'
import type { IPaginatedResult } from '../../interfaces/response/IPaginatedResponse'
import { useUserStore } from '../../stores/userStore'
import { isSuperAdmin } from '../../helpers/getAccessLevel'
import PermissionModal from './PermissionModal'

type RolesQuery = {
  page: number
  pageSize: number
}

const RolesView = () => {
  const accessToken = useUserStore((s) => s.accessToken)
  const superAdmin = isSuperAdmin(accessToken)
  const [ref, size] = useElementSize()
  const tableBodyHeight = Math.max(size.height - 140, 240)
  const [query, setQuery] = useState<RolesQuery>({
    page: 1,
    pageSize: 10,
  })

  const { data: initialData, loading, execute } = useFetch<IPaginatedResult<Role>, unknown, RolesQuery>({
    httpMethod: HttpMethod.GET,
    endpoint: 'roles',
    params: query,
  })

  const [editedRolesById, setEditedRolesById] = useState<Record<number, Role>>({})
  const data = (initialData?.items ?? []).map((role) => editedRolesById[role.id] ?? role)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<Role | null>(null)
  const [activeRoleId, setActiveRoleId] = useState<number | null>(null)
  const [form] = Form.useForm()

  const refetchRoles = async (params = query) => {
    await execute({ params })
  }

  const onAdd = () => {
    setEditingData(null)
    setDrawerOpen(true)
  }

  const onEdit = (id: number) => {
    const role = data.find((d) => d.id === id) || null
    setEditingData(role)
    setDrawerOpen(true)
  }

  const onDelete = async (id: number) => {
    try {
      await axiosDefaultInstance.delete(`roles/${id}`)

      const nextPage = data.length === 1 && query.page > 1 ? query.page - 1 : query.page
      const nextQuery = { ...query, page: nextPage }

      setQuery(nextQuery)
      await refetchRoles(nextQuery)
      message.success('Deleted successfully')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const onPermissions = (id: number) => {
    setActiveRoleId(id)
    setPermissionModalOpen(true)
  }

  const handleSubmit = async (values: Role) => {
    try {
      if (editingData) {
        const response = await axiosDefaultInstance.put(`roles/${editingData.id}`, values)
        const updatedRole = response.data ?? { ...editingData, ...values }

        setEditedRolesById((prev) => ({
          ...prev,
          [editingData.id]: updatedRole,
        }))
        message.success('Updated successfully')
      } else {
        await axiosDefaultInstance.post('roles', values)
        const nextQuery = { ...query, page: 1 }

        setQuery(nextQuery)
        await refetchRoles(nextQuery)
        message.success('Added successfully')
      }

      setDrawerOpen(false)
      setEditingData(null)
      form.resetFields()
    } catch (error: any) {
      bindErrorToForm({ error, form })
    }
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const nextQuery = {
      page: pagination.current ?? query.page,
      pageSize: pagination.pageSize ?? query.pageSize,
    }

    setQuery(nextQuery)
  }

  return (
    <PageWrapper ref={ref}>
      <RolesTableWrapper tableBodyHeight={tableBodyHeight}>
        <Table
          bordered
          dataSource={data}
          loading={loading}
          columns={columns({ onAdd, onEdit, onDelete, onPermissions, isSuperAdmin: superAdmin })}
          pagination={{
            current: initialData?.page ?? query.page,
            pageSize: initialData?.pageSize ?? query.pageSize,
            total: initialData?.totalCount ?? 0,
            showSizeChanger: true,
          }}
          scroll={{ y: tableBodyHeight }}
          onChange={handleTableChange}
          rowKey="id"
        />
      </RolesTableWrapper>

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        columns={columns({ onAdd, onEdit, onDelete, onPermissions, isSuperAdmin: superAdmin })}
        editingData={editingData}
        onSubmit={handleSubmit}
      />

      <PermissionModal
        open={permissionModalOpen}
        activeRoleId={activeRoleId}
        onClose={() => {
          setPermissionModalOpen(false)
          setActiveRoleId(null)
        }}
      />
    </PageWrapper>
  )
}

export default RolesView

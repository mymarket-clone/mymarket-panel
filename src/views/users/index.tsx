/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useElementSize } from '@custom-react-hooks/use-element-size'
import { Form, Input, message, Select, Table } from 'antd'
import type { TablePaginationConfig } from 'antd'
import { axiosDefaultInstance } from '../../api/axios'
import SideDrawer from '../../components/SideDrawer'
import { useFetch } from '../../hooks/useFetch'
import type { IPaginatedResult } from '../../interfaces/response/IPaginatedResponse'
import { PageWrapper } from '../../style'
import { useUserStore } from '../../stores/userStore'
import { AccessLevelType } from '../../types/enums/AccessLevelType'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { getPermissions } from '../../helpers/getPermission'
import { isSuperAdmin } from '../../helpers/getAccessLevel'
import { bindErrorToForm } from '../../utils/bindErrorToForm'
import { columns, userFormColumns } from './columns'
import { UsersToolbar } from './styles'
import type { AdminUserFormValues, AdminUserRow, AdminUsersQuery } from './type'
import UserPermissionModal from './UserPermissionModal'

const UsersView = () => {
  const accessToken = useUserStore((s) => s.accessToken)
  const userPermissions = useMemo(() => (accessToken ? getPermissions(accessToken) : []), [accessToken])
  const superAdmin = isSuperAdmin(accessToken)
  const [ref, size] = useElementSize()
  const tableBodyHeight = Math.max(size.height - 190, 260)

  const [query, setQuery] = useState<AdminUsersQuery>({
    page: 1,
    pageSize: 10,
  })

  const {
    data: initialData,
    loading,
    execute,
  } = useFetch<IPaginatedResult<AdminUserRow>, unknown, AdminUsersQuery>({
    httpMethod: HttpMethod.GET,
    endpoint: 'user-management',
    params: query,
  })

  const data = initialData?.items ?? []
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingData, setEditingData] = useState<AdminUserRow | null>(null)
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const [activePermissionUserId, setActivePermissionUserId] = useState<number | null>(null)
  const [form] = Form.useForm<AdminUserFormValues>()

  const refetchUsers = async (params = query) => {
    await execute({ params })
  }

  const onAdd = () => {
    setEditingData(null)
    form.resetFields()
    setDrawerOpen(true)
  }

  const onEdit = (id: number) => {
    const user = data.find((d) => d.id === id) || null
    setEditingData(user)
    setDrawerOpen(true)
  }

  const onDelete = async (id: number) => {
    try {
      await axiosDefaultInstance.delete(`user-management/${id}`)

      const nextPage = data.length === 1 && query.page > 1 ? query.page - 1 : query.page
      const nextQuery = { ...query, page: nextPage }

      setQuery(nextQuery)
      await refetchUsers(nextQuery)
      message.success('Deleted successfully')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const onBlock = async (record: AdminUserRow) => {
    const nextBlocked = !record.isBlocked

    try {
      await axiosDefaultInstance.put(`user-management/${record.id}/block`, {
        block: nextBlocked,
      })
      await refetchUsers()
      message.success(nextBlocked ? 'User blocked' : 'User unblocked')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Operation failed')
    }
  }

  const onSuperAdmin = async (record: AdminUserRow) => {
    const isCurrentlySuperAdmin = record.accessLevel === AccessLevelType.SuperAdmin

    try {
      await axiosDefaultInstance.put(`user-management/${record.id}/superadmin`, {
        isSuperAdmin: !isCurrentlySuperAdmin,
      })
      await refetchUsers()
      message.success(isCurrentlySuperAdmin ? 'Super admin access removed' : 'Super admin access granted')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Operation failed')
    }
  }

  const onPermissions = (record: AdminUserRow) => {
    setActivePermissionUserId(record.id)
    setPermissionModalOpen(true)
  }

  const handleSubmit = async (values: AdminUserFormValues) => {
    try {
      if (editingData) {
        const payload = {
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          gender: values.gender,
          birthYear: values.birthYear,
          phoneNumber: values.phoneNumber,
          emailVerified: values.emailVerified,
        }

        await axiosDefaultInstance.put(`user-management/${editingData.id}`, payload)
        await refetchUsers()
        message.success('Updated successfully')
      } else {
        await axiosDefaultInstance.post('user-management', {
          ...values,
          isBlocked: values.isBlocked ?? false,
          isSuperAdmin: values.isSuperAdmin ?? false,
          emailVerified: values.emailVerified ?? false,
        })

        const nextQuery = { ...query, page: 1 }
        setQuery(nextQuery)
        await refetchUsers(nextQuery)
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
      ...query,
      page: pagination.current ?? query.page,
      pageSize: pagination.pageSize ?? query.pageSize,
    }

    setQuery(nextQuery)
  }

  const handleSearch = (search: string) => {
    const trimmed = search.trim()
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: trimmed || undefined,
    }))
  }

  const handleBlockedFilter = (isBlocked?: boolean) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      isBlocked,
    }))
  }

  const tableColumns = columns({
    onAdd,
    onEdit,
    onDelete,
    onBlock,
    onSuperAdmin,
    onPermissions,
    userPermissions,
    isSuperAdmin: superAdmin,
  })

  const editingFormData: AdminUserFormValues | null = editingData
    ? {
        firstname: editingData.firstname,
        lastname: editingData.lastname,
        email: editingData.email,
        gender: editingData.gender,
        birthYear: editingData.birthYear,
        phoneNumber: editingData.phoneNumber,
        emailVerified: editingData.emailVerified,
      }
    : null

  return (
    <PageWrapper ref={ref}>
      <UsersToolbar>
        <Input.Search
          allowClear
          placeholder="Search users"
          defaultValue={query.search}
          onSearch={handleSearch}
          style={{ maxWidth: 360 }}
        />
        <Select
          allowClear
          placeholder="Blocked status"
          value={query.isBlocked}
          onChange={handleBlockedFilter}
          style={{ width: 180 }}
          options={[
            { label: 'Blocked', value: true },
            { label: 'Not blocked', value: false },
          ]}
        />
      </UsersToolbar>

      <Table
        bordered
        dataSource={data}
        loading={loading}
        columns={tableColumns}
        pagination={{
          current: initialData?.page ?? query.page,
          pageSize: initialData?.pageSize ?? query.pageSize,
          total: initialData?.totalCount ?? 0,
          showSizeChanger: true,
        }}
        scroll={{ x: 1700, y: tableBodyHeight }}
        onChange={handleTableChange}
        rowKey="id"
      />

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        columns={userFormColumns(Boolean(editingData))}
        editingData={editingFormData}
        onSubmit={handleSubmit}
      />

      <UserPermissionModal
        open={permissionModalOpen}
        activeUserId={activePermissionUserId}
        onClose={() => {
          setPermissionModalOpen(false)
          setActivePermissionUserId(null)
        }}
      />
    </PageWrapper>
  )
}

export default UsersView

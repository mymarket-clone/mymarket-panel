/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Col, Collapse, Input, Modal, Select, Space, message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { axiosDefaultInstance } from '../../api/axios'
import { PermissionsType } from '../../types/enums/PermissionsType'

type Props = {
  open: boolean
  activeUserId: number | null
  onClose: () => void
}

type PermissionItem = {
  id: number
  name: string
  label: string
  group: string
}

type PermissionResponse = Array<number | { id: number }>

const permissionNameById = Object.entries(PermissionsType).reduce<Record<number, string>>(
  (acc, [key, value]) => {
    if (typeof value === 'number') acc[value] = key
    return acc
  },
  {}
)

const formatPermissionLabel = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2')

const getPermissionGroup = (name: string) => {
  const group = name.replace(/(View|Add|Edit|Delete|Reorder|Block)$/, '')
  return formatPermissionLabel(group)
}

const permissions: PermissionItem[] = Object.entries(permissionNameById)
  .map(([id, name]) => ({
    id: Number(id),
    name,
    label: formatPermissionLabel(name),
    group: getPermissionGroup(name),
  }))
  .sort((a, b) => a.id - b.id)

const normalizePermissions = (raw?: PermissionResponse) => {
  if (!Array.isArray(raw)) return []

  return raw
    .map((permission) => (typeof permission === 'number' ? permission : permission.id))
    .filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
}

const UserPermissionModal = ({ open, activeUserId, onClose }: Props) => {
  const [currentPermissionIds, setCurrentPermissionIds] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const permissionGroups = useMemo(() => {
    return permissions.reduce<Record<string, PermissionItem[]>>((acc, permission) => {
      acc[permission.group] = [...(acc[permission.group] ?? []), permission]
      return acc
    }, {})
  }, [])

  const groupOptions = useMemo(
    () => [
      { label: 'All', value: 'All' },
      ...Object.keys(permissionGroups).map((group) => ({ label: group, value: group })),
    ],
    [permissionGroups]
  )

  const allChecked =
    permissions.length > 0 && permissions.every((permission) => currentPermissionIds.includes(permission.id))

  useEffect(() => {
    if (!open || !activeUserId) return

    const loadUserPermissions = async () => {
      try {
        setLoading(true)
        const response = await axiosDefaultInstance.get<PermissionResponse>(
          `user-management/${activeUserId}/permissions`
        )
        setCurrentPermissionIds(normalizePermissions(response.data))
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Failed to load user permissions')
      } finally {
        setLoading(false)
      }
    }

    void loadUserPermissions()
  }, [activeUserId, open])

  useEffect(() => {
    if (!open) {
      setCurrentPermissionIds([])
      setSearch('')
      setSelectedGroup('All')
    }
  }, [open])

  const togglePermission = (id: number) => {
    setCurrentPermissionIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setCurrentPermissionIds(allChecked ? [] : permissions.map((permission) => permission.id))
  }

  const savePermissions = async () => {
    if (!activeUserId) return

    try {
      setSaving(true)
      await axiosDefaultInstance.put(`user-management/${activeUserId}/permissions`, {
        userId: activeUserId,
        permissions: currentPermissionIds,
      })
      message.success('User permissions updated successfully')
      onClose()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to update user permissions')
    } finally {
      setSaving(false)
    }
  }

  const collapseItems = Object.entries(permissionGroups)
    .filter(([groupName]) => selectedGroup === 'All' || groupName === selectedGroup)
    .map(([groupName, groupPermissions]) => {
      const filteredPermissions = groupPermissions.filter((permission) =>
        permission.label.toLowerCase().includes(search.toLowerCase())
      )

      if (filteredPermissions.length === 0) return null

      const allCheckedInGroup = filteredPermissions.every((permission) =>
        currentPermissionIds.includes(permission.id)
      )
      const partiallyChecked =
        !allCheckedInGroup &&
        filteredPermissions.some((permission) => currentPermissionIds.includes(permission.id))

      const toggleGroup = () => {
        if (allCheckedInGroup) {
          setCurrentPermissionIds((prev) =>
            prev.filter((id) => !filteredPermissions.some((permission) => permission.id === id))
          )
          return
        }

        setCurrentPermissionIds((prev) => [
          ...prev,
          ...filteredPermissions
            .filter((permission) => !prev.includes(permission.id))
            .map((permission) => permission.id),
        ])
      }

      return {
        key: groupName,
        label: (
          <Space size="small">
            <Checkbox
              checked={allCheckedInGroup}
              indeterminate={partiallyChecked}
              onChange={(event) => {
                event.stopPropagation()
                toggleGroup()
              }}
              onClick={(event) => event.stopPropagation()}
            />
            <span>{groupName}</span>
          </Space>
        ),
        children: (
          <Space direction="vertical" size="small">
            {filteredPermissions.map((permission) => (
              <Col key={permission.id}>
                <Space size="small">
                  <Checkbox
                    checked={currentPermissionIds.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                  />
                  <span>{permission.label}</span>
                </Space>
              </Col>
            ))}
          </Space>
        ),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <Modal
      destroyOnHidden
      title="User permissions"
      open={open}
      onOk={savePermissions}
      onCancel={onClose}
      confirmLoading={saving}
      loading={loading}
      width={560}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Select
            value={selectedGroup}
            options={groupOptions}
            onChange={setSelectedGroup}
            style={{ width: 170 }}
          />
          <Input
            placeholder="Search permissions"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Space.Compact>

        <Checkbox
          checked={allChecked}
          indeterminate={!allChecked && currentPermissionIds.length > 0}
          onChange={toggleAll}
        >
          Check all
        </Checkbox>

        <Collapse accordion items={collapseItems} />
      </Space>
    </Modal>
  )
}

export default UserPermissionModal

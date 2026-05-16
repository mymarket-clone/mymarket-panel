/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { axiosDefaultInstance } from '../../../../api/axios'
import SideDrawer from '../../../../components/SideDrawer'
import { bindErrorToForm } from '../../../../utils/bindErrorToForm'
import type { Attribute } from '../../../attributes/type'
import type { Category, CategoryAttribute } from '../../type'
import CategoryAttributesTable from './CategoryAttributesTable'
import { CategoryAttributesColumns } from './CategoryAttributesColumns'
import type { PermissionsType } from '../../../../types/enums/PermissionsType'

type Props = {
  categoryId: number
  categories: Category[]
  attributes: Attribute[]
  userPermissions: PermissionsType[]
  isSuperAdmin: boolean
}

const CategoryAttributesTab = ({
  categoryId,
  categories,
  attributes,
  userPermissions,
  isSuperAdmin,
}: Props) => {
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CategoryAttribute[]>([])
  const [loaded, setLoaded] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingData, setEditingData] = useState<CategoryAttribute | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const res = await axiosDefaultInstance.get(`categories/${categoryId}/attributes`)

      setData(res.data ?? [])
      setLoaded(true)
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to load category attributes')
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    if (!loaded) {
      void fetchData()
    }
  }, [fetchData, loaded])

  const onAdd = () => {
    setEditingData(null)
    form.resetFields()
    form.setFieldValue('categoryId', categoryId)
    setDrawerOpen(true)
  }

  const onEdit = (id: number) => {
    const item = data.find((x) => x.id === id) || null
    setEditingData(item)

    if (item) {
      form.setFieldsValue(item)
    } else {
      form.resetFields()
      form.setFieldValue('categoryId', categoryId)
    }

    setDrawerOpen(true)
  }

  const onDelete = async (id: number) => {
    try {
      await axiosDefaultInstance.delete(`category-attributes/${id}`)
      setData((prev) => prev.filter((x) => x.id !== id))
      message.success('Attribute deleted successfully')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const handleSubmit = async (values: CategoryAttribute) => {
    try {
      if (editingData) {
        await axiosDefaultInstance.put(`category-attributes/${editingData.id}`, values)

        setData((prev) => prev.map((x) => (x.id === editingData.id ? { ...x, ...values } : x)))

        message.success('Updated successfully')
      } else {
        const res = await axiosDefaultInstance.post('category-attributes', {
          ...values,
          categoryId,
        })

        setData((prev) => {
          const next = [...prev, res.data]
          next.sort((a, b) => a.id - b.id)
          return next
        })

        message.success('Added successfully')
      }

      setDrawerOpen(false)
      setEditingData(null)
      form.resetFields()
    } catch (error: any) {
      bindErrorToForm({ error, form })
    }
  }

  return (
    <>
      <CategoryAttributesTable
        data={data}
        loading={loading}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        attributes={attributes}
        categories={categories}
        userPermissions={userPermissions}
        isSuperAdmin={isSuperAdmin}
      />

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        columns={CategoryAttributesColumns({
          onAdd,
          onEdit,
          onDelete,
          attributes,
          categories,
          userPermissions,
          isSuperAdmin,
        })}
        editingData={editingData}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default CategoryAttributesTab

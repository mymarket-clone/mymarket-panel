/* eslint-disable @typescript-eslint/no-explicit-any */
import { useElementSize } from '@custom-react-hooks/use-element-size'
import api from '../../api/api'
import { useFetch } from '../../hooks/useFetch'
import { PageWrapper } from '../../style'
import { HttpMethod } from '../../types/enums/HttpMethod'
import type { Category, CategoryAttribute } from './type'
import { Form, message, Table } from 'antd'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import SideDrawer from '../../components/SideDrawer'
import { axiosDefaultInstance } from '../../api/axios'
import { bindErrorToForm } from '../../utils/bindErrorToForm'
import CategoryAttributesTable from './categoryAttributesTable'
import { categoryAttributesColumns } from './categoryAttributesColumns'
import { useLookup } from '../../hooks/useLookup'
import type { Attribute } from '../attributes/type'

const CategoriesView = () => {
  const { data: initialData, loading } = useFetch<Category[]>({
    url: api.getAllCategories,
    httpMethod: HttpMethod.GET,
  })

  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())
  const [attributeByCategoryId, setAttributeByCategoryId] = useState<Record<number, CategoryAttribute[]>>({})
  const [data, setData] = useState<Category[]>([])
  const [form] = Form.useForm()
  const [editingData, setEditingData] = useState<Category | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [attributeDrawerOpen, setAttributeDrawerOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [attributeEditingData, setAttributeEditingData] = useState<CategoryAttribute | null>(null)

  const attributes = useLookup<Attribute>(api.getAllAttributes)

  useEffect(() => {
    setData(initialData!)
  }, [initialData])

  const [ref, size] = useElementSize()

  const onAdd = () => {
    setEditingData(null)
    setDrawerOpen(true)
  }

  const onEdit = (id: number) => {
    const cat = data.find((d) => d.id === id) || null
    setEditingData(cat)
    setDrawerOpen(true)
  }

  const onDelete = async (id: number) => {
    try {
      await axiosDefaultInstance.delete(`${api.deleteCategory}/${id}`)
      setData((prev) => prev.filter((d) => d.id !== id))
      message.success('Deleted successfully')
    } catch (error: any) {
      console.error(error)
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const handleSubmit = async (values: Category) => {
    try {
      if (editingData) {
        await axiosDefaultInstance.put(`${api.editCategory}/${editingData.id}`, values)
        setData((prev) => prev.map((d) => (d.id === editingData.id ? { ...d, ...values } : d)))
        message.success('Updated successfully')
      } else {
        const res = await axiosDefaultInstance.post(api.addCategory, values)
        setData((prev) => {
          const updated = [...prev, res.data]
          updated.sort((a, b) => a.id - b.id)
          return updated
        })
        message.success('Added successfully')
      }
      setDrawerOpen(false)
      form.resetFields()
    } catch (error: any) {
      bindErrorToForm({ error, form })
    }
  }

  const onCategoryAttributeAdd = (id: number) => {
    setActiveCategoryId(id)
    setAttributeEditingData(null)
    form.resetFields()
    form.setFieldValue('categoryId', id)
    setAttributeDrawerOpen(true)
  }

  const onCategoryAttributeEdit = (id: number, attributeId: number) => {
    const attr = attributeByCategoryId[attributeId]?.find((o) => o.id === id) || null
    setActiveCategoryId(attributeId)
    setAttributeEditingData(attr)
    if (attr) form.setFieldsValue(attr)
    setAttributeDrawerOpen(true)
  }

  const onCategoryAttributeDelete = async (id: number, attributeId: number) => {
    try {
      await axiosDefaultInstance.delete(`${api.deleteCategoryAttribute}/${id}`)

      setAttributeByCategoryId((prev) => ({
        ...prev,
        [attributeId]: prev[attributeId].filter((o) => o.id !== id),
      }))

      message.success('Attribute deleted successfully')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const handleCategoryAttributeSubmit = async (values: CategoryAttribute) => {
    if (!activeCategoryId) return

    try {
      if (attributeEditingData) {
        await axiosDefaultInstance.put(`${api.editCategoryAttribute}/${attributeEditingData.id}`, values)

        setAttributeByCategoryId((prev) => ({
          ...prev,
          [activeCategoryId]: prev[activeCategoryId].map((o) =>
            o.id === attributeEditingData.id ? { ...o, ...values } : o
          ),
        }))

        message.success('Updated successfully')
      } else {
        const res = await axiosDefaultInstance.post(api.addCategoryAttribute, {
          ...values,
          categoryId: activeCategoryId,
        })

        setAttributeByCategoryId((prev) => {
          const updated = [...(prev[activeCategoryId] || []), res.data]
          updated.sort((a, b) => a.id - b.id)
          return {
            ...prev,
            [activeCategoryId]: updated,
          }
        })

        message.success('Added successfully')
      }

      setAttributeDrawerOpen(false)
      setAttributeEditingData(null)
      form.resetFields()
    } catch (error: any) {
      bindErrorToForm({ error, form })
    }
  }

  const fetchOptions = async (categoryId: number) => {
    setLoadingIds((prev) => new Set(prev).add(categoryId))

    const res = await axiosDefaultInstance.get(api.getCategoryAttributeById, {
      params: { id: categoryId },
    })

    setAttributeByCategoryId((prev) => ({
      ...prev,
      [categoryId]: res.data,
    }))

    setLoadingIds((prev) => {
      const next = new Set(prev)
      next.delete(categoryId)
      return next
    })
  }

  return (
    <PageWrapper ref={ref}>
      <Table
        bordered
        dataSource={data}
        loading={loading}
        columns={columns({ onAdd, onEdit, onDelete, categories: data })}
        pagination={false}
        scroll={{ y: size.height - 90 }}
        rowKey="id"
        expandable={{
          rowExpandable: (record) => !record.hasChildren,
          onExpand: (expanded, record) => {
            if (expanded && !attributeByCategoryId[record.id]) fetchOptions(record.id)
          },
          expandedRowRender: (record) => (
            <>
              <CategoryAttributesTable
                data={attributeByCategoryId[record.id]}
                loading={loadingIds.has(record.id)}
                onAdd={() => onCategoryAttributeAdd(record.id)}
                onEdit={(id) => onCategoryAttributeEdit(id, record.id)}
                onDelete={(id) => onCategoryAttributeDelete(id, record.id)}
                attributes={attributes}
                categories={data}
              />

              <SideDrawer
                open={attributeDrawerOpen}
                onClose={() => setAttributeDrawerOpen(false)}
                form={form}
                columns={categoryAttributesColumns({
                  onAdd: () => onCategoryAttributeAdd(record.id),
                  onEdit: (id) => onCategoryAttributeEdit(id, record.id),
                  onDelete: (id) => onCategoryAttributeDelete(id, record.id),
                  attributes: attributes,
                  categories: data,
                })}
                editingData={attributeEditingData}
                onSubmit={handleCategoryAttributeSubmit}
              />
            </>
          ),
        }}
      />

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        columns={columns({ onAdd, onEdit, onDelete, categories: data })}
        editingData={editingData}
        onSubmit={handleSubmit}
      />
    </PageWrapper>
  )
}

export default CategoriesView

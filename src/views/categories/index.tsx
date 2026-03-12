/* eslint-disable @typescript-eslint/no-explicit-any */
import { useElementSize } from '@custom-react-hooks/use-element-size'
import api from '../../api/api'
import { useFetch } from '../../hooks/useFetch'
import { PageWrapper } from '../../style'
import { HttpMethod } from '../../types/enums/HttpMethod'
import type { Category } from './type'
import { Form, message, Table, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import SideDrawer from '../../components/SideDrawer'
import { axiosDefaultInstance } from '../../api/axios'
import { bindErrorToForm } from '../../utils/bindErrorToForm'
import { useLookup } from '../../hooks/useLookup'
import type { Attribute } from '../attributes/type'
import CategoryAttributesTab from './components/attributes/categoryAttributesTab'

const CategoriesView = () => {
  const { data: initialData, loading } = useFetch<Category[]>({
    url: api.getAllCategories,
    httpMethod: HttpMethod.GET,
  })

  const [data, setData] = useState<Category[]>([])
  const [form] = Form.useForm()
  const [editingData, setEditingData] = useState<Category | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const attributes = useLookup<Attribute>(api.getAllAttributes)

  useEffect(() => {
    setData(initialData!)
  }, [initialData])

  const [ref, size] = useElementSize()

  const onAdd = () => {
    setEditingData(null)
    form.resetFields()
    setDrawerOpen(true)
  }

  const onEdit = (id: number) => {
    const cat = data.find((d) => d.id === id) || null
    setEditingData(cat)

    if (cat) {
      form.setFieldsValue(cat)
    } else {
      form.resetFields()
    }

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
          expandedRowRender: (record) => (
            <Tabs
              type="card"
              defaultActiveKey="attributes"
              items={[
                {
                  key: 'attributes',
                  label: 'Attributes',
                  children: (
                    <CategoryAttributesTab categoryId={record.id} categories={data} attributes={attributes} />
                  ),
                },
                {
                  key: 'brands',
                  label: 'Brands',
                  children: 123,
                },
              ]}
            />
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

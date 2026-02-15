/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import api from '../../api/api'
import { useFetch } from '../../hooks/useFetch'
import { HttpMethod } from '../../types/enums/HttpMethod'
import type { Unit } from './type'
import { Form, message, Table } from 'antd'
import { axiosDefaultInstance } from '../../api/axios'
import { columns } from './columns'
import SideDrawer from '../../components/SideDrawer'

const UnitsView = () => {
  const { data: initialData, loading } = useFetch<Unit[]>({
    httpMethod: HttpMethod.GET,
    url: api.getAllUnits,
  })

  const [data, setData] = useState<Unit[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingData, setEditingData] = useState<Unit | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    setData(initialData!)
  }, [initialData])

  const onAdd = () => {
    setEditingData(null)
    setDrawerOpen(true)
  }

  const onEdit = (id: number) => {
    const attr = data.find((d) => d.id === id) || null
    setEditingData(attr)
    setDrawerOpen(true)
  }

  const onDelete = async (id: number) => {
    try {
      await axiosDefaultInstance.delete(`${api.deleteUnit}/${id}`)
      setData((prev) => prev.filter((d) => d.id !== id))
      message.success('Deleted successfully')
    } catch (error: any) {
      console.error(error)
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const handleSubmit = async (values: Unit) => {
    try {
      if (editingData) {
        await axiosDefaultInstance.put(`${api.editUnit}/${editingData.id}`, values)
        setData((prev) => prev.map((d) => (d.id === editingData.id ? { ...d, ...values } : d)))
        message.success('Updated successfully')
      } else {
        await axiosDefaultInstance.post(api.addUnit, values)
        setData((prev) => [values, ...prev])
        message.success('Added successfully')
      }
      setDrawerOpen(false)
      form.resetFields()
    } catch (error: any) {
      const response = error?.response?.data

      if (response?.errors) {
        const fields = Object.entries(response.errors).map(([key, messages]) => ({
          name: key.charAt(0).toLowerCase() + key.slice(1),
          errors: messages as string[],
        }))
        form.setFields(fields)
      } else if (response?.title) {
        message.error(response.title)
      } else {
        message.error(error?.response?.data?.message || 'Operation failed')
      }
    }
  }

  return (
    <>
      <Table
        bordered
        dataSource={data}
        loading={loading}
        columns={columns({ onAdd, onEdit, onDelete })}
        pagination={false}
        rowKey="id"
      />

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        columns={columns({ onAdd, onEdit, onDelete })}
        editingData={editingData}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default UnitsView

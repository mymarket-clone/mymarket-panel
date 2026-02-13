/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Table, message } from 'antd'
import { columns } from './columns'
import { axiosDefaultInstance } from '../../api/axios'
import api from '../../api/api'
import { useState, useEffect } from 'react'
import type { Attribute, AttributeOption } from './type'
import SideDrawer from '../../components/SideDrawer'
import { useFetch } from '../../hooks/useFetch'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { AttributeType } from '../../types/enums/AttributeType'
import AttributeOptionsTable from './optionsTable'
import { optionColumns } from './optionsColumns'
import { bindErrorToForm } from '../../utils/bindErrorToForm'
import { useElementSize } from '@custom-react-hooks/use-element-size'
import { PageWrapper } from '../../style'

const AttributesView = () => {
  const { data: initialData, loading } = useFetch<Attribute[]>({
    httpMethod: HttpMethod.GET,
    url: api.getAllAttributes,
  })

  const [optionsByAttributeId, setOptionsByAttributeId] = useState<Record<number, AttributeOption[]>>({})
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())
  const [activeAttributeId, setActiveAttributeId] = useState<number | null>(null)
  const [ref, size] = useElementSize()

  const [data, setData] = useState<Attribute[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [optionDrawerOpen, setOptionDrawerOpen] = useState(false)
  const [editingData, setEditingData] = useState<Attribute | null>(null)
  const [optionEditingData, setOptionEditingData] = useState<AttributeOption | null>(null)
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
      await axiosDefaultInstance.delete(`${api.deleteAttribute}/${id}`)
      setData((prev) => prev.filter((d) => d.id !== id))
      message.success('Deleted successfully')
    } catch (error: any) {
      console.error(error)
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const onOptionAdd = (attributeId: number) => {
    setActiveAttributeId(attributeId)
    setOptionEditingData(null)
    form.resetFields()
    setOptionDrawerOpen(true)
  }

  const handleSubmit = async (values: Attribute) => {
    try {
      if (editingData) {
        await axiosDefaultInstance.put(`${api.editAttribute}/${editingData.id}`, values)
        setData((prev) => prev.map((d) => (d.id === editingData.id ? { ...d, ...values } : d)))
        message.success('Updated successfully')
      } else {
        const res = await axiosDefaultInstance.post(api.addAttribute, values)
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

  const onOptionEdit = (id: number, attributeId: number) => {
    const option = optionsByAttributeId[attributeId]?.find((o) => o.id === id) || null
    setActiveAttributeId(attributeId)
    setOptionEditingData(option)
    if (option) form.setFieldsValue(option)
    setOptionDrawerOpen(true)
  }

  const onOptionDelete = async (id: number, attributeId: number) => {
    try {
      await axiosDefaultInstance.delete(`${api.deleteAttributeOption}/${id}`)

      setOptionsByAttributeId((prev) => ({
        ...prev,
        [attributeId]: prev[attributeId].filter((o) => o.id !== id),
      }))

      message.success('Option deleted successfully')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const handleOptionSubmit = async (values: AttributeOption) => {
    if (!activeAttributeId) return

    try {
      if (optionEditingData) {
        await axiosDefaultInstance.put(`${api.editAttributeOption}/${optionEditingData.id}`, values)

        setOptionsByAttributeId((prev) => ({
          ...prev,
          [activeAttributeId]: prev[activeAttributeId].map((o) =>
            o.id === optionEditingData.id ? { ...o, ...values } : o
          ),
        }))

        message.success('Updated successfully')
      } else {
        const res = await axiosDefaultInstance.post(api.addAttributeOption, {
          ...values,
          attributeId: activeAttributeId,
        })

        setOptionsByAttributeId((prev) => {
          const updated = [...(prev[activeAttributeId] || []), res.data]
          updated.sort((a, b) => a.id - b.id)
          return {
            ...prev,
            [activeAttributeId]: updated,
          }
        })

        message.success('Added successfully')
      }

      setOptionDrawerOpen(false)
      setOptionEditingData(null)
      form.resetFields()
    } catch (error: any) {
      bindErrorToForm({ error, form })
    }
  }

  const fetchOptions = async (attributeId: number) => {
    setLoadingIds((prev) => new Set(prev).add(attributeId))

    const res = await axiosDefaultInstance.get(api.getAllByIdAttributeOption, {
      params: { id: attributeId },
    })

    setOptionsByAttributeId((prev) => ({
      ...prev,
      [attributeId]: res.data,
    }))

    setLoadingIds((prev) => {
      const next = new Set(prev)
      next.delete(attributeId)
      return next
    })
  }

  return (
    <PageWrapper ref={ref}>
      <Table
        bordered
        dataSource={data}
        loading={loading}
        columns={columns({ onAdd, onEdit, onDelete })}
        pagination={false}
        scroll={{ y: size.height - 90 }}
        rowKey="id"
        expandable={{
          rowExpandable: (record) => record.attributeType === AttributeType.Select,
          onExpand: (expanded, record) => {
            if (expanded && !optionsByAttributeId[record.id]) fetchOptions(record.id)
          },
          expandedRowRender: (record) => (
            <>
              <AttributeOptionsTable
                data={optionsByAttributeId[record.id]}
                loading={loadingIds.has(record.id)}
                onAdd={() => onOptionAdd(record.id)}
                onEdit={(id) => onOptionEdit(id, record.id)}
                onDelete={(id) => onOptionDelete(id, record.id)}
              />

              <SideDrawer
                open={optionDrawerOpen}
                onClose={() => setOptionDrawerOpen(false)}
                form={form}
                columns={optionColumns({
                  onAdd: () => onOptionAdd(record.id),
                  onEdit: (id) => onOptionEdit(id, record.id),
                  onDelete: (id) => onOptionDelete(id, record.id),
                })}
                editingData={optionEditingData}
                onSubmit={handleOptionSubmit}
              />
            </>
          ),
        }}
      />

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        form={form}
        columns={columns({ onAdd, onEdit, onDelete })}
        editingData={editingData}
        onSubmit={handleSubmit}
      />
    </PageWrapper>
  )
}

export default AttributesView

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Drawer, Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { FormWrapper } from '../style'
import type { ColumnsType, ColumnType } from 'antd/es/table'
import type { Attribute } from '../views/attributes/type'

type DrawerProps = {
  open: boolean
  onClose: () => void
  form: any
  columns: ColumnsType<Attribute>
  editingData?: Attribute | null
  onSubmit: (values: Attribute) => Promise<void>
}

const SideDrawer = ({ open, onClose, form, columns, editingData, onSubmit }: DrawerProps) => {
  useEffect(() => {
    if (editingData) {
      form.setFieldsValue(editingData)
    } else {
      form.resetFields()
    }
  }, [editingData, form])

  const handleFinish = async (values: Attribute) => {
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (typeof value === 'string' && !isNaN(Number(value))) {
          return [key, Number(value)]
        }
        return [key, value]
      })
    ) as Attribute

    await onSubmit(payload)
  }

  return (
    <Drawer
      closable
      destroyOnHidden
      placement="right"
      open={open}
      onClose={onClose}
      title={editingData ? 'Edit' : 'Add'}
      size={400}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <FormWrapper>
          {columns
            .filter((col: any): col is ColumnType<Attribute> => 'dataIndex' in col && col.dataIndex !== 'id')
            .map((col: any) => {
              const label = typeof col.title === 'function' ? (col.dataIndex as string) : col.title
              return (
                <Form.Item
                  key={col.dataIndex as string}
                  label={label as React.ReactNode}
                  name={col.dataIndex as string}
                  rules={col.required ? [{ required: true, message: `${label} is required` }] : undefined}
                >
                  <Input placeholder={`Enter ${col.title}`} />
                </Form.Item>
              )
            })}
        </FormWrapper>
        <Form.Item>
          <Button type="primary">{editingData ? 'Update' : 'Add'}</Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default SideDrawer

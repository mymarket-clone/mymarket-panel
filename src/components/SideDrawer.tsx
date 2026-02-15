/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Drawer, Form, Input, Select, Switch } from 'antd'
import { useEffect } from 'react'
import { FormWrapper } from '../style'
import type { CustomColumnType } from '../types/CustomCol'

type DrawerProps<T> = {
  open: boolean
  onClose: () => void
  form: any
  columns: CustomColumnType<T>[]
  editingData?: T | null
  onSubmit: (values: T) => Promise<void>
}

const SideDrawer = <T extends Record<string, any>>({
  open,
  onClose,
  form,
  columns,
  editingData,
  onSubmit,
}: DrawerProps<T>) => {
  useEffect(() => {
    if (editingData) {
      form.setFieldsValue(editingData)
    } else {
      form.resetFields()
    }
  }, [editingData, form])

  const handleFinish = async (values: T) => {
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        const col = columns.find((c) => c.dataIndex === key)
        if (!col) return [key, value]

        if ((value === '' || value == null) && !col.required) return [key, null]

        switch (col.type) {
          case 'number':
            return [key, Number(value)]
          case 'boolean':
            return [key, Boolean(value)]
          case 'string':
          default:
            return [key, value]
        }
      })
    ) as T

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
            .filter(
              (col: any): col is CustomColumnType<T> =>
                'dataIndex' in col && col.dataIndex !== 'id' && col.dataIndex !== 'attributeCode'
            )
            .map((col) => {
              const label = typeof col.title === 'function' ? (col.dataIndex as string) : col.title

              const rules = []

              if (col.required) {
                rules.push({ required: true, message: `${label} is required` })
              }

              if (col.type === 'number') {
                rules.push({
                  validator: (_: any, value: string | null | undefined) => {
                    if (value === undefined || value === null || value === '') return Promise.resolve()
                    return !isNaN(Number(value))
                      ? Promise.resolve()
                      : Promise.reject(new Error(`${label} must be a number`))
                  },
                })
              }

              if (col.type === 'boolean') {
                rules.push({
                  validator: (_: any, value: null | undefined) => {
                    if (value === undefined || value === null) return Promise.resolve()
                    return typeof value === 'boolean'
                      ? Promise.resolve()
                      : Promise.reject(new Error(`${label} must be true/false`))
                  },
                })
              }

              if (col.type === 'string') {
                rules.push({
                  validator: (_: any, value: null | undefined) => {
                    if (value === undefined || value === null) return Promise.resolve()
                    return typeof value === 'string'
                      ? Promise.resolve()
                      : Promise.reject(new Error(`${label} must be a string`))
                  },
                })
              }

              return (
                <Form.Item
                  key={col.dataIndex as string}
                  label={label}
                  name={col.dataIndex as string}
                  rules={rules}
                  valuePropName={col.type === 'boolean' ? 'checked' : 'value'}
                >
                  {(() => {
                    switch (col.type) {
                      case 'boolean':
                        return <Switch />

                      case 'lookup':
                        return (
                          <Select
                            allowClear
                            showSearch
                            placeholder={`Select ${label}`}
                            options={(col.lookupData || []).map((item: any) => ({
                              label: item[col.lookup!.label],
                              value: item[col.lookup!.value],
                            }))}
                          />
                        )

                      case 'enum':
                        if (!col.enumObj) return <Input placeholder={`Enter ${label}`} />

                        return (
                          <Select
                            allowClear
                            placeholder={`Select ${label}`}
                            options={Object.entries(col.enumObj).map(([value, label]) => ({
                              label,
                              value: Number(value),
                            }))}
                          />
                        )

                      case 'number':
                      case 'string':
                      default:
                        return <Input placeholder={`Enter ${label}`} />
                    }
                  })()}
                </Form.Item>
              )
            })}
        </FormWrapper>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            {editingData ? 'Update' : 'Add'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default SideDrawer

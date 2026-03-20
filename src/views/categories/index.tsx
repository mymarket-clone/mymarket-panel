/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { HolderOutlined } from '@ant-design/icons'
import { useElementSize } from '@custom-react-hooks/use-element-size'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Form, message, Table, Tabs, TreeSelect } from 'antd'
import { useFetch } from '../../hooks/useFetch'
import { axiosDefaultInstance } from '../../api/axios'
import SideDrawer from '../../components/SideDrawer'
import { bindErrorToForm } from '../../utils/bindErrorToForm'
import { PageWrapper } from '../../style'
import { HttpMethod } from '../../types/enums/HttpMethod'
import type { Category } from './type'
import { columns } from './columns'
import { homeCategoriesColumns } from './homeCategoriesColumns'
import { toFormData } from 'axios'
import { useSearchParams } from 'react-router'

type CategoryTree = Category & {
  children?: CategoryTree[]
}

export type HomeCategory = {
  id: number
  categoryId: number
  order: number
}

type CategoryTreeSelectNode = {
  title: string
  value: number
  key: number
  children?: CategoryTreeSelectNode[]
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  listeners?: SyntheticListenerMap
}

const RowContext = React.createContext<RowContextProps>({})

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext)

  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  )
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const Row = (props: RowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: props['data-row-key'] })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  }

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  )

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  )
}

const buildCategoryTree = (categories?: Category[] | null): CategoryTree[] => {
  if (!categories?.length) return []

  const map = new Map<number, CategoryTree>()

  categories.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  const roots: CategoryTree[] = []

  map.forEach((item) => {
    if (item.parentId == null) {
      roots.push(item)
      return
    }

    const parent = map.get(item.parentId)
    if (parent) {
      parent.children!.push(item)
    } else {
      roots.push(item)
    }
  })

  const cleanEmptyChildren = (nodes: CategoryTree[]): CategoryTree[] =>
    nodes.map((node) => ({
      ...node,
      children: node.children && node.children.length > 0 ? cleanEmptyChildren(node.children) : undefined,
    }))

  return cleanEmptyChildren(roots)
}

const buildCategoryTreeSelect = (categories?: Category[] | null): CategoryTreeSelectNode[] => {
  if (!categories?.length) return []

  const map = new Map<
    number,
    CategoryTreeSelectNode & {
      parentId: number | null
    }
  >()

  categories.forEach((item) => {
    map.set(item.id, {
      key: item.id,
      value: item.id,
      title: item.name,
      parentId: item.parentId ?? null,
      children: [],
    })
  })

  const roots: Array<
    CategoryTreeSelectNode & {
      parentId: number | null
    }
  > = []

  map.forEach((item) => {
    if (item.parentId == null) {
      roots.push(item)
      return
    }

    const parent = map.get(item.parentId)
    if (parent) {
      parent.children!.push(item)
    } else {
      roots.push(item)
    }
  })

  const clean = (
    nodes: Array<
      CategoryTreeSelectNode & {
        parentId: number | null
      }
    >
  ): CategoryTreeSelectNode[] =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nodes.map(({ parentId, ...node }) => ({
      ...node,
      children: node.children && node.children.length > 0 ? clean(node.children as any) : undefined,
    }))

  return clean(roots)
}

const CategoriesView = () => {
  const { data: initialData, loading } = useFetch<Category[]>({
    httpMethod: HttpMethod.GET,
    endpoint: 'categories/get-localized',
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const tab = searchParams.get('tab')
  const activeTab = tab === 'categories' || tab === 'homeCategories' ? tab : 'categories'

  useEffect(() => {
    if (!tab || (tab !== 'categories' && tab !== 'homeCategories')) {
      setSearchParams({ tab: 'categories' }, { replace: true })
    }
  }, [tab, setSearchParams])

  const [data, setData] = useState<Category[]>([])
  const [form] = Form.useForm()
  const [editingData, setEditingData] = useState<Category | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [homeCategories, setHomeCategories] = useState<HomeCategory[]>([])
  const [homeCategoriesLoading, setHomeCategoriesLoading] = useState(false)

  useEffect(() => {
    setData(initialData ?? [])
  }, [initialData])

  useEffect(() => {
    const loadHomeCategories = async () => {
      try {
        setHomeCategoriesLoading(true)
        const res = await axiosDefaultInstance.get('home-categories')
        setHomeCategories((res.data ?? []).sort((a: HomeCategory, b: HomeCategory) => a.order - b.order))
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Failed to load home categories')
      } finally {
        setHomeCategoriesLoading(false)
      }
    }

    loadHomeCategories()
  }, [])

  const [ref, size] = useElementSize()
  const [refInner, sizeInner] = useElementSize()

  const treeData = useMemo(() => buildCategoryTree(data), [data])
  const homeCategoryTreeData = useMemo(() => buildCategoryTreeSelect(data), [data])

  const selectedHomeCategoryIds = useMemo(() => homeCategories.map((x) => x.categoryId), [homeCategories])

  const draggableHomeCategoriesColumns = useMemo(
    () => [
      {
        key: 'sort',
        align: 'center' as const,
        width: 60,
        render: () => <DragHandle />,
      },
      ...homeCategoriesColumns({ categories: data }),
    ],
    [data]
  )

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
      await axiosDefaultInstance.delete(`categories/${id}`)
      setData((prev) => prev.filter((d) => d.id !== id))
      message.success('Deleted successfully')
    } catch (error: any) {
      console.error(error)
      message.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const handleSubmit = async (values: Category) => {
    const mapped = {
      parentId: values.parentId,
      name: values.name,
      nameEn: values.nameEn,
      nameRu: values.nameRu,
      brandRequired: values.brandRequired,
      brandVisible: values.brandVisible,
      categoryPostType: values.categoryPostType,
      ...(values.logoUrl ? { logo: values.logoUrl } : {}),
    }

    try {
      if (editingData) {
        const res = await axiosDefaultInstance.put(`categories/${editingData.id}`, toFormData(mapped), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        setData((prev) => prev.map((d) => (d.id === editingData.id ? { ...d, ...res.data } : d)))
        message.success('Updated successfully')
      } else {
        const res = await axiosDefaultInstance.post('categories', toFormData(mapped), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const createdItem = {
          ...mapped,
          ...res.data,
        }

        setData((prev) => [...prev, createdItem])
        message.success('Added successfully')
      }

      setDrawerOpen(false)
      form.resetFields()
    } catch (error: any) {
      bindErrorToForm({ error, form })
    }
  }

  const handleHomeCategoriesChange = async (value: Array<{ value: number; label: ReactNode }>) => {
    const nextIds = value.map((x) => x.value)

    const addedIds = nextIds.filter((id) => !selectedHomeCategoryIds.includes(id))
    const removedIds = selectedHomeCategoryIds.filter((id) => !nextIds.includes(id))

    try {
      const createdRecords: HomeCategory[] = []

      if (addedIds.length > 0) {
        let maxOrder = homeCategories.length > 0 ? Math.max(...homeCategories.map((x) => x.order ?? 0)) : -1

        const responses = await Promise.all(
          addedIds.map((categoryId) => {
            maxOrder += 1
            return axiosDefaultInstance.post('home-categories', {
              categoryId,
              order: maxOrder,
            })
          })
        )

        responses.forEach((res) => {
          createdRecords.push(res.data)
        })
      }

      if (removedIds.length > 0) {
        const toDelete = homeCategories.filter((x) => removedIds.includes(x.categoryId))
        await Promise.all(toDelete.map((item) => axiosDefaultInstance.delete(`home-categories/${item.id}`)))
      }

      setHomeCategories((prev) => {
        const filtered = prev.filter((x) => !removedIds.includes(x.categoryId))
        return [...filtered, ...createdRecords].sort((a, b) => a.order - b.order)
      })
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to update home categories')
    }
  }

  const handleHomeCategoryDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    const activeId = Number(active.id)
    const overId = Number(over.id)

    const activeIndex = homeCategories.findIndex((record) => record.id === activeId)
    const overIndex = homeCategories.findIndex((record) => record.id === overId)

    if (activeIndex === -1 || overIndex === -1) return

    const previous = homeCategories

    const reordered = arrayMove(homeCategories, activeIndex, overIndex).map((item, index) => ({
      ...item,
      order: index,
    }))

    setHomeCategories(reordered)

    try {
      await axiosDefaultInstance.put('home-categories/reorder', {
        items: reordered.map((item) => ({
          id: item.id,
          order: item.order,
        })),
      })
    } catch (error: any) {
      setHomeCategories(previous)
      message.error(error?.response?.data?.message || 'Failed to update home categories order')
    }
  }

  return (
    <PageWrapper ref={ref}>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setSearchParams({ tab: key }, { replace: true })
        }}
        type="card"
        items={[
          {
            key: 'categories',
            label: 'Categories',
            children: (
              <PageWrapper>
                <Table
                  rowKey="id"
                  bordered
                  dataSource={treeData}
                  loading={loading}
                  columns={columns({ onAdd, onEdit, onDelete, categories: data })}
                  pagination={false}
                  scroll={{ y: size.height - 150 }}
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
            ),
          },
          {
            key: 'homeCategories',
            label: 'Home categories',
            children: (
              <PageWrapper>
                <div ref={refInner} style={{ marginBottom: 16 }}>
                  <TreeSelect
                    title="Home Categories"
                    style={{ width: '100%' }}
                    treeData={homeCategoryTreeData}
                    value={selectedHomeCategoryIds.map((id) => ({
                      value: id,
                      label: data.find((x) => x.id === id)?.name ?? id,
                    }))}
                    onChange={handleHomeCategoriesChange}
                    treeCheckable
                    treeCheckStrictly
                    labelInValue
                    showSearch={{ treeNodeFilterProp: 'title' }}
                    allowClear
                    placeholder="Select home categories"
                    loading={homeCategoriesLoading}
                  />
                </div>

                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleHomeCategoryDragEnd}>
                  <SortableContext
                    items={homeCategories.map((item) => item.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table
                      rowKey={(record) => record.id.toString()}
                      components={{ body: { row: Row } }}
                      bordered
                      dataSource={homeCategories}
                      loading={loading || homeCategoriesLoading}
                      columns={draggableHomeCategoriesColumns}
                      pagination={false}
                      scroll={{ y: size.height - sizeInner.height - 150 }}
                    />
                  </SortableContext>
                </DndContext>
              </PageWrapper>
            ),
          },
        ]}
      />
    </PageWrapper>
  )
}

export default CategoriesView

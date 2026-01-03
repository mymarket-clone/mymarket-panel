import { useFetch } from '../../hooks/useFetch'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { useCallback, useEffect, useState } from 'react'
import type { Category, CategoryEditForm, CategoryTreeNode } from './type'
import { Form } from 'antd'
import api from '../../api/api'

export const useCategories = () => {
  const [form] = Form.useForm<CategoryEditForm>()
  const [categories, setCategories] = useState<Category[]>([])
  const [currentEditing, setCurrentEditing] = useState<number | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data: fetchedCategories, loading: categoriesLoading } = useFetch<Category[]>({
    httpMethod: HttpMethod.GET,
    url: api.getAllCategories,
  })

  const {
    data: category,
    loading: catLoading,
    execute: fetchCategoryById,
  } = useFetch<CategoryEditForm>({
    httpMethod: HttpMethod.GET,
    url: api.getCategoryById,
    enabled: false,
  })

  const { loading: editCategoryLoading, execute: executeEditCategory } = useFetch({
    httpMethod: HttpMethod.PATCH,
    url: api.editCategory,
    enabled: false,
    form,
  })

  const { execute: executeDeleteCategory } = useFetch({
    httpMethod: HttpMethod.DELETE,
    url: api.deleteCategory,
    enabled: false,
  })

  const { execute: executeAddCategory, loading: addCategoryLoading } = useFetch<
    CategoryEditForm,
    unknown,
    unknown,
    CategoryEditForm
  >({
    httpMethod: HttpMethod.POST,
    url: api.addCategory,
    enabled: false,
    form,
  })

  const normalizeCategories = useCallback((cats: Category[]): Category[] => {
    const recurse = (nodes: Category[]): Category[] =>
      nodes.map((node) => ({
        ...node,
        key: node.id,
        children: node.children && node.children.length ? recurse(node.children) : undefined,
      }))
    return recurse(cats)
  }, [])

  useEffect(() => {
    if (fetchedCategories) {
      queueMicrotask(() => {
        setCategories(normalizeCategories(fetchedCategories))
      })
    }
  }, [fetchedCategories, normalizeCategories])

  const buildTreeSelectData = useCallback((cats: Category[]): CategoryTreeNode[] => {
    const recurse = (nodes: Category[]): CategoryTreeNode[] =>
      nodes.map((node) => ({
        title: node.name,
        value: node.id,
        key: node.id,
        children: node.children && node.children.length ? recurse(node.children) : undefined,
      }))
    return recurse(cats)
  }, [])

  const openDrawer = useCallback(
    (id: number) => {
      setDrawerOpen(true)
      setCurrentEditing(id)
      fetchCategoryById({
        params: { id },
        onSuccess: (data) => form.setFieldsValue({ ...data }),
      })
    },
    [fetchCategoryById, form]
  )

  const handleEdit = useCallback(
    (values: CategoryEditForm) => {
      if (!categories || currentEditing === null) return

      executeEditCategory({
        body: { id: currentEditing, ...values },
        onSuccess: () => {
          let movingNode: Category | null = null

          const removeNode = (nodes: Category[]): Category[] =>
            nodes
              .map((node) => {
                if (node.id === currentEditing) {
                  movingNode = { ...node, ...values, children: node.children || [] }
                  return null
                }
                if (node.children) return { ...node, children: removeNode(node.children).filter(Boolean) }
                return node
              })
              .filter(Boolean) as Category[]

          let updatedCategories = removeNode(categories)

          const insertNode = (nodes: Category[]): Category[] =>
            nodes.map((node) => {
              if (node.id === values.parentId) {
                return { ...node, children: [...(node.children || []), movingNode!] }
              }
              if (node.children) return { ...node, children: insertNode(node.children) }
              return node
            })

          if (values.parentId) {
            updatedCategories = insertNode(updatedCategories)
          } else if (movingNode) {
            updatedCategories.push(movingNode)
          }

          setCategories(updatedCategories)
          setDrawerOpen(false)
          setCurrentEditing(null)
        },
      })
    },
    [categories, currentEditing, executeEditCategory]
  )

  const handleDelete = useCallback(
    (id: number) => {
      executeDeleteCategory({
        params: { id },
        onSuccess: () => {
          const removeNode = (nodes: Category[]): Category[] =>
            nodes
              .map((node) => {
                if (node.id === id) return null
                if (node.children) return { ...node, children: removeNode(node.children).filter(Boolean) }
                return node
              })
              .filter(Boolean) as Category[]

          setCategories(removeNode(categories))
        },
      })
    },
    [categories, executeDeleteCategory]
  )

  const handleAdd = useCallback(
    (values: CategoryEditForm) => {
      executeAddCategory({
        body: values,
        onSuccess: (newCategory) => {
          const newNode: Category = {
            id: newCategory.id!,
            name: newCategory.name,
            nameEn: newCategory.nameEn,
            nameRu: newCategory.nameRu,
            children: [],
          }

          let updatedCategories: Category[] = [...categories]

          if (newCategory.parentId) {
            const insertNode = (nodes: Category[]): Category[] =>
              nodes.map((node) => {
                if (node.id === newCategory.parentId) {
                  return { ...node, children: [...(node.children || []), newNode] }
                }
                if (node.children) return { ...node, children: insertNode(node.children) }
                return node
              })

            updatedCategories = insertNode(updatedCategories)
          } else {
            updatedCategories.push(newNode)
          }

          setCategories(updatedCategories)
          setDrawerOpen(false)
          form.resetFields()
        },
      })
    },
    [executeAddCategory, form, categories]
  )

  const openDrawerToAdd = useCallback(
    (parentId?: number) => {
      setDrawerOpen(true)
      setCurrentEditing(null)
      form.resetFields()
      form.setFieldsValue({ parentId })
    },
    [form]
  )

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setCurrentEditing(null)
    form.resetFields()
  }, [form])

  return {
    form,
    categories,
    categoriesLoading,
    normalizedCategories: normalizeCategories(categories),
    buildTreeSelectData,
    currentEditingCategory: category,
    catLoading,
    editCategoryLoading,
    drawerOpen,
    expandedKeys,
    setExpandedKeys,
    openDrawer,
    closeDrawer,
    handleEdit,
    handleDelete,
    handleAdd,
    addCategoryLoading,
    openDrawerToAdd,
  }
}

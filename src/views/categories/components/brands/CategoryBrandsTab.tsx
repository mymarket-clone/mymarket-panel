/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from 'antd'
import type { CategoryBrand } from '../../type'
import { useCallback, useEffect, useState } from 'react'
import { axiosDefaultInstance } from '../../../../api/axios'
import CategoryBrandsTable from './CategoryBrandsTable'
import type { Brand } from '../../../brands/type'

type Props = {
  categoryId: number
}

const CategoryBrandsTab = ({ categoryId }: Props) => {
  const { message } = App.useApp()

  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categoryBrands, setCategoryBrands] = useState<CategoryBrand[]>([])
  const [loaded, setLoaded] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const brandsPromise = axiosDefaultInstance.get(`brands`)
      const categoryBrandsPromise = axiosDefaultInstance.get(`categories/${categoryId}/brands`)

      const [brands, categoryBrands] = await Promise.all([brandsPromise, categoryBrandsPromise])

      setBrands(brands.data ?? [])
      setCategoryBrands(categoryBrands.data ?? [])

      setLoaded(true)
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to load category brands')
    } finally {
      setLoading(false)
    }
  }, [categoryId, message])

  useEffect(() => {
    if (!loaded) {
      void fetchData()
    }
  }, [fetchData, loaded])

  return (
    <>
      <CategoryBrandsTable
        categoryId={categoryId}
        categoryBrands={categoryBrands}
        loading={loading}
        brands={brands}
      />
    </>
  )
}

export default CategoryBrandsTab

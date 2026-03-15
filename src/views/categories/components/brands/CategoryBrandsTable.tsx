import { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { Brand } from '../../../brands/type'
import type { CategoryBrand } from '../../type'
import { CategoryBrandsColumns } from './CategoryBrandsColumns'
import { axiosDefaultInstance } from '../../../../api/axios'

type Props = {
  categoryId: number
  loading: boolean
  brands: Brand[]
  categoryBrands: CategoryBrand[]
}

const CategoryBrandsTable = ({ categoryId, loading, brands, categoryBrands }: Props) => {
  const [linkedCategoryBrands, setLinkedCategoryBrands] = useState<CategoryBrand[]>(categoryBrands)
  const [loadingByBrandId, setLoadingByBrandId] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setLinkedCategoryBrands(categoryBrands)
  }, [categoryBrands])

  const linkUnlinkBrand = async (brandId: number, checked: boolean) => {
    try {
      setLoadingByBrandId((prev) => ({ ...prev, [brandId]: true }))

      if (checked) {
        await axiosDefaultInstance.post('category-brands/link', {
          categoryId,
          brandId,
        })

        setLinkedCategoryBrands((prev) => {
          const alreadyExists = prev.some((cb) => cb.brandId === brandId)
          if (alreadyExists) return prev

          return [
            ...prev,
            {
              id: 0,
              categoryId,
              brandId,
            },
          ]
        })
      } else {
        await axiosDefaultInstance.post('category-brands/unlink', {
          categoryId,
          brandId,
        })

        setLinkedCategoryBrands((prev) => prev.filter((cb) => cb.brandId !== brandId))
      }
    } finally {
      setLoadingByBrandId((prev) => ({ ...prev, [brandId]: false }))
    }
  }

  return (
    <Table
      bordered
      columns={CategoryBrandsColumns({
        brands,
        categoryBrands: linkedCategoryBrands,
        onToggle: linkUnlinkBrand,
        loadingByBrandId,
      })}
      dataSource={brands}
      loading={loading}
      pagination={false}
      rowKey="id"
      scroll={{ y: 500 }}
      style={{ paddingBlock: 12 }}
    />
  )
}

export default CategoryBrandsTable

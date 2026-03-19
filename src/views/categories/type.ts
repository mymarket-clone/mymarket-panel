import type { CategoryPostType } from '../../types/enums/CategoryPostType'

export type Category = {
  id: number
  parentId: number | null
  name: string
  nameEn: string | null
  nameRu: string | null
  hasChildren: boolean
  categoryPostType: CategoryPostType
  logoUrl: string
}

export type CategoryAttribute = {
  id: number
  categoryId: number
  attributeId: number
  order: number
  isRequired: boolean
}

export type CategoryBrand = {
  id: number
  categoryId: number
  brandId: number
}

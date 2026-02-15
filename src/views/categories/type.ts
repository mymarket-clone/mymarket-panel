import type { CategoryPostType } from '../../types/enums/CategoryPostType'

export type Category = {
  id: number
  parentId: number | null
  name: number | null
  nameEn: number | null
  nameRu: number | null
  hasChildren: boolean
  categoryPostType: CategoryPostType
}

export type CategoryAttribute = {
  id: number
  categoryId: number
  attributeId: number
  order: number
  isRequired: boolean
}

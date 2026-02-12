import type { AttributeType } from '../../types/enums/AttributeType'

export type Attribute = {
  id: number
  code: string
  name: string
  nameEn?: string
  nameRu?: string
  attributeType: AttributeType
  unitId?: number
}

export type AttributeOption = {
  id: number
  attributeId: number
  order: string
  name: string
  nameEn?: string
  nameRu?: string
}

export type Category = {
  id: number
  name: string
  nameEn: string | null
  nameRu: string | null
  children?: Category[]
}

export type CategoryEditForm = {
  id?: number
  name: string
  nameEn: string | null
  nameRu: string | null
  parentId: number | null
}

export type CategoryTreeNode = {
  title: string
  value: number
  key: number
  children?: CategoryTreeNode[]
}

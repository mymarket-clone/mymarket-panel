/* eslint-disable @typescript-eslint/no-explicit-any */
type TreeOption = {
  title: string
  value: number
  children?: TreeOption[]
}

export const buildTreeOptions = <T extends Record<string, any>>(
  items: T[],
  labelKey: string,
  valueKey: string,
  parentKey: string = 'parentId'
): TreeOption[] => {
  const map = new Map<any, TreeOption & { parentId?: any }>()

  items.forEach((item) => {
    map.set(item[valueKey], {
      title: item[labelKey],
      value: item[valueKey],
      parentId: item[parentKey],
      children: [],
    })
  })

  const roots: Array<TreeOption & { parentId?: any }> = []

  map.forEach((node) => {
    if (node.parentId == null) {
      roots.push(node)
      return
    }

    const parent = map.get(node.parentId)
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  const cleanup = (nodes: Array<TreeOption & { parentId?: any }>): TreeOption[] =>
    nodes.map((node) => ({
      title: node.title,
      value: node.value,
      children: node.children?.length
        ? cleanup(node.children as Array<TreeOption & { parentId?: any }>)
        : undefined,
    }))

  return cleanup(roots)
}

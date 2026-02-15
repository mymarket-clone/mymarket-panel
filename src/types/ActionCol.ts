export type ActionColProps<TExtra = unknown> = {
  onAdd: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
} & TExtra

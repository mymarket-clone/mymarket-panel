import { Switch } from 'antd'
import type { CustomColumnType } from '../../../../types/CustomCol'
import type { Brand } from '../../../brands/type'
import type { CategoryBrand } from '../../type'

type CategoryBrandsExtras = {
  brands: Brand[]
  categoryBrands: CategoryBrand[]
  onToggle: (brandId: number, checked: boolean) => void | Promise<void>
  loadingByBrandId: Record<number, boolean>
}

export const CategoryBrandsColumns = ({
  brands,
  categoryBrands,
  onToggle,
  loadingByBrandId,
}: CategoryBrandsExtras): CustomColumnType<Brand>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      type: 'number',
    },
    {
      title: 'Linked',
      dataIndex: 'linked',
      key: 'linked',
      width: 80,
      type: 'boolean',
      render: (_, record) => {
        const checked = categoryBrands.some((cb) => cb.brandId === record.id)

        return (
          <Switch
            checked={checked}
            loading={loadingByBrandId[record.id]}
            onChange={(nextChecked) => onToggle(record.id, nextChecked)}
          />
        )
      },
    },
    {
      title: 'Brand',
      dataIndex: 'name',
      key: 'name',
      type: 'lookup',
      width: 200,
      required: true,
      lookupData: brands,
      lookup: { label: 'name', value: 'id' },
      filters: brands.map((brand) => ({
        text: brand.name,
        value: brand.name,
      })),
      filterMode: 'menu',
      filterSearch: true,
      onFilter: (value, record) => record.name.toLowerCase().includes(String(value).toLowerCase()),
      render: (_, record) => record.name ?? '-',
    },
  ]
}

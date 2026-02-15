import type { Attribute } from './type'
import { ActionCol } from '../../components/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import { AttributeType } from '../../types/enums/AttributeType'
import type { ActionColProps } from '../../types/ActionCol'
import { getEnumLabels } from '../../utils/getEnumlabels'
import type { Unit } from '../units/type'

type AttributesExtras = {
  units: Unit[]
}

export const columns = ({
  onAdd,
  onEdit,
  onDelete,
  units,
}: ActionColProps<AttributesExtras>): CustomColumnType<Attribute>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      required: true,
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      required: true,
      width: 200,
    },
    {
      title: 'NameEn',
      dataIndex: 'nameEn',
      key: 'nameEn',
      required: true,
      width: 200,
    },
    {
      title: 'NameRu',
      dataIndex: 'nameRu',
      key: 'nameRu',
      required: true,
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'attributeType',
      key: 'attributeType',
      width: 200,
      type: 'enum',
      enumObj: getEnumLabels(AttributeType),
      render: (v: AttributeType) => getEnumLabels(AttributeType)[v] ?? 'Unknown',
      required: true,
    },
    {
      title: 'Unit',
      dataIndex: 'unitId',
      key: 'unitId',
      type: 'lookup',
      lookupData: units,
      lookup: { label: 'name', value: 'id' },
      render: (_, record) => {
        const unit = units.find((a) => a.id === record.unitId)
        return unit?.name ?? record.unitId ?? '-'
      },
      width: 80,
    },
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

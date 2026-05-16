import { ActionCol } from '../../components/ActionCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import { PermissionsType } from '../../types/enums/PermissionsType'
import { Img, ImgWrapper } from './styles'
import type { Brand } from './type'

export const columns = ({
  onAdd,
  onEdit,
  onDelete,
  userPermissions,
  isSuperAdmin,
}: ActionColProps): CustomColumnType<Brand>[] => {
  const cols: CustomColumnType<Brand>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      required: true,
      width: 200,
    },
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 200,
      required: true,
      type: 'file',
      render: (v) => (
        <ImgWrapper>
          <Img src={v} />
        </ImgWrapper>
      ),
    },
  ]

  const actionCol = ActionCol<Brand>({
    onAdd,
    onEdit,
    onDelete,
    userPermissions,
    isSuperAdmin,
    actionPermissions: {
      add: PermissionsType.BrandsAdd,
      edit: PermissionsType.BrandsEdit,
      delete: PermissionsType.BrandsDelete,
    },
  })

  if (actionCol) cols.push(actionCol)

  return cols
}

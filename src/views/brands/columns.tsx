import { ActionCol } from '../../components/ActionCol'
import type { ActionColProps } from '../../types/ActionCol'
import type { CustomColumnType } from '../../types/CustomCol'
import { Img, ImgWrapper } from './styles'
import type { Brand } from './type'

export const columns = ({ onAdd, onEdit, onDelete }: ActionColProps): CustomColumnType<Brand>[] => {
  return [
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
    ActionCol({
      onAdd,
      onEdit,
      onDelete,
    }),
  ]
}

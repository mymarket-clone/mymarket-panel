import styled from '@emotion/styled'

export const RolesTableWrapper = styled.div<{ tableBodyHeight: number }>`
  .ant-table-body,
  .ant-table-placeholder {
    min-height: ${({ tableBodyHeight }) => tableBodyHeight}px;
  }
`

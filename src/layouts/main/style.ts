import styled from '@emotion/styled'
import { Layout } from 'antd'

export const Styledlayout = styled(Layout)`
  height: 100%;
`

export const StyledSider = styled(Layout.Sider)`
  display: flex;
  justify-content: center;
  padding-block: 16px;
  background-color: var(--background);

  .ant-layout-sider-children {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-inline: 16px;
    width: 100%;

    .ant-menu {
      background-color: transparent;
    }

    .ant-menu-item {
      padding: 0 !important;
      padding-left: 12px !important;
      background-color: var(--background);
      color: var(--white);
    }

    .ant-menu-item-selected {
      background-color: var(--primary);
      color: var(--white);
    }

    .ant-menu-title-content {
      font-size: 13px;
    }
  }
`

export const OutletWrapper = styled.div`
  padding: 16px;
  height: 100%;
  overflow-y: hidden;
`

export const Logo = styled.div`
  width: 160px;
  height: 47.2px;
  margin-bottom: 16px;
`

export const StyledHeader = styled(Layout.Header)`
  height: 48px;
  background-color: var(--white);
  border-bottom: 1px solid var(--gray);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px !important;
`

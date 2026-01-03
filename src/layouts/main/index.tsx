import { Outlet, useLocation, useNavigate } from 'react-router'
import { Content } from 'antd/es/layout/layout'
import { Logo, OutletWrapper, StyledHeader, Styledlayout, StyledSider } from './style'
import { ReactSVG } from 'react-svg'
import { Button, Menu, Tooltip, type MenuProps } from 'antd'
import { routes } from '../../config/router.config'
import { LogoutOutlined } from '@ant-design/icons'
import { useUserStore } from '../../stores/userStore'

const MainLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearUser } = useUserStore()

  const mapRoutesToMenuItems = (): MenuProps['items'] => {
    if (!routes.length) return []

    return routes.map((child) => {
      const raw = child.path.replace(/^\/+/, '')
      const title = raw ? raw.replace(/(^\w|-\w)/g, (match) => match.replace('-', ' ').toUpperCase()) : 'NAV'

      return {
        key: raw || 'nav',
        label: child.label ?? title,
      }
    })
  }

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  return (
    <Styledlayout>
      <StyledSider width={230}>
        <Logo>
          <ReactSVG src="logo.svg" />
        </Logo>
        <Menu
          theme="dark"
          mode="inline"
          items={mapRoutesToMenuItems()}
          selectedKeys={[location.pathname.replace('/', '')]}
          onClick={(key) => navigate('/' + key.keyPath)}
        />
      </StyledSider>
      <Content>
        <StyledHeader>
          <Tooltip title="Sign out">
            <Button onClick={() => handleLogout()} icon={<LogoutOutlined />} />
          </Tooltip>
        </StyledHeader>
        <OutletWrapper>
          <Outlet />
        </OutletWrapper>
      </Content>
    </Styledlayout>
  )
}

export default MainLayout

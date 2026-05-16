import { Outlet, useLocation, useNavigate } from 'react-router'
import { Content } from 'antd/es/layout/layout'
import { Logo, OutletWrapper, StyledHeader, Styledlayout, StyledSider } from './style'
import { ReactSVG } from 'react-svg'
import { Button, Menu, Tooltip, type MenuProps } from 'antd'
import { routes } from '../../config/router.config'
import { LogoutOutlined } from '@ant-design/icons'
import { useUserStore } from '../../stores/userStore'
import { hasPermission } from '../../helpers/hasPermission'
import { getPermissions } from '../../helpers/getPermission'
import { isSuperAdmin } from '../../helpers/getAccessLevel'

const MainLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearUser, accessToken } = useUserStore()

  const userPermissions = accessToken ? getPermissions(accessToken) : []
  const superAdmin = isSuperAdmin(accessToken)

  const mapRoutesToMenuItems = (): MenuProps['items'] => {
    if (!routes.length) return []

    return routes
      .filter((route) => !route.superAdminRequired || superAdmin)
      .filter((route) => superAdmin || (route.permission ? hasPermission(route.permission, userPermissions) : true))
      .filter((route) => route.path != '*')
      .flatMap((child) => {
        const raw = child.path.replace(/^\/+/, '')

        const title = raw
          ? raw.replace(/(^\w|-\w)/g, (match) => match.replace('-', ' ').toUpperCase())
          : 'NAV'

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

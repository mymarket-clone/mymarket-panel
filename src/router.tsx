import { Navigate, useRoutes, type RouteObject } from 'react-router'
import { routes } from './config/router.config'
import { useUserStore } from './stores/userStore'
import LoginView from './views/login'
import GoogleCallback from './views/login/GoogleCallback'
import MainLayout from './layouts/main'
import React from 'react'
import type { Route } from './types/Route'
import type { ProtectedRouteProps } from './types/ProtectedRoute'
import { getPermissions } from './helpers/getPermission'
import ForbiddenView from './views/forbidden/forbidden'
import { isSuperAdmin } from './helpers/getAccessLevel'

export const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  guard = true,
  permissions,
  superAdminRequired,
}: ProtectedRouteProps) => {
  const accessToken = useUserStore((s) => s.accessToken)

  if (guard && !accessToken) return <Navigate to={redirectTo} replace />
  if (!guard && accessToken) return <Navigate to="/attributes" replace />

  const superAdmin = isSuperAdmin(accessToken)

  if (superAdminRequired && !superAdmin) {
    return <Navigate to="/403" replace />
  }

  if (permissions && accessToken && !superAdmin) {
    const userPermissions = getPermissions(accessToken)
    const required = Array.isArray(permissions) ? permissions : [permissions]
    const allowed = required.some((p) => userPermissions.includes(p))

    if (!allowed) {
      return <Navigate to="/403" replace />
    }
  }

  return <>{children}</>
}

function mapRoutes(appRoutes: Route[]): RouteObject[] {
  const mainChildren: RouteObject[] = appRoutes.map((route) => {
    const fullPath = route.path.startsWith('/') ? route.path.replace(/^\//, '') : route.path
    const element = route.view ? React.createElement(route.view) : null

    const wrappedElement =
      route.guard !== undefined || route.redirectTo || route.permission || route.superAdminRequired ? (
        <ProtectedRoute
          guard={route.guard ?? true}
          redirectTo={(route.redirectTo as string) ?? '/login'}
          permissions={route.permission}
          superAdminRequired={route.superAdminRequired}
        >
          {element}
        </ProtectedRoute>
      ) : (
        element
      )

    return {
      path: fullPath,
      element: wrappedElement,
      children: route.children ? mapRoutes(route.children) : undefined,
    } as RouteObject
  })

  const routeObjects: RouteObject[] = [
    {
      path: '/google-callback',
      element: <GoogleCallback />,
    },
    {
      path: '/login',
      element: (
        <ProtectedRoute guard={false} redirectTo="/attributes">
          <LoginView />
        </ProtectedRoute>
      ),
    },
    {
      path: '/',
      element: (
        <ProtectedRoute guard={true} redirectTo="/login">
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/attributes" replace /> },
        { path: '403', element: <ForbiddenView /> },
        ...mainChildren,
      ],
    },
  ]

  return routeObjects
}

export function AppRouter() {
  const routeObjects = mapRoutes(routes)
  return useRoutes(routeObjects)
}

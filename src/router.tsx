import { Navigate, useRoutes, type RouteObject } from 'react-router'
import { routes } from './config/router.config'
import { useUserStore } from './stores/userStore'
import LoginView from './views/login'
import MainLayout from './layouts/main'
import React from 'react'
import type { ReactNode } from 'react'
import type { Route } from './types/Route'
import type { ProtectedRouteProps } from './types/ProtectedRoute'

export const ProtectedRoute = ({ children, redirectTo = '/login', guard = true }: ProtectedRouteProps) => {
  const user = useUserStore((s) => s.user)

  if (guard && !user) return <Navigate to={redirectTo} replace />
  if (!guard && user) return <Navigate to={redirectTo} replace />

  return <>{children as ReactNode}</>
}

function mapRoutes(appRoutes: Route[]): RouteObject[] {
  const mainChildren: RouteObject[] = appRoutes.map((route) => {
    const fullPath = route.path.startsWith('/') ? route.path.replace(/^\//, '') : route.path
    const element = route.view ? React.createElement(route.view) : null

    const wrappedElement =
      route.guard !== undefined || route.redirectTo ? (
        <ProtectedRoute guard={route.guard ?? true} redirectTo={(route.redirectTo as string) ?? '/login'}>
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
      children: [{ index: true, element: <Navigate to="/attributes" replace /> }, ...mainChildren],
    },
  ]

  return routeObjects
}

export function AppRouter() {
  const routeObjects = mapRoutes(routes)
  return useRoutes(routeObjects)
}

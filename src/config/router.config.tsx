import type { Route } from '../types/Route'
import CategoriesView from '../views/categories'

export const routes: Route[] = [
  {
    path: 'categories',
    view: CategoriesView,
  },
]

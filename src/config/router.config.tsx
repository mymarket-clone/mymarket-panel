import type { Route } from '../types/Route'
import AttributesView from '../views/attributes'
import CategoriesView from '../views/categories'
import UnitsView from '../views/units'

export const routes: Route[] = [
  {
    path: 'attributes',
    view: AttributesView,
  },
  {
    path: 'units',
    view: UnitsView,
  },
  {
    path: 'categories',
    view: CategoriesView,
  },
]

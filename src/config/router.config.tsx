import type { Route } from '../types/Route'
import AttributesView from '../views/attributes'
import BrandsView from '../views/brands'
import CategoriesView from '../views/categories'
import NotFoundView from '../views/not-found/not-found'
import RolesView from '../views/roles'
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
  {
    path: 'brands',
    view: BrandsView,
  },
  {
    path: 'roles',
    view: RolesView,
  },
  {
    path: '*',
    view: NotFoundView,
  },
]

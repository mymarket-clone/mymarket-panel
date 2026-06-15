import type { Route } from '../types/Route'
import AttributesView from '../views/attributes'
import BrandsView from '../views/brands'
import CategoriesView from '../views/categories'
import NotFoundView from '../views/not-found/not-found'
import RolesView from '../views/roles'
import PricesView from '../views/prices'
import UnitsView from '../views/units'
import UsersView from '../views/users'
import { PermissionsType } from '../types/enums/PermissionsType'

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
    path: 'users',
    view: UsersView,
    permission: PermissionsType.UsersView,
  },
  {
    path: 'prices',
    label: 'Prices',
    view: PricesView,
    superAdminRequired: true,
  },
  {
    path: '*',
    view: NotFoundView,
  },
]

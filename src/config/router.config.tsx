import type { Route } from '../types/Route'
import AttributesView from '../views/attributes'

export const routes: Route[] = [
  {
    path: 'attributes',
    view: AttributesView,
  },
]

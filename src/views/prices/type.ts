export enum ListingServiceType {
  Vip = 1,
  VipPlus = 2,
  SuperVip = 3,
  Color = 4,
  AutoRenewal = 5,
}

export type ListingServicePrice = {
  id: number
  serviceType: ListingServiceType
  fromDay: number
  toDay: number
  pricePerDay: number
  originalPricePerDay?: number | null
  isActive: boolean
}

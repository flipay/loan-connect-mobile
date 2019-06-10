import { ImageSourcePropType } from 'react-native'

export type AssetId = 'THB' | 'BTC' | 'ETH' | 'XRP' | 'BNB' | 'OMG'
type PriceSource = 'bxth' | 'binance'

export interface Asset {
  id: AssetId
  name: string
  image: ImageSourcePropType
  unit: string
  decimal: number
  priceSource: PriceSource
  amount?: number
  price?: number
  address: string
  tag?: string
  about?: string
  order: number
}
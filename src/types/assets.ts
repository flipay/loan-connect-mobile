import { ImageSourcePropType } from 'react-native'

export type AssetId = 'THB' | 'BTC' | 'ETH' | 'XRP' | 'BNB' | 'OMG'

export interface Asset {
  id: AssetId
  name: string
  coinStatsId?: string
  image: ImageSourcePropType
  unit: string
  decimal: number
  amount?: number
  price?: number
  dailyChange?: number
  address: string
  tag?: string
  about?: string
  order: number
}
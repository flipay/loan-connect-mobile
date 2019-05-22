import { ImageSourcePropType } from 'react-native'

export type AssetId = 'THB' | 'BTC' | 'ETH' | 'XRP' | 'BNB' | 'OMG'

export interface Asset {
  id: AssetId
  name: string
  image: ImageSourcePropType
  unit: string
  order: number
  decimal: number
  amount?: number
  price?: number
  address: string
  tag?: string
}
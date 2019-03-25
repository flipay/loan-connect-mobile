import { ImageSourcePropType } from 'react-native'

export type AssetId = 'THB' | 'BTC'

export interface Asset {
  id: AssetId
  name: string
  image: ImageSourcePropType
  unit: string
  order: number
  amount?: number
  price?: number
}
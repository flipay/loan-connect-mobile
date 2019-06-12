
import { AssetId } from './assets'

export interface MarketPrice {
  id: AssetId
  price: number,
  dailyChange: number
}
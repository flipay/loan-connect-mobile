
import { AssetId } from './assets'

interface MarketPrice {
  price: number,
  dailyChange: number
}

export type MarketPrices = { [key in AssetId]: MarketPrice }
import { AssetId } from './assets'

export type OrderSide = 'buy' | 'sell'
export type OrderPart = 'give' | 'take'
export type OrderType = 'market' | 'limit'
export type OrderStatus = 'open' | 'canceled' | 'completed'

export interface Order {
  id: number
  type: OrderType,
  created: string,
  side: OrderSide,
  assetId: AssetId,
  price: number,
  thbAmount: number,
  cryptoAmount: number
  status: OrderStatus
}
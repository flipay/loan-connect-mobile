import axios from 'axios'
import _ from 'lodash'
import { AssetId, OrderType, Order } from '../types'
import { getErrorCode } from '../utils'

export async function executeOrder (
  assetGive: AssetId,
  assetTake: AssetId,
  amountGive: number,
  expectedAmountTake: number,
  type: OrderType
) {
  let response
  try {
    response = await axios.post('orders', {
      asset_give: assetGive,
      asset_take: assetTake,
      amount_give: amountGive,
      expected_amount_take: expectedAmountTake,
      type
    })
  } catch (err) {
    if (getErrorCode(err) === 'resource_not_found') {
      await axios.post('wallets', {
        asset: assetTake
      })
      response = await axios.post('orders', {
        asset_give: assetGive,
        asset_take: assetTake,
        amount_give: amountGive,
        expected_amount_take: expectedAmountTake
      })
    } else {
      throw(err)
    }
  }
  return response.data.data
}

export async function fetchOrdersByAssetId (assetId: AssetId): Promise<Array<Order>> {
  const response = await axios.get(`orders?asset=${assetId}`)
  const orders = response.data.data
  const formattedOrders = _.map(orders, (order) => {
    const side = order.asset_give === 'THB' ? 'buy' : 'sell'
    return {
      id: order.id,
      type: order.type,
      created: order.created_at,
      side,
      assetId: side === 'buy' ? order.asset_take : order.asset_give,
      thbAmount: side === 'buy' ? order.amount_give : order.amount_take,
      cryptoAmount: side === 'buy' ? order.amount_take : order.amount_give
    }
  })
  return formattedOrders
}

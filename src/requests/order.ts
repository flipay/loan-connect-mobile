import axios from 'axios'
import _ from 'lodash'
import { AssetId, OrderType } from '../types'
import { getErrorCode } from '../utils'

export async function order (
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
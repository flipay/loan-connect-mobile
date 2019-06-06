import axios from 'axios'
import _ from 'lodash'
import Promise from 'bluebird'
import Sentry from 'sentry-expo'
import { OrderType, OrderPart, AssetId } from '../types'
import { ASSETS, COMPETITOR_IDS } from '../constants'
import { getErrorCode } from '../utils'

async function getMarketPrice (assetId: AssetId, btcPrice: number) {
  if (assetId === 'THB') { return 1 }
  try {
    const response = await axios.get(`tickers?exchange=BX.in.th&pair=${assetId}-THB`, {
      baseURL: 'https://api.coinstats.app/public/v1/',
      headers: ''
    })
    const price = response.data.tickers[0].price
    return price
  } catch (err) {
    try {
      // NOTE: handle the assets which are not available in BX Thailand
      const response = await axios.get(`tickers?exchange=Binance&pair=${assetId}-BTC`, {
        baseURL: 'https://api.coinstats.app/public/v1/',
        headers: ''
      })
      return response.data.tickers[0].price * btcPrice
    } catch (err) {
      return undefined
    }
  }
}

async function getAssetData (assetId: AssetId, assets: any) {
  try {
    const response = await axios.get(`wallets/${assetId}/balance`)
    assets[assetId].amount = Number(response.data.data.amount)
  } catch (err) {
    if (getErrorCode(err) === 'resource_not_found') {
      assets[assetId].amount = 0
    } else {
      throw(err)
    }
  }
  const price = await getMarketPrice(assetId, assets.BTC.price)
  assets[assetId].price = price
}

export async function getPortfolio () {
  const assets = ASSETS
  const assetIds = _.map(assets, asset => asset.id)
  const btcAssetId = 'BTC'
  const normalAssetIds = _.reject(assetIds, (id) => id === btcAssetId)
  await getAssetData(btcAssetId, assets)
  await Promise.map(normalAssetIds, (id) => {
    return getAssetData(id, assets)
  })

  const arrayAssets = _.map(assets, asset => asset)
  return _.sortBy(arrayAssets, asset => asset.order)
}

export async function getAmount (
  orderType: OrderType,
  assetId: AssetId,
  specifiedPart: OrderPart,
  amount: number,
  provider: string
) {
  if (amount === 0) { return 0 }
  const response = await axios.get(
    `/rates/${orderType === 'buy' ? 'THB' : assetId}/${
      orderType === 'sell' ? 'THB' : assetId
    }`,
    {
      params: {
        provider,
        [`amount_${specifiedPart}`]: amount
      }
    }
  )
  const { data } = response
  const resultAssetBox = specifiedPart === 'give' ? 'take' : 'give'
  return data.data[`amount_${resultAssetBox}`]
}

export async function getCompetitorTHBAmounts (
  orderType: OrderType,
  assetId: AssetId,
  cryptoAmount: number
) {
  const result = await Promise.map(COMPETITOR_IDS, async (providerId) => {
    let amount
    try {
      amount = await getAmount(
        orderType,
        assetId,
        orderType === 'buy' ? 'take' : 'give',
        cryptoAmount,
        providerId
      )
    } catch (err) {
      Sentry.captureException(err)
      amount = getErrorCode(err)
    }
    return [providerId, amount]
  })
  return _.fromPairs(result)
}
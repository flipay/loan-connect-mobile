import axios from 'axios'
import _ from 'lodash'
import Bluebird from 'bluebird'
import Sentry from 'sentry-expo'
import { OrderType, OrderPart, AssetId } from '../types'
import { ASSETS, COMPETITOR_IDS } from '../constants'
import { getErrorCode } from '../utils'

async function getPriceInTHB (assetId: AssetId): Promise<number | undefined> {
  if (assetId === 'THB') { return 1 }
  try {
    const response = await axios.get(`tickers?exchange=BX.in.th&pair=${assetId}-THB`, {
      baseURL: 'https://api.coinstats.app/public/v1/',
      headers: ''
    })
    const price = response.data.tickers[0].price
    return price
  } catch (err) {
    return undefined
  }
}

async function getPriceInBTC (assetId: AssetId): Promise<number> {
  const response = await axios.get(`tickers?exchange=Binance&pair=${assetId}-BTC`, {
    baseURL: 'https://api.coinstats.app/public/v1/',
    headers: ''
  })
  return response.data.tickers[0].price
}

interface AssetData {
  amount: number,
  price?: number,
  priceInBTC?: number
}

export async function fetchMarketPrices () {
  const assets = _.map(ASSETS)
  const results = await Bluebird.map(assets, async (asset) => {
    let priceInTHB
    let priceInBTC
    if (asset.priceSource === 'bxth') {
      priceInTHB = await getPriceInTHB(asset.id)
    } else {
      priceInBTC = await getPriceInBTC(asset.id)
    }
    return {
      ...asset,
      priceInTHB,
      priceInBTC
    }
  })

  const btc = _.find(results, (asset) => asset.id === 'BTC')
  let btcPrice: number
  if (btc) {
    btcPrice = btc.priceInTHB || 0
  }

  return _.map(results, (asset) => {
    return {
      id: asset.id,
      price: asset.priceInTHB ? asset.priceInTHB : ((asset.priceInBTC || 0) * btcPrice),
      dailyChange: 24
    }
  })
}

async function getAssetData (assetId: AssetId): Promise<AssetData> {
  let amount
  try {
    const response = await axios.get(`wallets/${assetId}/balance`)
    amount = Number(response.data.data.amount)
  } catch (err) {
    if (getErrorCode(err) === 'resource_not_found') {
      amount = 0
    } else {
      throw(err)
    }
  }
  const price = await getPriceInTHB(assetId)
  let priceInBTC
  if (!price) {
    priceInBTC = await getPriceInBTC(assetId)
  }

  return { amount, price, priceInBTC }
}

export async function getPortfolio () {
  const assets = ASSETS
  const assetIds = _.map(assets, asset => asset.id)
  let assetsWithData = await Bluebird.map(assetIds, async (id) => {
    const assetData = await getAssetData(id)
    return {
      ...assets[id],
      ...assetData
    }
  })

  // NOTE: handle when there is not THB price in BX Thailand
  const btc = _.find(assetsWithData, (asset) => asset.id === 'BTC')
  if (btc) {
    const btcPrice = btc.price
    assetsWithData = _.map(assetsWithData, (asset) => {
      if (!asset.price && asset.priceInBTC && btcPrice) {
        return {
          ...asset,
          price: asset.priceInBTC * btcPrice
        }
      }
      return asset
    })
  }
  return _.sortBy(assetsWithData, asset => asset.order)
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
  const result = await Bluebird.map(COMPETITOR_IDS, async (providerId) => {
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
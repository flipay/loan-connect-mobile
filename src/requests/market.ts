import axios from 'axios'
import _ from 'lodash'
import Bluebird from 'bluebird'
import { OrderType, OrderPart, AssetId, Asset } from '../types'
import { ASSETS, COMPETITOR_IDS } from '../constants'
import { getErrorCode } from '../utils'
import * as ErrorReport from '../services/ErrorReport'

export async function fetchMarketPrices () {
  const request = axios.create({
    baseURL: 'https://api.coinstats.app/public/v1/'
  })
  const cryptoMarketDataPromise = request.get('coins?skip=0&limit=150')
  const fiatMarketDataPromise = request.get('fiats')
  const responses = await Promise.all([cryptoMarketDataPromise, fiatMarketDataPromise])
  const [cryptoMarketDataResponse, fiatMarketDataResponse] = responses
  const thbPerDollar = _.find(fiatMarketDataResponse.data, (fiat) => fiat.name === 'THB').rate

  return _(ASSETS)
    .map((asset) => {
      const { id } = asset
      let price
      let dailyChange
      if (id === 'THB') {
        price = 1
        dailyChange = 1
      } else {
        const data = _.find(cryptoMarketDataResponse.data.coins, (coin) => coin.symbol === id)
        price = data.price * thbPerDollar
        dailyChange = data.priceChange1d
      }

      return [id, { price, dailyChange }]
    })
    .fromPairs()
    .value()
}

export async function fetchBalances () {
  const assets = _.map(ASSETS)
  const balances = await Bluebird.map(assets, async (asset: Asset) => {
    const { id } = asset
    const response = await axios.get(`wallets/${id}/balance`)
    const amount = Number(response.data.data.amount)
    return [
      id,
      amount
    ]
  })
  return _.fromPairs(balances)
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
      ErrorReport.notify(err)
      amount = getErrorCode(err)
    }
    return [providerId, amount]
  })
  return _.fromPairs(result)
}
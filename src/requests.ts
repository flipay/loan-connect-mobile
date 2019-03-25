import axios from 'axios'
import _ from 'lodash'
import Promise from 'bluebird'
import { OrderType, OrderPart, AssetId } from './types'
import { ASSETS } from './constants'

export async function signUp (phoneNumber: string) {
  const response = await axios.post('/sign_up', { phone_number: phoneNumber })
  return response.data.user
}

export async function submitOtp (accountId: string, otpNumber: string) {
  const response = await axios.post(`accounts/${accountId}/verify`, {
    otp_number: otpNumber
  })
  return response.data.user
}

export async function createPin (accountId: string, pin: string) {
  const response = await axios.post(`accounts/${accountId}/create_pin`, {
    pin
  })
  return response.data.user
}

export async function logIn (accountId: string, pin: string) {
  const response = await axios.post(`log_in`, {
    account_id: accountId,
    pin
  })
  return response.data.user
}

export function getBalance (asset: AssetId) {
  return axios.get(
    `/wallet/${asset}/balance`,
    {
      baseURL: 'https://api.flipay.co/v1/flipay'
    }
  )
}

export async function getPortfolio () {
  const arrayAssets = _.map(ASSETS, (asset) => asset)
  const orderedAssets = _.sortBy(arrayAssets, (asset) => asset.order)
  const responses = await Promise.map((orderedAssets), (asset) => {
    return getBalance(asset.id)
  })
  return _.map(responses, (object, index) => {
    return {
      amount: object.data.data.amount,
      ...orderedAssets[index]
    }
  })
}

export async function getAmount (
  orderType: OrderType,
  assetId: AssetId,
  specifiedPart: OrderPart,
  amount: number,
  provider: string
) {
  return axios.get(
    `/rates/${orderType === 'buy' ? 'THB' : assetId}/${orderType === 'sell' ? 'THB' : assetId}`,
    {
      baseURL: 'http://api.flipay.co/v1/flipay/',
      params: {
        provider,
        [`amount_${specifiedPart}`]: amount
      }
    }
  )
}

export async function getAllAmounts (
  orderType: OrderType,
  assetId: AssetId,
  cryptoAmount: number
) {
  console.log('it does not work yet, wating for take side to work')
}
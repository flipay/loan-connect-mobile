import axios from 'axios'
import { Alert } from 'react-native'
import _ from 'lodash'
import Promise from 'bluebird'
import { OrderType, OrderPart, AssetId } from './types'
import { ASSETS } from './constants'
import { setToken, getToken } from './secureStorage'

export function setBaseUrl (url: string) {
  axios.defaults.baseURL = url
}

function setAuthorization (token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  const min = 20
  setTimeout(() => {
    axios.defaults.headers.common.Authorization = ''
  }, min * 60 * 1000)
}

export async function setUpPin (token: string, pin: string) {
  await setToken(token, pin)
  setAuthorization(token)
}

export async function unlock (pin: string) {
  const token = await getToken(pin)
  setAuthorization(token)
}

export async function authen (phoneNumber: string) {
  const payload = {
    phone_number: '66' + phoneNumber.substring(1)
  }
  let response
  try {
    response = await axios.post('auth/signup', payload)
  } catch (signUpErr) {
    switch (signUpErr.response.status) {
      case 409:
        try {
          response = await axios.post('auth/login', payload)
        } catch (logInErr) {
          Alert.alert(logInErr.request._response)
        }
        break
      case 422:
        Alert.alert('Invalid phone number format')
        break
      default:
        Alert.alert('Something went wrong.')
    }
  }
  return response && response.data
}

export async function submitOtp (token: string, otpNumber: string) {
  const response = await axios.post(
    `auth/verify`,
    { code: otpNumber },
    { headers: { Authorization: 'Bearer ' + token } }
  )
  return response.data
}

function getBalance (asset: AssetId) {
  return axios.get(`wallets/${asset}/balance`)
}

export async function getPortfolio () {
  const arrayAssets = _.map(ASSETS, (asset) => asset)
  const orderedAssets = _.sortBy(arrayAssets, (asset) => asset.order)
  let responses
  try {
    responses = await Promise.map((orderedAssets), (asset) => {
      return getBalance(asset.id)
    })
    return _.map(responses, (object, index) => {
      return {
        amount: object.data.data.amount,
        ...orderedAssets[index]
      }
    })
  } catch (err) { // HACK: when I get 404 everything is gone
    return _.map(orderedAssets, (asset) => (
      {
        amount: 0,
        ...asset
      }
    ))
  }

}

export async function getAmount (
  orderType: OrderType,
  assetId: AssetId,
  specifiedPart: OrderPart,
  amount: number,
  provider: string
) {
  return axios.get(
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
}

export async function getAllAmounts (
  orderType: OrderType,
  assetId: AssetId,
  cryptoAmount: number
) {
  console.log('it does not work yet, wating for take side to work')
}

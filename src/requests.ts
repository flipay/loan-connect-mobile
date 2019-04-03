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

async function getBalance (asset: AssetId) {
  try {
    const response = await axios.get(`wallets/${asset}/balance`)
    return response.data.amount
  } catch (err) {
    return 0
  }
}

export async function getPortfolio () {
  const assets = ASSETS
  const thbAmount = await getBalance('THB')
  assets.THB.amount = thbAmount
  const btcAmount = await getBalance('BTC')
  assets.BTC.amount = btcAmount

  const arrayAssets = _.map(assets, (asset) => asset)
  return _.sortBy(arrayAssets, (asset) => asset.order)
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

export async function deposit (assetId: AssetId, amount: number) {
  try {
    await axios.post('wallets', { asset: 'THB' })
  } catch (err) {
    if (_.get(err, 'response.data.errors.asset[0]') !== 'has already been taken') {
      Alert.alert('Something went wrong')
    }
  }
  try {
    await axios.post(
      'deposits',
      {
        asset: assetId,
        amount
      }
    )
  } catch (err) {
    Alert.alert('Cannot request for deposit')
  }
}
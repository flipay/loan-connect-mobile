import axios from 'axios'
import aes from 'crypto-js/aes'
import { SecureStore } from 'expo'
import { Alert } from 'react-native'
import _ from 'lodash'
import Promise from 'bluebird'
import { OrderType, OrderPart, AssetId } from './types'
import { ASSETS } from './constants'

export function setBaseUrl (url: string) {
  axios.defaults.baseURL = url
}

export function setToken (token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  const min = 20
  setTimeout(() => {
    axios.defaults.headers.common.Authorization = ''
  }, min * 60 * 1000)
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

export async function encrypToken (token: string, pin: string) {
  const cipherText = aes.encrypt(token, pin).toString()
  try {
    await SecureStore.setItemAsync('encrypted-token', cipherText)
  } catch (err) {
    Alert.alert('Authentication failed')
  }
  return ''
}

async function decryptToken (pin: string) {
  try {
    const value = await SecureStore.getItemAsync('encrypted-token')
    const token = aes.decrypt(value, pin)
    return token
  } catch (err) {
    Alert.alert('Authentication failed')
  }
}

export async function unlock (pin: string) {
  try {
    const token = await decryptToken(pin)
    setToken(token)
    getBalance('THB') // try sending one request
  } catch (err) {
    Alert.alert('insert the wrong PIN')
  }
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

import axios from 'axios'
import { Alert } from 'react-native'
import _ from 'lodash'
// import Promise from 'bluebird'
import { OrderType, OrderPart, AssetId } from './types'
import { ASSETS } from './constants'
import { setToken, getToken } from './secureStorage'

async function getMarketPrice (assetId: AssetId) {
  const bxAssetId: { [key in AssetId]: string } = {
    THB: '',
    BTC: '1',
    ETH: '21',
    OMG: ''
  }
  try {
    const response = await axios.get(`trade/?parinng=${bxAssetId[assetId]}`, {
      baseURL: 'https://bx.in.th/api/',
      headers: ''
    })
    const price = Number(_.last(_.get(response, 'data.trades.rate')))
    return price
  } catch (err) {
    return undefined
  }
}

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
    return response.data.data.amount
  } catch (err) {
    return 0
  }
}

export async function getPortfolio () {
  const assets = ASSETS
  const thbAmount = await getBalance('THB')
  assets.THB.amount = thbAmount
  // const btcAmount = await getBalance('BTC')
  // const btcPrice = await getMarketPrice('BTC')
  // assets.BTC.price = btcPrice
  // assets.BTC.amount = btcAmount

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
    if (
      _.get(err, 'response.data.errors.asset[0]') !== 'has already been taken'
    ) {
      Alert.alert('Something went wrong')
    }
  }
  try {
    await axios.post('deposits', {
      asset: assetId,
      amount
    })
  } catch (err) {
    Alert.alert('Cannot request for deposit')
  }
}

export async function withdraw (
  amount: number,
  accountNumber: string,
  accountName: string,
  accountIssuer: string
) {
  await axios.post('withdrawals', {
    amount,
    bank_account_number: accountNumber,
    bank_account_name: accountName,
    bank_account_issuer: accountIssuer
  })
}

export async function order (
  assetGive: AssetId,
  assetTake: AssetId,
  amountGive: string,
  expectedAmountTake: string
) {

  try {
    await axios.post('orders', {
      asset_give: assetGive,
      asset_take: assetTake,
      amount_give: amountGive,
      expected_amount_take: expectedAmountTake
    })
  } catch (err) {
    if (getErrorCode(err) === 'resource_not_found') {
      await axios.post('wallets', {
        asset: assetTake
      })
      await axios.post('orders', {
        asset_give: assetGive,
        asset_take: assetTake,
        amount_give: amountGive,
        expected_amount_take: expectedAmountTake
      })
    } else {
      throw(err)
    }
  }
}

function getErrorCode (err: Error) {
  return _.get(err, 'response.data.code')
}
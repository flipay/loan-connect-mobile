import axios from 'axios'
import { Alert, AppState } from 'react-native'
import _ from 'lodash'
import Promise from 'bluebird'
import Sentry from 'sentry-expo'
import { OrderType, OrderPart, AssetId } from './types'
import { ASSETS, COMPETITOR_IDS } from './constants'
import { setToken, getToken } from './secureStorage'
import { setPhoneNumber, markFirstDepositAsDone } from './asyncStorage'
import { getErrorCode, getErrorDetail, alert } from './utils'
import { identify } from './analytics'

let navigation: any
let lockTimeout: any
let btcPrice: any

async function getMarketPrice (assetId: AssetId) {
  if (assetId === 'THB') { return 1 }
  try {
    const response = await axios.get(`tickers?exchange=BX.in.th&pair=${assetId}-THB`, {
      baseURL: 'https://api.coinstats.app/public/v1/',
      headers: ''
    })
    const price = response.data.tickers[0].price
    if (assetId === 'BTC') {
      btcPrice = price
    }
    return price
  } catch (err) {
    try {
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

export function setUpRequest (nav: any) {
  // 'https://flipay-mock-backend.herokuapp.com/'
  // 'http://192.168.0.4:8000'
  axios.defaults.baseURL = 'https://api.flipay.co/v1/'
  navigation = nav
}

function setLockTimeout () {
  clearTimeout(lockTimeout)
  const min = 30
  lockTimeout = setTimeout(() => {
    axios.defaults.headers.common.Authorization = ''
    if (AppState.currentState === 'active') {
      Alert.alert('The session is expired. please insert PIN again.', undefined, [{
        text: 'OK',
        onPress: () => {
          navigation.navigate('Starter')
        }
      }])
    } else {
      navigation.navigate('Starter')
    }
  }, min * 60 * 1000)
}

function setAuthorization (token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  setLockTimeout()
}

export async function finalizeAuthenProcess (token: string, pin: string) {
  await setToken(token, pin)
  setAuthorization(token)
  const { data } = await axios.get('users/me')
  if (data && data.data) {
    const { uid, phone_number } = data.data
    identify(uid, { phone_number })
    setPhoneNumber('0' + phone_number.substring(2))
  }
}

export async function unlock (pin: string) {
  const token = await getToken(pin)
  setAuthorization(token)
}

export async function lock () {
  clearTimeout(lockTimeout)
  axios.defaults.headers.common.Authorization = ''
  navigation.navigate('Starter')
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
        alert(signUpErr)
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
  const price = await getMarketPrice(assetId)
  assets[assetId].price = price
}

export async function getPortfolio () {
  const assets = ASSETS
  const assetIds = _.map(assets, asset => asset.id)

  await Promise.map(assetIds, (id) => {
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

export async function deposit (assetId: AssetId, amount: number) {
  try {
    await axios.post('wallets', { asset: 'THB' })
  } catch (err) {
    if (
      _.get(err, 'response.data.errors.asset[0]') !== 'has already been taken'
    ) {
      alert(err)
    }
  }
  try {
    await axios.post('deposits', {
      asset: assetId,
      amount
    })
    await markFirstDepositAsDone()
  } catch (err) {
    Alert.alert('Cannot request for deposit')
  }
}

export async function withdraw (
  assetId: AssetId,
  amount: number,
  address: string,
  tag?: string,
  accountName?: string,
  accountIssuer?: string
) {
  if (assetId === 'THB') {
    await axios.post('withdrawals', {
      asset: assetId,
      amount,
      bank_account_number: address,
      bank_account_name: accountName,
      bank_account_issuer: accountIssuer
    })
  } else {
    await axios.post('withdrawals', {
      asset: assetId,
      amount,
      address,
      crypto_transaction_identifier: tag
    })
  }
}

export async function order (
  assetGive: AssetId,
  assetTake: AssetId,
  amountGive: number,
  expectedAmountTake: number
) {
  let response
  try {
    response = await axios.post('orders', {
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
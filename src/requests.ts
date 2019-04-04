import axios from 'axios'
import { Alert } from 'react-native'
import _ from 'lodash'
import Promise from 'bluebird'
import { OrderType, OrderPart, AssetId } from './types'
import { ASSETS } from './constants'
import { setToken, getToken } from './secureStorage'

async function getMarketPrice (assetId: AssetId) {
  if (assetId === 'THB') { return 1 }
  const bxAssetId: { [key in AssetId]: string } = {
    THB: '',
    BTC: '1',
    ETH: '21',
    OMG: '26'
  }
  try {
    const response = await axios.get(`trade/?parinng=${bxAssetId[assetId]}`, {
      baseURL: 'https://bx.in.th/api/',
      headers: ''
    })
    const price = _.last(_.get(response, 'data.trades')).rate
    return Number(price)
  } catch (err) {
    return undefined
  }
}

let expiredAlertVisible = false

export function setUpRequest (navigation: any) {
  // 'https://flipay-mock-backend.herokuapp.com/'
  // 'http://192.168.0.4:8000'
  axios.defaults.baseURL = 'https://api.flipay.co/v1/'
  axios.defaults.validateStatus = (status: number) => {
    if (status === 401 && expiredAlertVisible === false) {
      expiredAlertVisible = true
      Alert.alert('The session is expired. please insert PIN again.', undefined, [{
        text: 'OK',
        onPress: () => {
          expiredAlertVisible = false
          navigation.navigate('Starter')
        }
      }])
    }
    return status >= 200 && status < 300
  }
}

function setAuthorization (token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  const min = 30
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
  return response
}

function getErrorCode (err: Error) {
  return _.get(err, 'response.data.code')
}
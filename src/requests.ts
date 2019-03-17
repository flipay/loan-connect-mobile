import axios from 'axios'
import { OrderType, OrderPart, AssetId } from './types'

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
      baseURL: 'http://api.flipay.co/v1/symmetry/',
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
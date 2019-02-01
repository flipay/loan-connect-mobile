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
  amount: number
) {
  const response = await axios.get('rates', {
    params: {
      asset_give: orderType === 'buy' ? 'THB' : assetId,
      asset_take: orderType === 'sell' ? 'THB' : assetId,
      [`amount_${specifiedPart}`]: amount
    }
  })
  const { data } = response
  return data.amount
}

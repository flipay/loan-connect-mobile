import axios from 'axios'
import { OrderType, OrderPart, AssetId } from './types'

export async function authen (phoneNumber: string) {
  console.log('kendo jaa authen ja')
  try {

    const response = await axios.post('auth/signup', { phone_number: phoneNumber })
    console.log('kendo jaa signup', response)
    const statusCode = response.status

  } catch (signUpErr) {
    const statusCode = signUpErr.request.status
    switch (statusCode) {
      case 200:
      console.log('kendo jaa eiei 200')
      break
      case 409: // already signup
      console.log('kendo jaa eiei 409')
      await axios.post('auth/login', { phone_number: phoneNumber })
      break
      case 422: 
      console.log('kendo jaa eiei 422')
      try {
        const loginResponse = await axios.post('auth/login', { phone_number: phoneNumber })
        console.log('kendo jaa eieiei login response', loginResponse)
      } catch (loginErr) {
        console.log('kendo jaa error again', loginErr.request.status)
      }
      break
      default:
      console.log('kendo jaa default ja', statusCode)
    }
  }
    
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
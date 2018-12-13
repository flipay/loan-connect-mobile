import axios from 'axios'

export async function signUp (phoneNumber: string) {
  const response = await axios.post('/sign_up', { phone_number: phoneNumber })
  return response.data.user
}

export async function submitOtp (accountNumber: string, otpNumber: string) {
  const response = await axios.post(`accounts/${accountNumber}/verify`, {
    otp_number: otpNumber
  })
  return response.data.user
}

export async function createPin (accountNumber: string, pin: string) {
  const response = await axios.post(`accounts/${accountNumber}/create_pin`, {
    pin
  })
  return response.data.user
}
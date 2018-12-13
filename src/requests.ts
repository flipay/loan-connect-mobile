import axios from 'axios'

export async function signUp (phoneNumber: string) {
  const response = await axios.post('/sign_up', { phone_number: phoneNumber })
  return response.data.user
}

export async function submitOtp (accountNumber: string, otpNumber: string) {
  try {
    const response = await axios.post(`accounts/${accountNumber}/verify`, {
      otp_number: otpNumber
    })
    if (response.status === 200) {
      return response.data.user
    }
  } catch (err) {
    console.error('error', err)
  }
}

export async function createPin (accountNumber: string, pin: string) {
  try {
    const response = await axios.post(`accounts/${accountNumber}/create_pin`, {
      pin
    })
    if (response.status === 200) {
      return response.data.user
    }
  } catch (err) {
    console.error('error', err)
  }
}
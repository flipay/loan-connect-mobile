
import axios from 'axios'
import { Alert, AppState } from 'react-native'
import { getErrorCode, alert } from '../utils'
import { setToken, getToken, clearToken } from '../secureStorage'
import { setPhoneNumber } from '../asyncStorage'
import { identify } from '../analytics'

let navigation: any
let lockTimeout: any

export function setUpRequest (nav: any) {
  // 'https://flipay-mock-backend.herokuapp.com/'
  // 'http://192.168.0.4:8000'
  axios.defaults.baseURL = 'https://api.flipay.co/v1/'
  navigation = nav

  axios.interceptors.response.use((response) => {
    return response
  }, (err) => {
    if (getErrorCode(err) === 'unauthorized') {
      Alert.alert(
        'The login token has expired.',
        'Please login again.',
        [{
          text: 'OK',
          onPress: async () => {
            await clearToken()
            navigation.navigate('Starter')
          }
        }],
        { cancelable: false }
      )
    }
    return Promise.reject(err)
  })
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


import axios from 'axios'
import _ from 'lodash'
import { Alert, AppState } from 'react-native'
import { getErrorCode, alert } from '../utils'
import { getToken, clearToken } from '../secureStorage'
import { PRIVATE_ROUTES } from '../constants'
import { getCurrentRouteName, navigate } from '../services/navigation'

let lockTimeout: any
let timeout: any
let shownUnauthorizedAlert: any

export function setUpRequest (nav: any) {
  // 'https://flipay-mock-backend.herokuapp.com/'
  // 'http://192.168.0.4:8000'
  axios.defaults.baseURL = 'https://api.flipay.co/v1/'
  axios.interceptors.response.use((response) => {
    return response
  }, (err) => {
    if (getErrorCode(err) === 'unauthorized') {
      if (!shownUnauthorizedAlert && !timeout) {
        Alert.alert(
          'The login token has expired.',
          'Please login again.',
          [{
            text: 'OK',
            onPress: async () => {
              await clearToken()
              shownUnauthorizedAlert = false
              navigate('Starter')
            }
          }],
          { cancelable: false }
        )
        shownUnauthorizedAlert = true
      }
      return new Promise(_.noop)
    } else {
      return Promise.reject(err)
    }
  })
}

function setLockTimeout () {
  clearTimeout(lockTimeout)
  const min = 30
  lockTimeout = setTimeout(() => {
    timeout = true
    axios.defaults.headers.common.Authorization = ''
    if (AppState.currentState === 'active') {
      const privateRoutes = _.map(PRIVATE_ROUTES)
      if (_.includes(privateRoutes, getCurrentRouteName())) {
        Alert.alert('The session is expired. please insert PIN again.', undefined, [{
          text: 'OK',
          onPress: () => {
            navigate('Starter')
          }
        }])
      }
    } else {
      navigate('Starter')
    }
  }, min * 60 * 1000)
}

export function setAuthorization (token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  setLockTimeout()
}

export function isLocked () {
  return !axios.defaults.headers.common.Authorization
}

export async function unlock (pin: string) {
  const token = await getToken(pin)
  setAuthorization(token)
}

export async function lock () {
  clearTimeout(lockTimeout)
  axios.defaults.headers.common.Authorization = ''
  navigate('Starter')
}

export async function authen (phoneNumber: string) {
  const payload = {
    phone_number: '66' + phoneNumber.substring(1)
  }
  let response
  try {
    response = await axios.post('auth/signup', payload)
  } catch (signUpErr) {
    switch (getErrorCode(signUpErr)) {
      case 'conflict':
        try {
          response = await axios.post('auth/login', payload)
        } catch (logInErr) {
          if (getErrorCode(logInErr) === 'too_many_requests') {
            handleTooManyRequests()
          } else {
            alert(logInErr)
          }
        }
        break
      case 'too_many_requests':
        handleTooManyRequests()
        break
      case 'invalid_number':
        alert('Invalid phone number format')
        break
      default:
        alert(signUpErr)
    }
  }
  return response && response.data
}

function handleTooManyRequests () {
  alert('Too many reqests for OTP. You can request again after 30 seconds.')
}

export async function submitOtp (otpToken: string, otpNumber: string) {
  const response = await axios.post(
    `auth/verify`,
    { code: otpNumber },
    { headers: { Authorization: 'Bearer ' + otpToken } }
  )
  const { token: accessToken } = response.data
  setAuthorization(accessToken)
  return accessToken
}

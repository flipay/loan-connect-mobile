import { AsyncStorage } from 'react-native'
import Sentry from 'sentry-expo'

async function setData (key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (err) {
    Sentry.captureException(err)
  }
}

async function getData (key: string) {
  try {
    const value = await AsyncStorage.getItem(key)
    return value
  } catch (err) {
    Sentry.captureException(err)
    return undefined
  }
}

export async function setPhoneNumber (phoneNumber: string) {
  await setData('phoneNumber', phoneNumber)
}

export async function getPhoneNumber () {
  return getData('phoneNumber')
}
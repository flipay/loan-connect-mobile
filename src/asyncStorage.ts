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

const PHONE_NUMBER = 'phoneNumber'

export async function setPhoneNumber (phoneNumber: string) {
  await setData(PHONE_NUMBER, phoneNumber)
}

export async function getPhoneNumber () {
  return getData(PHONE_NUMBER)
}

const FIRST_RUN = 'firstRun'

export async function setFirstRun () {
  await setData(FIRST_RUN, 'true')
}

export async function isFirstRun () {
  return getData(FIRST_RUN)
}
import { AsyncStorage } from 'react-native'
import * as ErrorReport from './services/ErrorReport'

async function setData (key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (err) {
    ErrorReport.notify(err)
  }
}

async function getData (key: string) {
  try {
    const value = await AsyncStorage.getItem(key)
    return value
  } catch (err) {
    ErrorReport.notify(err)
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

// NOTE: below are First time on the app related functions
const DONE_STATUS = 'done'
const RUN_APP = 'runApp'
const DEPOSIT = 'firstDeposit'

function createMarkAsDoneFunction (key: string) {
  return async () => {
    await setData(key, DONE_STATUS)
  }
}

function createHasEverDoneFunction (key: string) {
  return async () => {
    const result = await getData(key)
    return result === DONE_STATUS
  }
}

function createIsFirstTimeFunction (key: string) {
  const hasEverDoneFunction = createHasEverDoneFunction(key)
  return async () => {
    const done = await hasEverDoneFunction()
    return !done
  }
}

export const runFirstTime = createMarkAsDoneFunction(RUN_APP)
export const isFirstRun = createIsFirstTimeFunction(RUN_APP)
export const markFirstDepositAsDone = createMarkAsDoneFunction(DEPOSIT)
export const hasEverDeposit = createHasEverDoneFunction(DEPOSIT)
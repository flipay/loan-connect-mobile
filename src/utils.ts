import _ from 'lodash'
import { Alert } from 'react-native'
import { THBAmountTypes } from './constants'
import { OrderType } from './types'

export function toNumber (value: string) {
  const valueInStringWithoutComma = _.replace(value, /,/g, '')
  return Number(valueInStringWithoutComma)
}

export function toString (value: number, decimal: number) {
  if (decimal < 0) { throw Error('not accept minus decimal') }
  let floored = Math.floor(value)

  if (decimal > 0) {
    const multiplier = Math.pow(10, decimal)
    floored = Math.floor(value * multiplier) / multiplier
  }
  const result = floored.toLocaleString(undefined, { maximumFractionDigits: decimal })
  return result
}

export function getErrorCode (err: Error) {
  return _.get(err, 'response.data.code')
}

export function alert (err: Error) {
  return Alert.alert(`Something went wrong: ${JSON.stringify(_.get(err, 'response.data.errors'))}`)
}

export function calSaveAmount (side: OrderType, amount: number, thbAmounts?: THBAmountTypes) {
  if (!thbAmounts) { return 0 }
  const amounts = _.map(thbAmounts)
  if (side === 'buy') {
    const worstAmount = _.min(amounts)
    if (!worstAmount) { return 0 }
    if (worstAmount <= amount) {
      return 0
    } else {
      return worstAmount - amount
    }
  } else {
    const worstAmount = _.max(amounts)
    if (!worstAmount) { return 0 }
    if (worstAmount >= amount) {
      return 0
    } else {
      return amount - worstAmount
    }
  }
}
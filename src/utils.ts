import * as _ from 'lodash'
import { Alert } from 'react-native'

import { THBAmountTypes, ASSETS } from './constants'
import { OrderSide, AssetId } from './types'
import * as ErrorReport from './services/ErrorReport'

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

export function showPrice (value: number) {
  let decimal = 0
  for (let i = 0; i < 6 ; i++) {
    const comparison = Math.pow(10, i)
    if (value < comparison) {
      decimal = 6 - i
      break
    }
  }
  return toString(value, decimal)
}

export function getErrorCode (err: Error) {
  return _.get(err, 'response.data.code')
}

export function getErrorDetail (err: Error) {
  return _.get(err, 'response.data.errors.detail')
}

export function alert (err: Error | string) {
  if (typeof err === 'string') {
    return Alert.alert(`Something went wrong: ${err}`)
  } else {
    ErrorReport.notify(err)
    if (getErrorDetail(err)) {
      return Alert.alert(`Something went wrong: ${getErrorDetail(err)}`)
    } else {
      console.log('========error object========', JSON.stringify(err, undefined, 2))
      console.log('========error message========', JSON.stringify(err.message, undefined, 2))
      return Alert.alert(`Something went wrong, Please contact our customer support team`)
    }
  }
}

export function calSaveAmount (side: OrderSide, amount: number, thbAmounts?: THBAmountTypes) {
  if (!thbAmounts) {
    return 0
  }
  const amounts = _.map(thbAmounts, (value) => Number(value))
  const validAmounts = _.filter(amounts, (value) => !isNaN(value))
  if (side === 'buy') {
    const worstAmount = _.max(validAmounts)
    if (!worstAmount) {
      return 0
    }
    if (worstAmount <= amount) {
      return 0
    } else {
      return worstAmount - amount
    }
  } else {
    const worstAmount = _.min(validAmounts)
    if (!worstAmount) {
      return 0
    }
    if (worstAmount >= amount) {
      return 0
    } else {
      return amount - worstAmount
    }
  }
}

export function calLimitTakeAmount (side: OrderSide, assetId: AssetId, giveAmount: string, limitPrice?: number) {
  if (!limitPrice) {
    return undefined
  }
  if (side === 'buy') {
    return toString(
      toNumber(giveAmount) / limitPrice,
      ASSETS[assetId].decimal
    )
  } else {
    return toString(
      toNumber(giveAmount) * limitPrice,
      ASSETS.THB.decimal
    )
  }
}
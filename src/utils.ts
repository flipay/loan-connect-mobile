import _ from 'lodash'
import { Alert } from 'react-native'

export function toNumber (value: string) {
  const valueInStringWithoutComma = _.replace(value, /,/g, '')
  return Number(valueInStringWithoutComma)
}

export function getErrorCode (err: Error) {
  return _.get(err, 'response.data.code')
}

export function alert (err: Error) {
  return Alert.alert(`Something went wrong: ${JSON.stringify(_.get(err, 'response.data.errors'))}`)
}
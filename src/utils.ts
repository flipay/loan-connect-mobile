import _ from 'lodash'

export function toNumber (value: string) {
  const valueInStringWithoutComma = _.replace(value, /,/g, '')
  return Number(valueInStringWithoutComma)
}

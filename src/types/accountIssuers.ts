import _ from 'lodash'
import { ACCOUNT_ISSUERS } from '../constants'

const issuerValues = _.map(ACCOUNT_ISSUERS, 'value')

export type Issuer = typeof issuerValues[number]

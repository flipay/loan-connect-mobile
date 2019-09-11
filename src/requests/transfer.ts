import axios from 'axios'
import { Alert } from 'react-native'
import _ from 'lodash'
import { AssetId } from '../types'
import { markFirstDepositAsDone } from '../asyncStorage'
import { alert } from '../utils'

export async function deposit (assetId: AssetId, amount: number) {
  try {
    await axios.post('wallets', { asset: 'THB' })
  } catch (err) {
    if (
      _.get(err, 'response.data.errors.asset[0]') !== 'has already been taken'
    ) {
      alert(err)
    }
  }
  try {
    await axios.post('deposits', {
      asset: assetId,
      amount
    })
    await markFirstDepositAsDone()
  } catch (err) {
    Alert.alert('Cannot request for deposit')
  }
}

export async function withdraw (
  assetId: AssetId,
  amount: number,
  address: string,
  identifier?: string,
  accountName?: string,
  accountIssuer?: string
) {
  if (assetId === 'THB') {
    await axios.post('withdrawals', {
      asset: assetId,
      amount,
      bank_account_number: address,
      bank_account_name: accountName,
      bank_account_issuer: accountIssuer
    })
  } else {
    await axios.post('withdrawals', {
      asset: assetId,
      amount,
      address,
      crypto_transaction_identifier: identifier
    })
  }
}
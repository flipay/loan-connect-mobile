import { AssetId, Asset } from '../types'

type AssetTypes = { [key in AssetId]: Asset }

export const ASSETS: AssetTypes = {
  THB: {
    id: 'THB',
    name: 'Cash',
    image: require('../img/icon_cash.png'),
    unit: 'THB',
    decimal: 0,
    order: 0
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    image: require('../img/icon_btc.png'),
    unit: 'BTC',
    decimal: 8,
    order: 1
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    image: require('../img/icon_eth.png'),
    unit: 'ETH',
    decimal: 6,
    order: 2
  },
  OMG: {
    id: 'OMG',
    name: 'OmiseGo',
    image: require('../img/icon_omg.png'),
    unit: 'OMG',
    decimal: 4,
    order: 3
  }
}

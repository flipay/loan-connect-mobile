import { AssetId, Asset } from '../types'

type AssetTypes = { [key in AssetId]: Asset }

export const ASSETS: AssetTypes = {
  THB: {
    id: 'THB',
    name: 'Cash',
    image: require('../img/icon_cash.png'),
    unit: 'THB',
    order: 0
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    image: require('../img/icon_btc.png'),
    unit: 'BTC',
    order: 1
  }
  // ETH: {
  //   name: 'Ethereum',
  //   image: require('../img/icon_eth.png'),
  //   unit: 'ETH'
  // },
  // OMG: {
  //   name: 'OmiseGo',
  //   image: require('../img/icon_omg.png'),
  //   unit: 'OMG'
  // }
}

import { AssetId, Asset } from '../types'

type AssetTypes = { [key in AssetId]: Asset }

const etheruemBlockchainAddress = '0x9e1D9c3A2947D37f169113730da2026a113Ce78B'

export const ASSETS: AssetTypes = {
  THB: {
    id: 'THB',
    name: 'Thai Baht',
    image: require('../img/icon_cash.png'),
    unit: 'THB',
    decimal: 0,
    address: '8550517232',
    order: 0
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    image: require('../img/icon_btc.png'),
    unit: 'BTC',
    decimal: 8,
    address: '3Hgise57pmBzR21dLBXgHUV8SRYznCVeS1',
    order: 1
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    image: require('../img/icon_eth.png'),
    unit: 'ETH',
    decimal: 6,
    address: etheruemBlockchainAddress,
    order: 2
  },
  BNB: {
    id: 'BNB',
    name: 'Binance Coin',
    image: require('../img/icon_binance.png'),
    unit: 'BNB',
    decimal: 5,
    address: 'bnb1cqhh44pxqw87vcm3grzvs5la9zn3ldcx6r7k3w',
    order: 3
  },
  OMG: {
    id: 'OMG',
    name: 'OmiseGo',
    image: require('../img/icon_omg.png'),
    unit: 'OMG',
    decimal: 4,
    address: etheruemBlockchainAddress,
    order: 4
  }
}

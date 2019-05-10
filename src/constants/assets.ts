import { AssetId, Asset } from '../types'

type AssetTypes = { [key in AssetId]: Asset }

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
    address: '0x9e1D9c3A2947D37f169113730da2026a113Ce78B',
    order: 2
  },
  OMG: {
    id: 'OMG',
    name: 'OmiseGo',
    image: require('../img/icon_omg.png'),
    unit: 'OMG',
    decimal: 4,
    address: '0x9e1D9c3A2947D37f169113730da2026a113Ce78B',
    order: 3
  }
}

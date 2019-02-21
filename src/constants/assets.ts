import { ImageSourcePropType } from 'react-native'
import { AssetId } from '../types'

type AssetTypes = { [key in AssetId]: Asset }

interface Asset {
  name: string
  image: ImageSourcePropType
  unit: string
}

export const ASSETS: AssetTypes = {
  THB: {
    name: 'Cash',
    image: require('../img/icon_cash.png'),
    unit: 'THB'
  },
  BTC: {
    name: 'Bitcoin',
    image: require('../img/icon_btc.png'),
    unit: 'BTC'
  },
  ETH: {
    name: 'Ethereum',
    image: require('../img/icon_eth.png'),
    unit: 'ETH'
  },
  OMG: {
    name: 'OmiseGo',
    image: require('../img/icon_omg.png'),
    unit: 'OMG'
  }
}

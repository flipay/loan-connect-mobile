import { ImageSourcePropType } from 'react-native'

interface ASSET {
  name: string
  image: ImageSourcePropType
  unit: string
}

export type AssetId = 'THB' | 'BTC' | 'ETH' | 'OMG'

type AssetTypes = { [key in AssetId]: ASSET }

export const ASSETS: AssetTypes = {
  THB: {
    name: 'Cash',
    image: require('../img/btc.png'),
    unit: 'THB'
  },
  BTC: {
    name: 'Bitcoin',
    image: require('../img/btc.png'),
    unit: 'BTC'
  },
  ETH: {
    name: 'Ethereum',
    image: require('../img/btc.png'),
    unit: 'ETH'
  },
  OMG: {
    name: 'OmiseGo',
    image: require('../img/btc.png'),
    unit: 'OMG'
  }
}

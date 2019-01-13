import { ImageSourcePropType } from 'react-native'

interface ASSET {
  name: string
  image: ImageSourcePropType
  unit: string
}

export const ASSETS: { [key in string]: ASSET } = {
  cash: {
    name: 'Cash',
    image: require('../img/btc.png'),
    unit: 'THB'
  },
  bitcoin: {
    name: 'Bitcoin',
    image: require('../img/btc.png'),
    unit: 'Bitcoin'
  },
  ethereum: {
    name: 'Ethereum',
    image: require('../img/btc.png'),
    unit: 'ETH'
  },
  omisego: {
    name: 'OmiseGo',
    image: require('../img/btc.png'),
    unit: 'OMG'
  }
}

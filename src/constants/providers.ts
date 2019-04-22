import _ from 'lodash'
import { ImageSourcePropType } from 'react-native'

const PROVIDER_IDS = ['bxth', 'liquid', 'bitkub', 'satang']
export const COMPETITOR_IDS = _.reject(PROVIDER_IDS, (id) => id === 'liquid')

export type ProviderId = typeof PROVIDER_IDS[number]

export type THBAmountTypes = { [key in ProviderId]: number }

export interface Provider {
  id: ProviderId
  name: string
  image: ImageSourcePropType
  amount?: number
}

export const PROVIDERS: Array<Provider> = [
  {
    id: 'liquid',
    name: 'Flipay',
    image: require('../img/company_flipay.png')
  },
  {
    id: 'bxth',
    name: 'BX Thailand',
    image: require('../img/company_bx.png')
  },
  {
    id: 'bitkub',
    name: 'Bitkub',
    image: require('../img/company_bitkub.png')
  },
  {
    id: 'satang',
    name: 'Satang',
    image: require('../img/company_satang.png')
  }
]

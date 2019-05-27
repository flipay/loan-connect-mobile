
import { FontType } from '../types'

export const COLORS = {
  P100: '#DAD1FF',
  P200: '#B4A2FE',
  P300: '#9177FE',
  P400: '#7D5EFE',
  P500: '#6140BE',
  C100: '#CCFFFF',
  C200: '#B2FFFF',
  C300: '#7FFFFF',
  C400: '#02ECFF',
  C500: '#03D8EA',
  N100: '#F4F5F7',
  N200: '#EDEFF3',
  N300: '#DFE3EB',
  N400: '#B4BCCA',
  N500: '#8993A4',
  N600: '#5D687F',
  N700: '#3C4558',
  N800: '#091E42',
  G400: '#41DC89',
  R400: '#FE4747',
  R200: '#EE9595',
  Y400: '#FFA800',
  WHITE: '#FFFFFF'
}

interface Font {
  fontSize: number
  fontFamily: 'nunito' | 'nunito-semibold'
  defaultColor: string
}

type FontTypes = { [key in FontType]: Font }

export const FONT_TYPES: FontTypes = {
  ['large-title']: {
    fontSize: 34,
    fontFamily: 'nunito',
    defaultColor: COLORS.N800
  },
  title: {
    fontSize: 22,
    fontFamily: 'nunito-semibold',
    defaultColor: COLORS.N800
  },
  headline: {
    fontSize: 17,
    fontFamily: 'nunito-semibold',
    defaultColor: COLORS.N800
  },
  body: {
    fontSize: 15,
    fontFamily: 'nunito',
    defaultColor: COLORS.N500
  },
  caption: {
    fontSize: 12,
    fontFamily: 'nunito',
    defaultColor: COLORS.N600
  },
  button: {
    fontSize: 15,
    fontFamily: 'nunito-semibold',
    defaultColor: COLORS.WHITE
  }
}

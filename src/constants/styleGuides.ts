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
  WHITE: '#FFFFFF'
}
interface Font {
  fontSize: number
  fontFamily: 'nunito' | 'nunito-semibold'
}

export type FontType = 'large_title' | 'title' | 'head_line' | 'body' | 'caption' | 'button'
type FontTypes = { [key in FontType]: Font }

export const FONT_TYPES: FontTypes = {
  large_title: {
    fontSize: 34,
    fontFamily: 'nunito'
  },
  title: {
    fontSize: 22,
    fontFamily: 'nunito-semibold'
  },
  head_line: {
    fontSize: 17,
    fontFamily: 'nunito-semibold'
  },
  body: {
    fontSize: 15,
    fontFamily: 'nunito'
  },
  caption: {
    fontSize: 12,
    fontFamily: 'nunito'
  },
  button: {
    fontSize: 15,
    fontFamily: 'nunito-semibold'
  }
}

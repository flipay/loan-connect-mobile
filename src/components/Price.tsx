import * as React from 'react'
import { FontType } from '../types'
import { showPrice } from '../utils'
import { COLORS } from '../constants'
import Text from './Text'

interface Props {
  children: number
  style?: any
  color?: string
  fontType?: FontType
  noUnit?: boolean
}

export default class Price extends React.Component<Props> {
  public render () {
    return (
      <Text color={COLORS.N800} type={this.props.fontType} {...this.props}>
        {`${showPrice(this.props.children)}${this.props.noUnit ? '' : ' THB'}`}
      </Text>
    )
  }
}

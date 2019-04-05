import React from 'react'
import { TextStyle } from 'react-native'
import Text from './Text'
import { AssetId, FontType } from '../types'
import { ASSETS } from '../constants'
import { toString } from '../utils'

interface Props {
  children: number
  assetId: AssetId
  full?: boolean
  hidden?: boolean
  style?: TextStyle
  fontType?: FontType
}

class Value extends React.Component<Props> {
  public render () {
    const { style, ...otherProps } = this.props
    const amount = toString(
      this.props.children,
      ASSETS[this.props.assetId].decimal
    )
    return (
      <Text
        style={this.props.style}
        type={this.props.fontType || 'inherit'}
        {...otherProps}
      >
        {amount}
        {` ${
          this.props.full
            ? ASSETS[this.props.assetId].name
            : ASSETS[this.props.assetId].unit
        }`}
      </Text>
    )
  }
}

export default Value

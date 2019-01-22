import React from 'react'
import { TextStyle } from 'react-native'
import Text from './Text'
import { AssetId, FontType } from '../types'
import { ASSETS } from '../constants'

interface Props {
  children: number
  assetId: AssetId
  full?: boolean
  hidden?: boolean
  style?: TextStyle
  fontType?: FontType
}

class FlipValue extends React.Component<Props> {
  public render () {
    const { style, ...otherProps } = this.props
    return (
      <Text style={this.props.style} type={this.props.fontType || 'inherit'} {...otherProps}>
        {this.props.children.toLocaleString(undefined, {
          maximumFractionDigits: 8
        })}
        {` ${
          this.props.full
            ? ASSETS[this.props.assetId].name
            : ASSETS[this.props.assetId].unit
        }`}
      </Text>
    )
  }
}

export default FlipValue

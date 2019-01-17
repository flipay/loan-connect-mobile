import React from 'react'
import Text from './Text'
import { AssetId, ASSETS } from '../constants/assets'

interface Props {
  children: number
  asset: AssetId
  full?: boolean
  hidden?: boolean
  style?: any
}

class FlipValue extends React.Component<Props> {
  public render () {
    const { style, ...otherProps } = this.props
    return (
      <Text
        style={this.props.style}
        type='inherit'
        {...otherProps}
      >
        {this.props.children.toLocaleString(
          undefined,
          { maximumFractionDigits: 8 }
        )}
        {` ${this.props.full ? ASSETS[this.props.asset].name : ASSETS[this.props.asset].unit}`}
      </Text>
    )
  }
}

export default FlipValue

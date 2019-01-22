import React from 'react'
import Text from './Text'
import { AssetId } from '../types'
import { ASSETS } from '../constants'

interface Props {
  children: number
  assetId: AssetId
  full?: boolean
  hidden?: boolean
  style?: any
}

class FlipValue extends React.Component<Props> {
  public render () {
    const { style, ...otherProps } = this.props
    return (
      <Text style={this.props.style} type='inherit' {...otherProps}>
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

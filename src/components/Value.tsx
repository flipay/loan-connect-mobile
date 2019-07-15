import React from 'react'
import Text from './Text'
import { AssetId, FontType } from '../types'
import { ASSETS } from '../constants'
import { toString } from '../utils'

interface Props {
  children: number
  assetId: AssetId
  full?: boolean
  style?: any
  fontType?: FontType
  decimal?: number
  color?: string
}

class Value extends React.Component<Props> {
  public render () {
    const { style, color, fontType, ...otherProps } = this.props
    const amount = toString(
      this.props.children,
      this.props.decimal || ASSETS[this.props.assetId].decimal
    )
    return (
      <Text
        style={style}
        color={color}
        type={fontType || 'inherit'}
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

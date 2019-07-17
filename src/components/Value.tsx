import React from 'react'
import Text from './Text'
import { AssetId, FontType } from '../types'
import { ASSETS } from '../constants'
import { toString } from '../utils'
import { Image, View, StyleSheet } from 'react-native'

interface Props {
  children: number
  assetId: AssetId
  full?: boolean
  style?: any
  withImage?: boolean
  fontType?: FontType
  decimal?: number
  color?: string
  bold?: boolean
}

class Value extends React.Component<Props> {
  public render () {
    const { style, color, fontType, ...otherProps } = this.props
    const amount = toString(
      this.props.children,
      this.props.decimal || ASSETS[this.props.assetId].decimal
    )
    return (
      <View style={styles.container}>
        {this.props.withImage && <Image source={ASSETS[this.props.assetId].image} style={{ width: 16, height: 16, marginRight: 4 }} />}
        <Text
          style={style}
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default Value

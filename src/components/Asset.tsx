import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { AssetId } from '../types'
import { ASSETS, COLORS } from '../constants'
import Text from './Text'

interface Props {
  id: AssetId
  withUnit?: boolean
  style?: any
  bodySize?: boolean
}

export default class Asset extends React.Component<Props> {
  public render () {
    const { bodySize } = this.props
    const iconSize = bodySize ? 12 : 16
    const { image, name } = ASSETS[this.props.id]
    return (
      <View style={[styles.container, this.props.style]}>
        <Image source={image} style={{ width: iconSize, height: iconSize }} />
        <Text
          type={bodySize ? 'body' : 'headline'}
          color={COLORS.N800}
          style={bodySize ? styles.bodySizeText : styles.text}
        >
          {name}
        </Text>
        {this.props.withUnit && <Text
          type={bodySize ? 'body' : 'headline'}
          color={COLORS.N800}
        >
          {` (${ASSETS[this.props.id].unit})`}
        </Text>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginLeft: 8
  },
  bodySizeText: {
    marginLeft: 4
  }
})

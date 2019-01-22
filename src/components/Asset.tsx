import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { AssetId } from '../types'
import { ASSETS } from '../constants'
import { Text } from '../components'

interface Props {
  id: AssetId,
  style?: any
}

export default class Asset extends React.Component<Props> {
  public render () {
    const { image, name } = ASSETS[this.props.id]
    return (
      <View style={[styles.container, this.props.style]}>
        <Image source={image} />
        <Text type='headline' style={styles.text}>{name}</Text>
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
  }
})
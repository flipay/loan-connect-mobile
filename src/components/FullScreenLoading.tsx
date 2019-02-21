import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Dimensions
} from 'react-native'

import { COLORS } from '../constants'

interface Props {
  visible: boolean
}

export default class FullScreenLoading extends React.Component<Props> {
  public render () {
    return this.props.visible ? (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={COLORS.P400} />
      </View>
    ) : (
      <View />
    )
  }
}
const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(180, 188, 202, 0.8)'
  }
})
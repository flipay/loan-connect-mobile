import * as React from 'react'

import { StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

interface Props {
  color?: string
  onPress: () => void
}

export default class Button extends React.Component<Props> {
  public render () {
    return (
      <TouchableOpacity style={styles.closeButton} onPress={this.props.onPress}>
        <AntDesign name='close' size={28} color={this.props.color} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    left: 0,
    top: 24,
    padding: 6
  }
})

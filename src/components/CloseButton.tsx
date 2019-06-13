import * as React from 'react'

import { StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

interface Props {
  color?: string
  top?: number
  left?: number
  onPress: () => void
}

export default class Button extends React.Component<Props> {
  public render () {
    const { top, left } = this.props
    return (
      <TouchableOpacity style={[styles.closeButton, { top, left }]} onPress={this.props.onPress}>
        <AntDesign name='close' size={28} color={this.props.color} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    left: 5,
    top: 8,
    padding: 6
  }
})

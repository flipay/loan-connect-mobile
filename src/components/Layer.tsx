import * as React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS } from '../constants'

interface Props {
  children: Element
  onPress?: () => void
  active?: boolean,
  style?: any
}

export default class Layer extends React.Component<Props> {
  public render () {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.active && styles.activeContainer, this.props.style]}
        onPress={this.props.onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.N200,
    backgroundColor: COLORS.WHITE,
    width: '100%',
    marginBottom: 16
  },
  activeContainer: {
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  }
})
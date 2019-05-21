import * as React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { COLORS } from '../constants'

interface Props {
  children: Element
  onPress?: () => void
  active?: boolean,
  style?: any
}

export default class Layer extends React.Component<Props> {
  public render () {

    const Container = this.props.onPress ? TouchableOpacity : View
    return (
      <Container
        style={[styles.container, this.props.active && styles.activeContainer, this.props.style]}
        onPress={this.props.onPress}
      >
        {this.props.children}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.N200,
    backgroundColor: COLORS.WHITE,
    width: '100%',
    marginBottom: 16,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 4
  },
  activeContainer: {
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2
  }
})
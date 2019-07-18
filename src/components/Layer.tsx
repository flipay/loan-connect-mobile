import * as React from 'react'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import { COLORS } from '../constants'

interface Props {
  children: Element
  onPress?: () => void
  active?: boolean,
  style?: any,
  borderRadius?: number
}

export default class Layer extends React.Component<Props> {
  public renderContent () {
    const { borderRadius } = this.props
    return (
      <View style={[styles.container, this.props.active && styles.activeContainer, this.props.style, borderRadius && { borderRadius }]}>
        {this.props.children}
      </View>
    )
  }

  public render () {
    return this.props.onPress ? (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
      >
        {this.renderContent()}
      </TouchableWithoutFeedback>
    ) : this.renderContent()
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.N200,
    backgroundColor: COLORS.WHITE,
    width: '100%',
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 10
  },
  activeContainer: {
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2
  }
})
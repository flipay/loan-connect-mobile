import * as React from 'react'

import { StyleSheet, TouchableOpacity } from 'react-native'
import Text from './Text'

import { COLORS } from '../constants/styleGuides'

interface Props {
  children: string
  onPress: () => void
}

export default class Button extends React.Component<Props> {
  public render () {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Text color={COLORS.P400}>{this.props.children}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.N100
  }
})

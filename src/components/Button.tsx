import * as React from 'react'

import { StyleSheet, TouchableOpacity } from 'react-native'
import Text from './Text'

import { COLORS } from '../constants/styleGuides'

interface Props {
  children: string
  onPress: () => void
  style?: any
}

export default class Button extends React.Component<Props> {
  public render () {
    return (
      <TouchableOpacity style={[styles.container, this.props.style]} onPress={this.props.onPress}>
        <Text color={COLORS.P400} type='button'>
          {this.props.children}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.N100,
    borderRadius: 4
  }
})

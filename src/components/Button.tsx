import * as React from 'react'

import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from './Text'

import { COLORS } from '../constants/styleGuides'

interface Props {
  children: string
  onPress: () => void
  inactive?: boolean
  style?: any
}

export default class Button extends React.Component<Props> {
  public render () {
    const Container = this.props.inactive ? View : TouchableOpacity
    return (
      <Container style={[styles.container, this.props.style]} onPress={this.props.onPress}>
        <Text color={this.props.inactive ? COLORS.N400 : COLORS.P400} type='button'>
          {this.props.children}
        </Text>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.N100,
    borderRadius: 4
  }
})

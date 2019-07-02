import * as React from 'react'
import _ from 'lodash'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import Text from './Text'
import { COLORS } from '../constants'

interface Props {
  children: string
  onPress: () => void
  active?: boolean
}

export default class SubmitButton extends React.Component<Props> {
  public static defaultProps = {
    active: true
  }

  public render () {
    const Container = this.props.active ? TouchableOpacity : View
    return (
      <Container
        style={[
          styles.submitButton,
          !this.props.active && styles.inactiveSubmitButton
        ]}
        onPress={this.props.active ? this.props.onPress : undefined}
      >
        <Text type='button' color={COLORS.WHITE}>
          {this.props.children}
        </Text>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.P400
  },
  inactiveSubmitButton: {
    backgroundColor: COLORS.P100
  }
})
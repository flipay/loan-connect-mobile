import * as React from 'react'
import * as _ from 'lodash'
import { TouchableHighlight, StyleSheet } from 'react-native'
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
    return (
      <TouchableHighlight
        style={[
          styles.submitButton,
          !this.props.active && styles.inactiveSubmitButton
        ]}
        onPress={this.props.active ? this.props.onPress : undefined}
      >
        <Text type='button' color={COLORS.WHITE}>
          {this.props.children}
        </Text>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.P400
  },
  inactiveSubmitButton: {
    opacity: 0.35
  }
})
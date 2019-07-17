import * as React from 'react'
import _ from 'lodash'
import { LinearGradient } from 'expo'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import Text from './Text'
import { COLORS } from '../constants'

interface Props {
  children: string
  onPress: () => void
  active?: boolean
  gradient?: boolean
}

export default class SubmitButton extends React.Component<Props> {
  public static defaultProps = {
    active: true
  }

  public renderText () {
    return (
      <Text type='button' bold={true} color={COLORS.WHITE}>
        {this.props.children}
      </Text>
    )
  }

  public renderBackground () {
    return this.props.gradient ? (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={styles.submitButton} // NOTE: for now, there is no inactive style for gradient
      >
        {this.renderText()}
      </LinearGradient>
    ) : (
      <View
        style={[
          styles.submitButton,
          this.props.active ? styles.activeSubmitButton : styles.inactiveSubmitButton
        ]}
      >
        {this.renderText()}
      </View>
    )
  }

  public render () {
    return this.props.active ?
    (
      <TouchableOpacity
        onPress={this.props.active ? this.props.onPress : undefined}
      >
        {this.renderBackground()}
      </TouchableOpacity>
    ) : this.renderBackground()
  }
}

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeSubmitButton: {
    backgroundColor: COLORS.P400
  },
  inactiveSubmitButton: {
    backgroundColor: COLORS.P100
  }
})
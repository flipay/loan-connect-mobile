
import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants/styleGuides'
import { Text, Pin } from '../components'

interface State {
  pin: string
}

export default class PinScreen extends React.Component<
  NavigationScreenProps,
  State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      pin: ''
    }
  }

  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: 'Create PIN'
    }
  }

  public onPinChange = (pin: string) => {
    this.setState({ pin })
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>PIN will be used for login</Text>
        <Pin
          pin={this.state.pin}
          onPinChange={this.onPinChange}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  kak: {
    width: 50,
    height: 50,
    backgroundColor: 'red'
  },
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1
  }
})

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
      title: 'Confirm PIN'
    }
  }

  public onPinChange = (pin: string) => {
    this.setState({ pin })
    if (pin.length === 6) {
      if (this.state.pin === this.props.navigation.getParam('firstPin')) {
        this.props.navigation.navigate('Main')
      } else {
        this.props.navigation.goBack()
      }
    }
  }
  public render () {
    return (
      <View style={styles.screen}>
        <Text>Please insert PIN again</Text>
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
  },
  modal: {

  }
})
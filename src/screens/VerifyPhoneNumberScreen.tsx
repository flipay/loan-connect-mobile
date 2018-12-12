
import * as React from 'react'
import { View, TextInput, StyleSheet, TouchableHighlight } from 'react-native'
import Text from '../components/Text'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants/styleGuides'
import _ from 'lodash'

type No = 0 | 1 | 2 | 3 | 4 | 5

interface State {
  [no: string]: string
}

export default class VerifyPhoneNumberScreen extends React.Component<
  NavigationScreenProps,
  State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      no0: '',
      no1: '',
      no2: '',
      no3: '',
      no4: '',
      no5: ''
    }
  }
  private input: Array<TextInput | null> = []

  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: 'Verify Phone Number'
    }
  }

  public submitOTP = () => {
    if (this.state.no0.length === 1 &&
    this.state.no1.length === 1 &&
    this.state.no2.length === 1 &&
    this.state.no3.length === 1 &&
    this.state.no4.length === 1 &&
    this.state.no5.length === 1) {
      this.props.navigation.navigate('Pin', {
        screenName: 'Create PIN',
        description: 'PIN will be used for login',
        onSuccess: (firstPin: string, stackNavigationCreatePin: any) => {
          stackNavigationCreatePin.push('Pin', {
            screenName: 'Confirm PIN',
            description: 'Please insert PIN again',
            onSuccess: (secondPin: string, stackNavigationConmfirmPin: any) => {
              if (firstPin === secondPin) {
                stackNavigationConmfirmPin.navigate('Main')
              } else {
                stackNavigationConmfirmPin.pop()
              }
            }
          })
        }
      })
    }
  }

  public onPressButton = () => {
    this.submitOTP()
  }

  public onChangeText = (index: No, text: string) => {
    this.setState({ [`no${index}`]: text })

    // move cursor
    const nextInput = this.input[index + 1]
    if (text.length === 1 && nextInput) {
      nextInput.focus()
    }

    // complete
    if (index === 5) {
      this.submitOTP()
    }
  }

  public renderBox (index: No) {
    return (
      <View style={styles.box}>
        <TextInput
          ref={(element) => { this.input[index] = element }}
          keyboardType='number-pad'
          selectTextOnFocus={true}
          autoFocus={index === 0}
          onChangeText={(text: string) => this.onChangeText(index, text)}
          maxLength={1}
          value={this.state[`no${index}`]}
        />
      </View>
    )
  }

  public renderBoxes () {
    return (
      <View style={styles.boxes}>
        {this.renderBox(0)}
        {this.renderBox(1)}
        {this.renderBox(2)}
        {this.renderBox(3)}
        {this.renderBox(4)}
        {this.renderBox(5)}
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>Plese check you SMS to get One Time Password (OTP)</Text>
        <Text>Insert OTP</Text>
        {this.renderBoxes()}
        <TouchableHighlight style={styles.kak} onPress={this.onPressButton}>
          <Text>
            Verify
          </Text>
        </TouchableHighlight>
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
  boxes: {
    flexDirection: 'row'
  },
  box: {
    width: 30,
    borderColor: COLORS.P500,
    borderWidth: 1
  }
})
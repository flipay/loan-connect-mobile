
import * as React from 'react'
import { View, TextInput, StyleSheet, TouchableHighlight } from 'react-native'
import Text from '../components/Text'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants/styleGuides'
import _ from 'lodash'
import { submitOtp } from '../requests'
// @ts-ignore don't have type definition
import DropdownAlert from 'react-native-dropdownalert'

type No = 0 | 1 | 2 | 3 | 4 | 5

interface State {
  [x: string]: string
}
interface LoadingState {
  loading: boolean
}

export default class VerifyPhoneNumberScreen extends React.Component<
  NavigationScreenProps,
  State & LoadingState
> {
  private dropdown = null

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      loading: false,
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

  public navigateToCreatePinScreen () {
    this.props.navigation.navigate('Pin', {
      screenName: 'Create PIN',
      description: 'PIN will be used for login',
      onSuccess: this.navigateToConfirmPinScreen
    })
  }

  public navigateToConfirmPinScreen (firstPin: string, stackNavigationCreatePin: any) {
    stackNavigationCreatePin.push('Pin', {
      screenName: 'Confirm PIN',
      description: 'Please insert PIN again',
      onSuccess: async (secondPin: string, stackNavigationConmfirmPin: any) => {
        if (firstPin === secondPin) {

          stackNavigationConmfirmPin.navigate('Main')
        } else {
          stackNavigationConmfirmPin.pop()
        }
      }
    })
  }

  public submitOTP = async (otp) => {

    if (otp.length === 6) {
      try {
        this.setState({ loading: true })
        await submitOtp(this.props.navigation.getParam('accountNumber'), otp)
        this.navigateToCreatePinScreen()
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
        this.dropdown.alertWithType('error', 'Error', err.message)
      }
    } else {
      this.dropdown.alertWithType('error', 'Error', 'fill in the form')
    }
  }

  public onPressButton = () => {
    const otp = this.state.no0 + this.state.no1 +
      this.state.no2 + this.state.no3 +
      this.state.no4 + this.state.no5
    this.submitOTP(otp)
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
      const otp = this.state.no0 + this.state.no1 +
        this.state.no2 + this.state.no3 +
        this.state.no4 + text
      this.submitOTP(otp)
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
    console.log('kendo jaa eiei typeof kak', typeof this.state.kak)
    console.log('kendo jaa eiei typeof loading', typeof this.state.loading)
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
        <DropdownAlert ref={(ref: any) => this.dropdown = ref} />
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
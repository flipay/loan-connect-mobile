import * as React from 'react'
import _ from 'lodash'
import { View, TextInput, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants'
import { submitOtp } from '../requests'
import { Text, Screen, Layer } from '../components'

type No = 0 | 1 | 2 | 3 | 4 | 5

interface State {
  otp: string
  loading: boolean
}

export default class VerifyPhoneNumberScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      otp: '',
      loading: false
    }
  }
  private input: TextInput | null

  public navigateToCreatePinScreen () {
    this.props.navigation.navigate('Pin', {
      screenName: 'Create PIN',
      description: 'PIN will be used for login',
      onSuccess: this.navigateToConfirmPinScreen
    })
  }

  public navigateToConfirmPinScreen (
    firstPin: string,
    stackNavigationCreatePin: any
  ) {
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

  public submitOTP = async () => {
    const otp = this.state.otp
    if (otp.length === 6) {
      try {
        this.setState({ loading: true })
        await submitOtp(this.props.navigation.getParam('accountNumber'), otp)
        this.navigateToCreatePinScreen()
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
      }
    }
  }

  public onChangeText = (text: string) => {
    this.setState({ otp: text })
  }

  public renderBox (index: No) {
    const length = this.state.otp.length
    return (
      <Layer
        style={styles.box}
        active={length === index || (index === 5 && length === 6)}
      >
        <Text color={COLORS.N800}>
          {index < this.state.otp.length ? this.state.otp[index] : ''}
        </Text>
      </Layer>
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

  public renderHiddenTextInput (autoFocus: boolean) {
    return (
      <TextInput
        style={styles.hiddenTextInput}
        ref={element => {
          this.input = element
        }}
        keyboardType='number-pad'
        selectTextOnFocus={true}
        autoFocus={autoFocus}
        onChangeText={this.onChangeText}
        maxLength={6}
        value={this.state.otp}
      />
    )
  }

  public render () {
    return (
      <Screen
        disableTouchOutside={true}
        backButtonType='arrowleft'
        onPressBackButton={this.props.navigation.goBack}
        onPessSubmitButton={this.submitOTP}
        activeSubmitButton={this.state.otp.length === 6}
      >
        {autoFocus => (
          <View style={styles.content}>
            <Text type='title'>{`Enter the 6-digit code sent to ${this.props.navigation.getParam(
              'phoneNumber',
              '08XXXXXXXX'
            )}`}</Text>
            {this.renderBoxes()}
            {this.state.loading && <Text>Loading</Text>}
            {this.renderHiddenTextInput(autoFocus)}
          </View>
        )}
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 40
  },
  boxes: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hiddenTextInput: {
    position: 'absolute',
    left: -10000,
    top: -100000
  }
})

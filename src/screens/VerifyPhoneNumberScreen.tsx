import * as React from 'react'
import _ from 'lodash'
import { View, TextInput, StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native'
import { Amplitude } from 'expo'
import { AntDesign } from '@expo/vector-icons'
import { NavigationScreenProps } from 'react-navigation'
import { submitOtp, createPin } from '../requests'
import { COLORS } from '../constants'
import { Text, ScreenWithKeyboard, Layer, Link } from '../components'

type No = 0 | 1 | 2 | 3 | 4 | 5

interface State {
  otp: string
  verified: boolean
  timer: number
  loading: boolean
  errorMessage: string
}

const DEFAULT_TIMER = 60

export default class VerifyPhoneNumberScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private input: TextInput | null = null
  private interval: any

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      otp: '',
      timer: DEFAULT_TIMER,
      verified: false,
      loading: false,
      errorMessage: ''
    }
  }

  public componentDidMount () {
    this.interval = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState({ timer: this.state.timer - 1 })
      }
    }, 1000)
  }

  public componentDidUpdate (
    prevProps: NavigationScreenProps,
    prevState: State
  ) {
    if (
      !prevState.verified &&
      !this.state.verified &&
      prevState.timer === 1 &&
      this.state.timer === 0
    ) {
      Amplitude.logEvent('verify-phone-number/timeout')
      if (this.input) {
        this.input.blur()
      }
    }
  }

  public componentWillUnmount () {
    clearInterval(this.interval)
  }

  public isExpired () {
    return !this.state.verified && this.state.timer === 0
  }

  public navigateToConfirmPinScreen = (
    firstPin: string,
    stackNavigationCreatePin: any
  ) => {
    Amplitude.logEvent('create-pin/finish-creating-pin')
    stackNavigationCreatePin.push('Pin', {
      title: 'Confirm your PIN',
      onSuccess: async (
        secondPin: string,
        stackNavigationConmfirmPin: any,
        setErrorConfirm: (errorMessage: string) => void,
        startLoading: () => void
      ) => {
        if (firstPin === secondPin) {
          Amplitude.logEvent('confirm-pin/pin-match')
          try {
            startLoading()
            const accountId = this.props.navigation.getParam('accountId')
            await createPin(accountId, secondPin)
            Amplitude.logEvent('confirm-pin/successfully-setting-pin')
            await AsyncStorage.setItem('account_id', accountId)
            stackNavigationConmfirmPin.navigate('Main')
          } catch (error) {
            Amplitude.logEvent('confirm-pin/error-setting-pin')
            setErrorConfirm(error.message)
          }
        } else {
          Amplitude.logEvent('confirm-pin/pin-does-not-match')
          setErrorConfirm('The PIN does not match')
          setTimeout(() => {
            stackNavigationConmfirmPin.pop()
          }, 1000)
        }
      }
    })
  }

  public onChangeText = async (text: string) => {
    if (text.length < this.state.otp.length) {
      Amplitude.logEvent('verify-phone-number/press-backspace')
      this.setState({ errorMessage: '' })
    }
    this.setState({ otp: text })
    if (text.length === 6) {
      if (this.input) {
        this.input.blur()
      }
      try {
        this.setState({ loading: true })
        await submitOtp(this.props.navigation.getParam('accountId'), text)
        Amplitude.logEvent('verify-phone-number/successfully-verified')
        this.setState({ verified: true, loading: false })
      } catch (err) {
        Amplitude.logEvent('verify-phone-number/sms-code-incorrect')
        this.setState({
          errorMessage: 'The SMS code you entered is incorrect',
          loading: false
        })
      }
    }
  }

  public onPressResend = () => {
    Amplitude.logEvent('verify-phone-number/press-resend-code-link')
    if (this.input) {
      this.input.focus()
      this.setState({
        otp: '',
        timer: DEFAULT_TIMER,
        errorMessage: ''
      })
    }
  }

  public onNextStep = () => {
    Amplitude.logEvent('verify-phone-number/press-next-button')
    this.props.navigation.navigate('Pin', {
      title: 'Create a PIN',
      onSuccess: this.navigateToConfirmPinScreen
    })
  }

  public onPressBoxes = () => {
    Amplitude.logEvent('verify-phone-number/press-boxes')
    if (this.input) {
      this.input.focus()
    }
  }

  public renderBox (index: No) {
    const length = this.state.otp.length
    return (
      <Layer style={styles.box} active={length === index}>
        <Text color={COLORS.N800}>
          {index < this.state.otp.length ? this.state.otp[index] : ''}
        </Text>
      </Layer>
    )
  }

  public renderBoxes () {
    return (
      <TouchableOpacity style={styles.boxes} onPress={this.onPressBoxes}>
        {this.renderBox(0)}
        {this.renderBox(1)}
        {this.renderBox(2)}
        {this.renderBox(3)}
        {this.renderBox(4)}
        {this.renderBox(5)}
      </TouchableOpacity>
    )
  }

  public renderError (errorMessage: string) {
    return (
      <View style={styles.errorRow}>
        <AntDesign
          name='closecircle'
          color={COLORS.R400}
          style={styles.stageIcon}
        />
        <Text color={COLORS.R400}>
          {errorMessage}
        </Text>
      </View>
    )
  }

  public renderResendLink () {
    return (
      <Link onPress={this.onPressResend} style={styles.resendLink}>
        Resend code
      </Link>
    )
  }

  public renderBody () {
    // we have 3 main stages => 1.Counting 2.Expired 3.Verified
    if (!this.state.verified) {
      return this.state.timer === 0 ? (
        // Expired stage
        <View style={styles.body}>
          <Text>Code expired</Text>
          {this.renderResendLink()}
        </View>
      ) : (
        // Counting stage
        <View style={styles.body}>
          <Text>
            Code expired in
            <Text color={COLORS.Y400}>{` ${this.state.timer}s`}</Text>
          </Text>
          {!!this.state.errorMessage && this.renderError(this.state.errorMessage)}
          {!!this.state.errorMessage && this.renderResendLink()}
        </View>
      )
    } else {
      // Verified stage
      return (
        <View style={styles.body}>
          <View style={styles.successRow}>
            <AntDesign
              name='checkcircle'
              color={COLORS.G400}
              style={styles.stageIcon}
            />
            <Text color={COLORS.G400}>
              Your mobile phone number is verified.
            </Text>
          </View>
        </View>
      )
    }
  }

  public renderHiddenTextInput (autoFocus: boolean) {
    return (
      <TextInput
        style={styles.hiddenTextInput}
        ref={element => {
          this.input = element
        }}
        keyboardType='number-pad'
        selectTextOnFocus={false}
        autoFocus={autoFocus}
        onChangeText={this.onChangeText}
        maxLength={6}
        value={this.state.otp}
      />
    )
  }

  public onPressBackButon = () => {
    Amplitude.logEvent('verify-phone-number/press-back-button')
    this.props.navigation.goBack()
  }

  public render () {
    return (
      <ScreenWithKeyboard
        disableTouchOutside={true}
        backButtonType='arrowleft'
        onPressBackButton={this.onPressBackButon}
        onPessSubmitButton={this.onNextStep}
        activeSubmitButton={this.state.verified}
        fullScreenLoading={this.state.loading}
      >
        {(autoFocus: boolean) => (
          <View style={styles.content}>
            <Text type='title'>{`Enter the 6-digit code sent to ${this.props.navigation.getParam(
              'phoneNumber',
              '08XXXXXXXX'
            )} (Ref: ${this.props.navigation.getParam('refCode', 'XXXX')})`}</Text>
            {this.renderBoxes()}
            {this.renderBody()}
            {this.renderHiddenTextInput(autoFocus)}
          </View>
        )}
      </ScreenWithKeyboard>
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
  body: {
    marginTop: 24,
    alignItems: 'center'
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stageIcon: {
    marginRight: 4
  },
  resendLink: {
    marginTop: 14
  },
  hiddenTextInput: {
    position: 'absolute',
    left: -10000,
    top: -100000
  }
})

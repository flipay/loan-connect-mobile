import * as React from 'react'
import _ from 'lodash'
import { View, TextInput, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { NavigationScreenProps } from 'react-navigation'
import { submitOtp } from '../requests'
import { COLORS } from '../constants'
import { Text, Screen, Layer, Link } from '../components'

type No = 0 | 1 | 2 | 3 | 4 | 5

interface State {
  otp: string
  stage: 'counting' | 'loading' | 'success' | 'error'
  timer: number
}

const DEFAULT_TIMER = 5

export default class VerifyPhoneNumberScreen extends React.Component<
  NavigationScreenProps,
  State
> {

  private input: TextInput | null
  private interval: any

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      otp: '',
      stage: 'counting',
      timer: DEFAULT_TIMER
    }
  }

  public componentDidMount () {
    this.interval = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState({ timer: this.state.timer - 1 })
      }
    }, 1000)
  }

  public componentWillUnmount () {
    clearInterval(this.interval)
  }

  public componentDidUpdate (prevProps: NavigationScreenProps, prevState: State) {
    if (prevState.stage !== this.state.stage && this.state.stage === 'counting') {
      this.setState({ timer: DEFAULT_TIMER })
    }
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

  public onChangeText = async (text: string) => {
    this.setState({ otp: text })
    if (text.length === 6) {
      try {
        this.setState({ stage: 'loading' })
        await submitOtp(this.props.navigation.getParam('accountNumber'), text)
        this.setState({ stage: 'success' })
      } catch (err) {
        this.setState({ stage: 'error' })
      }
    }
  }

  public onNextStep = () => {
    this.props.navigation.navigate('Pin', {
      title: 'Create a PIN',
      onSuccess: this.navigateToConfirmPinScreen
    })
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

  public renderStageMessage () {
    switch (this.state.stage) {
      case 'counting':
        return this.state.timer === 0
        ? (
          <Text>
            Code expired
          </Text>
        ) : (
          <Text>
            Codes expired in
            <Text color='#FBB328'>{` ${this.state.timer}s`}</Text>
          </Text>
        )
      case 'loading':
        return (
          <Text>
            Loading...
          </Text>
        )
      case 'success':
        const successColor = '#41DC89'
        return (
          <View style={styles.stageMessage}>
            <AntDesign name='checkcircle' color={successColor} style={styles.stageIcon} />
            <Text color={successColor}>Your mobile phone number is verified.</Text>
          </View>
        )
      case 'error':
        const errorColor = '#FE4747'
        return (
          <View style={styles.stageMessage}>
            <AntDesign name='closecircle' color={errorColor} style={styles.stageIcon} />
            <Text color={errorColor}>The SMS code you entered is incorrect.</Text>
          </View>
        )
    }
  }

  public shouldShowResendLink () {
    return (this.state.stage === 'counting' && this.state.timer === 0) ||
      this.state.stage === 'error'
  }

  public renderFooter () {
    return (
      <View style={styles.footer}>
        {this.renderStageMessage()}
        {this.shouldShowResendLink() && (
          <Link onPress={_.noop} style={styles.resendLink}>
            Resend codes
          </Link>
        )}
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
        onPessSubmitButton={this.onNextStep}
        activeSubmitButton={this.state.stage === 'success'}
      >
        {autoFocus => (
          <View style={styles.content}>
            <Text type='title'>{`Enter the 6-digit code sent to ${this.props.navigation.getParam(
              'phoneNumber',
              '08XXXXXXXX'
            )}`}</Text>
            {this.renderBoxes()}
            {this.renderFooter()}
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
  footer: {
    marginTop: 24,
    alignItems: 'center'
  },
  stageMessage: {
    flexDirection: 'row'
  },
  stageIcon: {
    marginRight: 4
  },
  resendLink: {
    marginTop: 8
  },
  hiddenTextInput: {
    position: 'absolute',
    left: -10000,
    top: -100000
  }
})

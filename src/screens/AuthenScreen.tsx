import * as React from 'react'
import _ from 'lodash'
import { NavigationScreenProps } from 'react-navigation'
import { TextInput, StyleSheet, Keyboard, SafeAreaView } from 'react-native'
import { authen } from '../requests'
import { logEvent } from '../services/Analytic'

import { Screen, Text, Layer } from '../components'

interface State {
  phoneNumber: string
  loading: boolean
  activeLayer: boolean
}

export default class AuthenScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      phoneNumber: '',
      loading: false,
      activeLayer: false
    }
  }

  public onPressSubmit = async () => {
    logEvent('authen/submit-phone-number')
    // NOTE: I have to close the Keyboard first otherwise
    // it will not work on the next page.
    Keyboard.dismiss()
    this.setState({ loading: true })
    const response = await authen(this.state.phoneNumber)
    this.setState({ loading: false })
    if (!response) { return }
    this.props.navigation.navigate('VerifyPhoneNumber', {
      phoneNumber: this.state.phoneNumber,
      otpToken: response.token,
      refCode: response.ref_code
    })
  }

  public onChangeText = async (text: string) => {
    this.setState({ phoneNumber: text })
  }

  public onPressBackButton = () => {
    logEvent('authen/press-back-button')
    this.props.navigation.goBack()
  }

  public render () {
    return (
      <Screen
        backButtonType='arrowleft'
        onPressBackButton={this.onPressBackButton}
        activeSubmitButton={this.state.phoneNumber.length === 10}
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={this.state.loading}
      >
        <SafeAreaView>
          <Text type='title' style={styles.title}>Enter your mobile number</Text>
            <Layer
              style={styles.layer}
              active={this.state.activeLayer}
            >
              <TextInput
                onFocus={() => this.setState({ activeLayer: true })}
                onBlur={() => this.setState({ activeLayer: false })}
                autoFocus={true}
                keyboardType='number-pad'
                textContentType='none'
                placeholder='0899999999'
                onChangeText={this.onChangeText}
                maxLength={10}
                value={this.state.phoneNumber}
              />
            </Layer>
        </SafeAreaView>
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: 7
  },
  layer: {
    marginTop: 44,
    padding: 19
  }
})
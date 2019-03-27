import * as React from 'react'
import _ from 'lodash'
import { Amplitude } from 'expo'
import { NavigationScreenProps } from 'react-navigation'
import { View, TextInput, StyleSheet, Keyboard } from 'react-native'
import { authen } from '../requests'
import { COLORS } from '../constants'
import { ScreenWithKeyboard, Text, Layer } from '../components'

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
    Amplitude.logEvent('authen/submit-phone-number')
    // NOTE: I have to close the Keyboard first otherwise
    // it will not work on the next page.
    Keyboard.dismiss()
    this.setState({ loading: true })
    const response = await authen(this.state.phoneNumber)
    this.setState({ loading: false })
    if (!response) { return }
    this.props.navigation.navigate('VerifyPhoneNumber', {
      phoneNumber: this.state.phoneNumber,
      token: response.token,
      refCode: response.ref_code
    })
  }

  public onChangeText = async (text: string) => {
    this.setState({ phoneNumber: text })
  }

  public onPressBackButton = () => {
    Amplitude.logEvent('authen/press-back-button')
    this.props.navigation.goBack()
  }

  public render () {
    return (
      <ScreenWithKeyboard
        backButtonType='arrowleft'
        onPressBackButton={this.onPressBackButton}
        activeSubmitButton={this.state.phoneNumber.length === 10}
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={this.state.loading}
      >
        {(autoFocus: boolean) => (
          <View>
            <Text type='title' style={styles.title}>Enter your mobile number</Text>
              <Layer
                style={styles.layer}
                active={this.state.activeLayer}
              >
                <TextInput
                  onFocus={() => this.setState({ activeLayer: true })}
                  onBlur={() => this.setState({ activeLayer: false })}
                  autoFocus={autoFocus}
                  keyboardType='number-pad'
                  textContentType='telephoneNumber'
                  placeholder='0899999999'
                  onChangeText={this.onChangeText}
                  maxLength={10}
                  value={this.state.phoneNumber}
                />
              </Layer>
          </View>
        )}
      </ScreenWithKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1
  },
  title: {
    marginTop: 40
  },
  layer: {
    marginTop: 44,
    padding: 19
  }
})
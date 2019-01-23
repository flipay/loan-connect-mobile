import * as React from 'react'
import _ from 'lodash'
import { NavigationScreenProps } from 'react-navigation'
import { View, TextInput, StyleSheet } from 'react-native'
import { signUp } from '../requests'
import { COLORS } from '../constants'
import { Screen, Text, Layer } from '../components'

interface State {
  phoneNumber: string
  loading: boolean
  activeLayer: boolean
}

export default class SignUpScreen extends React.Component<
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
    this.setState({ loading: true })
    try {
      const user = await signUp(this.state.phoneNumber)
      this.props.navigation.navigate('VerifyPhoneNumber', {
        accountNumber: user.id,
        phoneNumber: this.state.phoneNumber
      })
      this.setState({ loading: false })
    } catch (err) {
      this.setState({ loading: false })
    }
  }

  public onChangeText = async (text: string) => {
    this.setState({ phoneNumber: text })
  }

  public render () {
    return (
      <Screen
        backButtonType='arrowleft'
        onPressBackButton={() => this.props.navigation.goBack()}
        activeSubmitButton={this.state.phoneNumber.length === 10}
        onPessSubmitButton={this.onPressSubmit}
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
            {this.state.loading && <Text>Loading...</Text>}
          </View>
        )}
      </Screen>
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
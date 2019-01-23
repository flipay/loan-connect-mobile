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
}

export default class SignUpScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      phoneNumber: '',
      loading: false
    }
  }

  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: 'Sign Up'
    }
  }

  public onChangeText = async (text: string) => {
    if (text.length === 10) {
      this.setState({ phoneNumber: text })
      const phoneNumberWithoutDash = _.replace(text, /-/g, '')
      this.setState({ loading: true })
      try {
        const user = await signUp(phoneNumberWithoutDash)
        this.props.navigation.navigate('VerifyPhoneNumber', {
          accountNumber: user.id
        })
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
      }
    } else {
      this.setState({ phoneNumber: text })
    }
  }

  public render () {
    return (
      <Screen
        navigation={this.props.navigation}
      >
        <Text type='title'>Enter your mobile number</Text>
        <View>
          <Layer style={styles.layer}>
            <TextInput
              autoFocus={true}
              keyboardType='number-pad'
              textContentType='telephoneNumber'
              placeholder='0899999999'
              onChangeText={this.onChangeText}
              maxLength={10}
              value={this.state.phoneNumber}
            />
          </Layer>
        </View>
        {this.state.loading && <Text>Loading...</Text>}
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1
  },
  layer: {
    marginTop: 44,
    padding: 19
  }
})
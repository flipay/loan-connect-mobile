import * as React from 'react'
import _ from 'lodash'
import { NavigationScreenProps } from 'react-navigation'
import { signUp } from '../requests'
import { View, TextInput, StyleSheet } from 'react-native'
import Text from '../components/Text'
import { COLORS } from '../constants/styleGuides'

interface State {
  phoneNumber: string
}

export default class SignUpScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      phoneNumber: ''
    }
  }

  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: 'Sign Up'
    }
  }

  public onChangeText = async (text: string) => {
    if ((text.length === 4 || text.length === 8) && _.last(text) !== '-') {
      this.setState({ phoneNumber: this.state.phoneNumber + '-' + _.last(text) })
    } else if (text.length === 12) {
      this.setState({ phoneNumber: text })
      const phoneNumberWithoutDash = _.replace(text, /-/g, '')
      const user = await signUp(phoneNumberWithoutDash)
      this.props.navigation.navigate('VerifyPhoneNumber', {
        accountNumber: user.id
      })
    } else {
      this.setState({ phoneNumber: text })
    }
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>Phone Number</Text>
        <View>
          <TextInput
            autoFocus={true}
            keyboardType='number-pad'
            textContentType='telephoneNumber'
            placeholder='089-999-9999'
            onChangeText={this.onChangeText}
            maxLength={12}
            value={this.state.phoneNumber}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1
  }
})
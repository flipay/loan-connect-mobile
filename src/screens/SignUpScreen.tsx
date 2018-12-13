import * as React from 'react'
import _ from 'lodash'
import { NavigationScreenProps } from 'react-navigation'
import { signUp } from '../requests'
import { View, TextInput, StyleSheet } from 'react-native'
import Text from '../components/Text'
import { COLORS } from '../constants/styleGuides'

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
      const user = await signUp(phoneNumberWithoutDash)
      this.props.navigation.navigate('VerifyPhoneNumber', {
        accountNumber: user.id
      })
      this.setState({ loading: false })
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
            placeholder='0899999999'
            onChangeText={this.onChangeText}
            maxLength={12}
            value={this.state.phoneNumber}
          />
        </View>
        {this.state.loading && <Text>Loading...</Text>}
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
import * as React from 'react'
import _ from 'lodash'
import { NavigationScreenProps } from 'react-navigation'
import DropdownAlert from 'react-native-dropdownalert';
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
  private dropdown = null
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
        if (this.dropdown) {
          this.dropdown.alertWithType('error', 'Error', err.message)
        }
      }
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
            maxLength={10}
            value={this.state.phoneNumber}
          />
        </View>
        {this.state.loading && !this.state.error && <Text>Loading...</Text>}
        <DropdownAlert ref={(ref: any) => this.dropdown = ref} />
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
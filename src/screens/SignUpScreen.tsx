import * as React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Text from '../components/Text'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants/styleGuides'
import _ from 'lodash'

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

  public onChangeText = (text: string) => {
    if ((text.length === 4 || text.length === 8) && _.last(text) !== '-') {
      this.setState({ phoneNumber: this.state.phoneNumber + '-' + _.last(text) })
    } else {
      this.setState({ phoneNumber: text })
    }
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>Phone Numver</Text>
        <View>
          <TextInput
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
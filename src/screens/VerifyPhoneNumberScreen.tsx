

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '../components/Text'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants/styleGuides'
import _ from 'lodash'

interface State {
  phoneNumber: string
}

export default class VerifyPhoneNumberScreen extends React.Component<
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
      title: 'Verify Phone Number'
    }
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>Plese check you SMS to get One Time Password (OTP)</Text>
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
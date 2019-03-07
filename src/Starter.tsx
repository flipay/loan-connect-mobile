
import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, AsyncStorage } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Amplitude } from 'expo'
import { logIn } from './requests'
import { COLORS } from './constants/styleGuides'
import { Text } from './components'

interface State {
  pin: string
}

export default class Start extends React.Component<
  NavigationScreenProps,
  State
> {

  public async componentDidMount () {
    // for testing
    AsyncStorage.clear()
    const accountId = await AsyncStorage.getItem('account_id')
    if (accountId) {
      this.props.navigation.navigate('Pin', {
        title: 'Log in with PIN',
        onSuccess: async (pin: string, stackNavigationLogInPin: any, setErrorConfirm: (errorMessage: string) => void, startLoading: () => void, stopLoading: () => void) => {
          try {
            startLoading()
            await logIn(accountId, pin)
            Amplitude.logEvent('login/successfully-login')
            stackNavigationLogInPin.navigate('Main')
          } catch (error) {
            stopLoading()
            Amplitude.logEvent('login/wrong-pin')
            setErrorConfirm('Wrong PIN')
          }
        }
      })
    } else {
      this.props.navigation.navigate('Welcome')
    }
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>nothing</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  kak: {
    width: 50,
    height: 50,
    backgroundColor: 'red'
  },
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1
  }
})
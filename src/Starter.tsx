import * as React from 'react'
import _ from 'lodash'
import { View, AsyncStorage } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { setUpRequest, unlock } from './requests'
import { checkLoginStatus, clearToken } from './secureStorage'
import { isFirstRun, runFirstTime } from './asyncStorage'
import { logEvent } from './analytics'

export default class Start extends React.Component<
  NavigationScreenProps
> {
  public async componentDidMount () {
    setUpRequest(this.props.navigation)

    // NOTE: for testing first run
    // await AsyncStorage.clear()

    const firstRun = await isFirstRun()
    if (firstRun) {
      await Promise.all([clearToken(), runFirstTime()])
    }
    const isLogIned = await checkLoginStatus()
    if (isLogIned) {
      this.props.navigation.navigate('Pin', {
        title: 'Unlock with PIN',
        onSuccess: async (
          pin: string,
          stackNavigationLogInPin: any,
          setErrorConfirm: (errorMessage: string) => void,
          startLoading: () => void,
          stopLoading: () => void,
          clearPin: () => void
        ) => {
          try {
            startLoading()
            await unlock(pin)
            this.goToMain(stackNavigationLogInPin)
          } catch (err) {
            stopLoading()
            logEvent('unlock/wrong-pin')
            setErrorConfirm('Wrong PIN')
            setTimeout(() => {
              clearPin()
            }, 1000)
          }
        }
      })
    } else {
      this.props.navigation.navigate('Welcome')
    }
  }

  public goToMain (navigation: any) {
    logEvent('unlock/successfully-unlock')
    navigation.navigate('Main')
  }

  public render () {
    return <View style={{ flex: 1 }} />
  }
}

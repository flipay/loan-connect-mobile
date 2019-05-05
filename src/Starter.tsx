import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, AsyncStorage } from 'react-native'
import { Updates, AppLoading } from 'expo'
import { NavigationScreenProps } from 'react-navigation'
import { setUpRequest, unlock } from './requests'
import { checkLoginStatus, clearToken } from './secureStorage'
import { isFirstRun, runFirstTime } from './asyncStorage'
import { logEvent } from './analytics'
import { alert } from './utils'

interface State {
  updating: boolean
}

export default class Start extends React.Component<
  NavigationScreenProps,
  State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      updating: true
    }
  }

  private updateSubscription: any
  public async componentDidMount () {
    setUpRequest(this.props.navigation)

    // NOTE: for testing first run
    // await AsyncStorage.clear()

    await this.checkForUpdate()
  }

  public componentWillUnmount () {
    this.updateSubscription.remove()
  }

  public async checkForUpdate () {
    this.updateSubscription = Updates.addListener(({ type }) => {
      if (type === Updates.EventType.DOWNLOAD_STARTED) {
        this.setState({ updating: true })
      } else if (type === Updates.EventType.DOWNLOAD_FINISHED) {
        Updates.reloadFromCache()
      }
    })

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync()
      if (isAvailable) {
        await Updates.fetchUpdateAsync()
      } else {
        this.run()
      }
    } catch (err) {
      alert(err)
    }
  }

  public async run () {
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
    return <View style={{ flex: 1, backgroundColor: 'red' }} />
  }
}

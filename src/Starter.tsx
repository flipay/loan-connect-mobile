import * as React from 'react'
import _ from 'lodash'
import { View, AsyncStorage } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { setUpRequest } from './requests'
import { checkLoginStatus, clearToken } from './secureStorage'
import { isFirstRun, runFirstTime } from './asyncStorage'

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
      this.props.navigation.navigate('Market')
    } else {
      this.props.navigation.navigate('Welcome')
    }
  }

  public render () {
    return <View style={{ flex: 1 }} />
  }
}

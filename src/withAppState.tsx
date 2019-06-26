
import * as React from 'react'
import { AppState } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { logEvent } from './analytics'
import { reloadIfNewVersionAvailable } from './services/versioning'

type AppStateType = 'active' | 'background' | 'inactive'

interface State {
  appState: AppStateType
}

export default function withAppState (Component: any) {
  return class App extends React.Component <NavigationScreenProps, State> {
    constructor (props: NavigationScreenProps) {
      super(props)
      this.state = {
        appState: AppState.currentState
      }
    }

    public componentDidMount () {
      logEvent('reboost-the-app')
      logEvent('open-the-app')
      AppState.addEventListener('change', this.handleAppStateChange)

    }

    public componentWillUnmount () {
      AppState.removeEventListener('change', this.handleAppStateChange)
    }

    public handleAppStateChange = async (nextAppState: AppStateType) => {
      if (this.state.appState !== 'acitve' && nextAppState === 'active') {
        logEvent('open-the-app')
        this.props.navigation.goBack()
        await reloadIfNewVersionAvailable()
      } else if (this.state.appState === 'active' && nextAppState !== 'active') {
        logEvent('close-the-app')
        this.props.navigation.navigate('Splash')
      }
      this.setState({ appState: nextAppState })
    }

    public render () {
      return (
        <Component navigation={this.props.navigation} />
      )
    }
  }
}
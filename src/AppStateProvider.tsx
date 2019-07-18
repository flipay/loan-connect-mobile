
import * as React from 'react'
import { AppState } from 'react-native'
import { logEvent } from './services/Analytic'
import { reloadIfNewVersionAvailable } from './services/versioning'
import { navigate, goBack } from './services/navigation'

type AppStateType = 'active' | 'background' | 'inactive'

interface State {
  appState: AppStateType
}

interface Props {
  children: any
}

export default class AppStateProvider extends React.Component <Props, State> {
  constructor (props: Props) {
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
      goBack()
      await reloadIfNewVersionAvailable()
    } else if (this.state.appState === 'active' && nextAppState !== 'active') {
      logEvent('close-the-app')
      navigate('Splash')
    }
    this.setState({ appState: nextAppState })
  }

  public render () {
    return this.props.children
  }
}
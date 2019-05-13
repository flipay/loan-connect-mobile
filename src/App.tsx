import * as React from 'react'
import { Platform, NetInfo, Alert, AppState } from 'react-native'
import { AppLoading, Updates, Constants } from 'expo'
import { createAppContainer } from 'react-navigation'
import Sentry from 'sentry-expo'
import preloadAssets from './preloadAsssets'
import AppNavigator from './AppNavigator'
import { logEvent } from './analytics'

// NOTE: for testing Sentry locally
// Sentry.enableInExpoDevelopment = true
Sentry.config(
  'https://7461bec2f42c41cdafde6f0048ac0047@sentry.io/1438488'
).install()

// HACK: to make (number).toLocaleString to work correctly for Android
if (Platform.OS === 'android') {
  require('intl')
  require('intl/locale-data/jsonp/en-US')
}

const AppContainer = createAppContainer(AppNavigator)

type AppStateType = 'active' | 'background' | 'inactive'

interface State {
  isReady: boolean
  appState: AppStateType
}

export default class App extends React.Component<{}, State> {
  constructor (props: {}) {
    super(props)
    this.state = {
      isReady: false,
      appState: AppState.currentState
    }
  }

  public componentDidMount () {
    logEvent('open-the-app')
    AppState.addEventListener('change', this.handleAppStateChange)

  }

  public componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  public handleAppStateChange = async (nextAppState: AppStateType) => {
    if (this.state.appState !== 'acitve' && nextAppState === 'active') {
      if (Constants.manifest.releaseChannel) {
        const { isAvailable } = await Updates.checkForUpdateAsync()
        if (isAvailable) {
          Updates.reload()
        }
      }
    }
    this.setState({ appState: nextAppState })
  }

  public postError (message: string) {
    Alert.alert(
      message,
      'Please contact our customer support team',
      [{ text: 'Reload the app', onPress: Updates.reload }],
      { cancelable: false }
    )
  }

  public checkNewVersion = async () => {
    if (Constants.manifest.releaseChannel) {
      try {
        const { isAvailable } = await Updates.checkForUpdateAsync()
        if (isAvailable) {
          const { isNew } = await Updates.fetchUpdateAsync()
          if (isNew) {
            Updates.reloadFromCache()
          } else {
            const message = 'Could not get the new version of Flipay'
            this.postError(message)
            Sentry.captureException(Error(message))
          }
        }
      } catch (err) {
        const { type } = await NetInfo.getConnectionInfo()
        let errorMessage = 'Please connect to the internet.'
        if (type !== 'none') {
          errorMessage = 'Have a problem on updating new version of Flipay'
          Sentry.captureException(err)
        }
        this.postError(errorMessage)
      }

    }
  }

  public loadAssetsAsync = async () => {
    await this.checkNewVersion()
    await preloadAssets()
  }

  public render () {
    return !this.state.isReady ? (
      <AppLoading
        startAsync={this.loadAssetsAsync}
        onFinish={() => this.setState({ isReady: true })}
        onError={Sentry.captureException}
      />
    ) : (
      <AppContainer />
    )
  }
}

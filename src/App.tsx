import * as React from 'react'
import { Platform } from 'react-native'
import { AppLoading } from 'expo'
import { createAppContainer } from 'react-navigation'
import Sentry from 'sentry-expo'
import preloadAssets from './preloadAsssets'
import AppNavigator from './AppNavigator'
import { logEvent } from './analytics'

// NOTE: for testing Sentry locally
// Sentry.enableInExpoDevelopment = true
Sentry.config('https://7461bec2f42c41cdafde6f0048ac0047@sentry.io/1438488').install()

// HACK: to make (number).toLocaleString to work correctly for Android
if (Platform.OS === 'android') {
  require('intl')
  require('intl/locale-data/jsonp/en-US')
}

const AppContainer = createAppContainer(AppNavigator)

interface State {
  isReady: boolean
}

export default class App extends React.Component<{}, State> {
  constructor (props: {}) {
    super(props)
    this.state = {
      isReady: false
    }
  }
  public componentDidMount () {
    logEvent('open-the-app')
  }

  public async loadAssetsAsync () {
    await preloadAssets()
  }

  public render () {
    return !this.state.isReady
      ? (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={Sentry.captureException}
        />
      ) : <AppContainer />
  }
}

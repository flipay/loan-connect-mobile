import * as React from 'react'
import { Platform } from 'react-native'
import { AppLoading } from 'expo'
import { createAppContainer } from 'react-navigation'
import Sentry from 'sentry-expo'
import { ContextProvider, MarketPricesContextConsumer } from './context'
import preloadAssets from './preloadAsssets'
import withAppState from './withAppState'
import AppNavigator from './AppNavigator'
import { setTopLevelNavigator } from './navigation'
import { fetchNewVersionIfAvailable } from './services/versioning'

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

const AppContainer = createAppContainer(withAppState(AppNavigator))

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

  public loadAssetsAsync = async (fetchMarketPrices: () => void) => {
    await fetchNewVersionIfAvailable()
    await preloadAssets()
    await fetchMarketPrices()
  }

  public render () {
    return (
      <ContextProvider>
        {!this.state.isReady ? (
          <MarketPricesContextConsumer>
            {({ fetchMarketPrices }) => (
              <AppLoading
                startAsync={() => this.loadAssetsAsync(fetchMarketPrices)}
                onFinish={() => this.setState({ isReady: true })}
                onError={Sentry.captureException}
              />)}
          </MarketPricesContextConsumer>
        ) : (
            <AppContainer
              ref={(navigatorRef: any) => setTopLevelNavigator(navigatorRef)}
            />
        )}
      </ContextProvider>

    )
  }
}

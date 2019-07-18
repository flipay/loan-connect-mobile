import * as React from 'react'
import { Platform, View, Text } from 'react-native'
import { AppLoading } from 'expo'
import { createAppContainer } from 'react-navigation'
import { ContextProvider, MarketPricesContextConsumer } from './context'
import preloadAssets from './preloadAsssets'
import AppStateProvider from './AppStateProvider'
import AppNavigator from './AppNavigator'
import { setTopLevelNavigator } from './services/navigation'
import { fetchNewVersionIfAvailable } from './services/versioning'
import * as ErrorReport from './services/ErrorReport'
import { isJailBroken } from './services/jailbreak'

// NOTE: to enble this ErrorReport service in Development
ErrorReport.initialize()

// HACK: to make (number).toLocaleString to work correctly for Android
if (Platform.OS === 'android') {
  require('intl')
  require('intl/locale-data/jsonp/en-US')
}

const AppContainer = createAppContainer(AppNavigator)

interface State {
  isReady: boolean
  jailBroken: boolean
}

export default class App extends React.Component<{}, State> {
  constructor (props: {}) {
    super(props)
    this.state = {
      isReady: false,
      jailBroken: false
    }
  }

  public loadAssetsAsync = async (fetchMarketPrices: () => void) => {
    const jailBroken = await isJailBroken()
    if (jailBroken) {
      this.setState({ jailBroken: true })
    } else {
      await fetchNewVersionIfAvailable()
      await preloadAssets()
      await fetchMarketPrices()
    }
  }

  public render () {
    if (this.state.jailBroken) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>No support for rooted/jailbroken phones</Text>
        </View>
      )
    }
    return (
      <ContextProvider>
        <AppStateProvider>
        {!this.state.isReady ? (
          <MarketPricesContextConsumer>
            {({ fetchMarketPrices }) => (
              <AppLoading
                startAsync={() => this.loadAssetsAsync(fetchMarketPrices)}
                onFinish={() => this.setState({ isReady: true })}
                onError={ErrorReport.notify}
              />)}
          </MarketPricesContextConsumer>
        ) : (
            <AppContainer
              ref={(navigatorRef: any) => setTopLevelNavigator(navigatorRef)}
            />
        )}
        </AppStateProvider>
      </ContextProvider>
    )
  }
}

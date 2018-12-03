
import * as React from 'react'

import { createAppContainer, createStackNavigator } from 'react-navigation'
import { ConstantsScreen } from './constants/ConstantsScreen'
import MainScreen from './screens/MainScreen'
import TradeScreen from './screens/TradeScreen'
import { ManifestScreen } from './constants/ManifestScreen'
import { PlatformScreen } from './constants/PlatformScreen'
import { SystemFontsScreen } from './constants/SystemFontsScreen'
import { Font } from 'expo'

const AppNavigator = createStackNavigator({
  Main: { screen: MainScreen, navigationOptions: {
    header: null
  }},
  Trade: { screen: TradeScreen },
  Constants: { screen: ConstantsScreen },
  Manifest: { screen: ManifestScreen },
  Platform: { screen: PlatformScreen },
  SystemFonts: { screen: SystemFontsScreen }
})

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {
  public async componentDidMount () {
    await Font.loadAsync({
      'nunito': require('../assets/fonts/Nunito-Regular.ttf'),
      'nunito-semibold': require('../assets/fonts/Nunito-Regular.ttf')
    })
    this.setState({ fontLoaded: true })
  }

  public render () {
    return <AppContainer />
  }
}

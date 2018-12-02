import { createAppContainer, createStackNavigator } from 'react-navigation'

import { ConstantsScreen } from './constants/ConstantsScreen'

import MainScreen from './screens/MainScreen'
import TradeScreen from './screens/TradeScreen'
import { ManifestScreen } from './constants/ManifestScreen'
import { PlatformScreen } from './constants/PlatformScreen'
import { SystemFontsScreen } from './constants/SystemFontsScreen'

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

export default createAppContainer(AppNavigator)
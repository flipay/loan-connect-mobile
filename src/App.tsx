import { createStackNavigator } from 'react-navigation'

import { ConstantsScreen } from './constants/ConstantsScreen'

import { MainScreen } from './screens/MainScreen'
import { ManifestScreen } from './constants/ManifestScreen'
import { PlatformScreen } from './constants/PlatformScreen'
import { SystemFontsScreen } from './constants/SystemFontsScreen'

export default createStackNavigator({
  // tslint:disable:object-literal-sort-keys
  Main: { screen: MainScreen },

  Constants: { screen: ConstantsScreen },
  Manifest: { screen: ManifestScreen },
  Platform: { screen: PlatformScreen },
  SystemFonts: { screen: SystemFontsScreen },
})
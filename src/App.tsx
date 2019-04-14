import * as React from 'react'
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation'

import Starter from './Starter'
import MainScreen from './screens/MainScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import AuthenScreen from './screens/AuthenScreen'
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen'
import TradeScreen from './screens/TradeScreen'
import DepositScreen from './screens/DepositScreen'
import WithdrawalScreen from './screens/WithdrawalScreen'
import ComparisonScreen from './screens/ComparisonScreen'
import ActivityScreen from './screens/ActivityScreen'
import ProfileScreen from './screens/ProfileScreen'
import PinScreen from './screens/PinScreen'
import { Font, Amplitude } from 'expo'
import { Platform } from 'react-native'
import Sentry from 'sentry-expo'

// NOTE: for testing Sentry locally
// Sentry.enableInExpoDevelopment = true

Sentry.config('https://7461bec2f42c41cdafde6f0048ac0047@sentry.io/1438488').install()

// HACK: to make (number).toLocaleString to work correctly for Android
if (Platform.OS === 'android') {
  require('intl')
  require('intl/locale-data/jsonp/en-US')
}

const AuthStack = createStackNavigator(
  {
    Pin: { screen: PinScreen }
  },
  {
    headerMode: 'none'
  }
)

const VerificationStack = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    Authen: { screen: AuthenScreen },
    VerifyPhoneNumber: { screen: VerifyPhoneNumberScreen }
  },
  {
    headerMode: 'none'
  }
)

const HomeStack = createStackNavigator(
  {
    Main: { screen: MainScreen },
    Deposit: { screen: DepositScreen },
    Withdrawal: { screen: WithdrawalScreen },
    Trade: { screen: TradeScreen },
    Comparison: { screen: ComparisonScreen }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

HomeStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0
  }
}

const MainApp = createBottomTabNavigator(
  {
    Home: HomeStack,
    Activity: ActivityScreen,
    Profile: ProfileScreen
  }
)

const AppNavigator = createSwitchNavigator({
  Starter,
  Verification: VerificationStack,
  MainApp,
  Auth: AuthStack
})

const AppContainer = createAppContainer(AppNavigator)

interface State {
  fontLoaded: boolean
}

export default class App extends React.Component<{}, State> {
  constructor (props: {}) {
    super(props)
    this.state = {
      fontLoaded: false
    }
  }
  public async componentDidMount () {
    Amplitude.initialize('ca298c390e996d2d0ca61eeabf1a7756')
    Amplitude.logEvent('open-the-app')
    await Font.loadAsync({
      nunito: require('../assets/fonts/Nunito-Regular.ttf'),
      'nunito-semibold': require('../assets/fonts/Nunito-Regular.ttf')
    })
    this.setState({ fontLoaded: true })
  }

  public render () {
    return this.state.fontLoaded ? <AppContainer /> : null
  }
}

import * as React from 'react'
import axios from 'axios'
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation'

import Starter from './Starter'
import MainScreen from './screens/MainScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import AuthenScreen from './screens/AuthenScreen'
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen'
import TradeScreen from './screens/TradeScreen'
import ComparisonScreen from './screens/ComparisonScreen'
import PinScreen from './screens/PinScreen'
import { Font, Amplitude } from 'expo'

axios.defaults.baseURL = 'https://api.flipay.co/v1/'
// axios.defaults.baseURL = 'https://flipay-mock-backend.herokuapp.com/'
// axios.defaults.baseURL = 'http://192.168.0.4:8000'

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

const AppStack = createStackNavigator(
  {
    Main: { screen: MainScreen },
    Trade: { screen: TradeScreen },
    Comparison: { screen: ComparisonScreen }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

const AppNavigator = createSwitchNavigator({
  Starter: Starter,
  Verification: VerificationStack,
  Home: AppStack,
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

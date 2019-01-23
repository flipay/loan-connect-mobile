import * as React from 'react'
import axios from 'axios'
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation'
import Starter from './Starter'
import MainScreen from './screens/MainScreen'
import SignUpScreen from './screens/SignUpScreen'
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen'
import TradeScreen from './screens/TradeScreen'
import ComparisonScreen from './screens/ComparisonScreen'
import PinScreen from './screens/PinScreen'
import { Font } from 'expo'

axios.defaults.baseURL = 'http://192.168.1.2:3000'

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
    SignUp: { screen: SignUpScreen },
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
  Auth: AuthStack,
  Home: AppStack,
  Verification: VerificationStack
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

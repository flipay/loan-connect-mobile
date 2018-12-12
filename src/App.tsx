import * as React from 'react'

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
import PinScreen from './screens/PinScreen'
import { Font } from 'expo'

const AuthStack = createStackNavigator({
  Pin: { screen: PinScreen }
})

const VerificationStack = createStackNavigator({
  SignUp: { screen: SignUpScreen },
  VerifyPhoneNumber: { screen: VerifyPhoneNumberScreen }
})

const AppStack = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null
    }
  },
  Trade: { screen: TradeScreen }
})

const AppNavigator = createSwitchNavigator({
  Starter: Starter,
  Verification: VerificationStack,
  Auth: AuthStack,
  Home: AppStack
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

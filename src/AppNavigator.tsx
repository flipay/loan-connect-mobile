
import * as React from 'react'
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation'

import { FontAwesome } from '@expo/vector-icons'

import Starter from './Starter'
import MarketScreen from './screens/MarketScreen'
import AssetScreen from './screens/AssetScreen'
import WalletsScreen from './screens/WalletsScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import AuthenScreen from './screens/AuthenScreen'
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen'
import TradeScreen from './screens/TradeScreen'
import DepositScreen from './screens/DepositScreen'
import WithdrawalScreen from './screens/WithdrawalScreen'
import ComparisonScreen from './screens/ComparisonScreen'
import AccountScreen from './screens/AccountScreen'
import PinScreen from './screens/PinScreen'
import { Text } from './components'
import { COLORS } from './constants'
import { logEvent } from './analytics'

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

const MarketStack = createStackNavigator(
  {
    Market: { screen: MarketScreen },
    Asset: { screen: AssetScreen },
    Trade: { screen: TradeScreen }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      return {
        tabBarVisible: navigation.state.index === 0
      }
    }
  }
)

const WalletsStack = createStackNavigator(
  {
    Wallets: { screen: WalletsScreen },
    Deposit: { screen: DepositScreen },
    Withdrawal: { screen: WithdrawalScreen },
    Comparison: { screen: ComparisonScreen }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      return {
        tabBarVisible: navigation.state.index === 0
      }
    }
  }
)

const MainApp = createBottomTabNavigator(
  {
    Market: {
      screen: MarketStack,
      navigationOptions: {
        tabBarOnPress: ({ navigation }: any) => {
          logEvent('tab-bar/press-market-menu')
          navigation.navigate('Market')
        }
      }
    },
    Wallets: {
      screen: WalletsStack,
      navigationOptions: {
        tabBarOnPress: ({ navigation }: any) => {
          logEvent('tab-bar/press-wallets-menu')
          navigation.navigate('Wallets')
        }
      }
    },
    Account: {
      screen: AccountScreen,
      navigationOptions: {
        tabBarOnPress: ({ navigation }: any) => {
          logEvent('tab-bar/press-account-menu')
          navigation.navigate('Account')
        }
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Wallets') {
          return <Text style={{ fontFamily: 'flipay-icon', fontSize: 28 }} color={tintColor || undefined}></Text>
        } else if (routeName === 'Market') {
          iconName = 'line-chart'
        } else {
          return <Text style={{ fontFamily: 'flipay-icon', fontSize: 28 }} color={tintColor || undefined}></Text>
        }
        return <FontAwesome name={iconName} size={25} color={tintColor || undefined} />
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: COLORS.P400,
      inactiveTintColor: COLORS.N400,
      style: { borderTopColor: COLORS.N300 }
    }
  }
)

export default createSwitchNavigator({
  Starter,
  Verification: VerificationStack,
  MainApp,
  Auth: AuthStack
})

import * as React from 'react'
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

import Starter from './Starter'
import MainScreen from './screens/MainScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import AuthenScreen from './screens/AuthenScreen'
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen'
import TradeScreen from './screens/TradeScreen'
import DepositScreen from './screens/DepositScreen'
import WithdrawalScreen from './screens/WithdrawalScreen'
import ComparisonScreen from './screens/ComparisonScreen'
// import ActivityScreen from './screens/ActivityScreen'
import AccountScreen from './screens/AccountScreen'
import PinScreen from './screens/PinScreen'

import { COLORS } from './constants'

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
    Home: {
      screen: HomeStack,
      navigationOptions: {
        title: 'Buy/Sell'
      }
    },
    // Activity: {
    //   screen: ActivityScreen,
    //   navigationOptions: {
    //     title: 'Activity'
    //   }
    // },
    Account: {
      screen: AccountScreen,
      navigationOptions: {
        title: 'Account'
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state
        let IconComponent = FontAwesome
        let iconName
        if (routeName === 'Home') {
          iconName = 'exchange'
        } else if (routeName === 'Activity') {
          IconComponent = MaterialIcons
          iconName = 'history'
        } else {
          iconName = 'user-circle-o'
        }
        return <IconComponent name={iconName} size={25} color={tintColor || undefined} />
      }
    }),
    tabBarOptions: {
      activeTintColor: COLORS.P400,
      inactiveTintColor: COLORS.N400
    }
  }
)

export default createSwitchNavigator({
  Starter,
  Verification: VerificationStack,
  MainApp,
  Auth: AuthStack
})
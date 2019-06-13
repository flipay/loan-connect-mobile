import * as React from 'react'
import _ from 'lodash'
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation'

import { FontAwesome } from '@expo/vector-icons'

import {
  MarketPricesContextConsumer,
  BalancesContextConsumer
} from './context'

import Starter from './Starter'
import MarketScreen from './screens/MarketScreen'
import AssetScreen from './screens/AssetScreen'
import PortfolioScreen from './screens/PortfolioScreen'
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
import { unlock, isLocked } from './requests'

const PORTFOLIO = 'Portfolio'
const ACCOUNT = 'Account'
const TRADE = 'Trade'
const DEPOSIT = 'Deposit'
const WITHDRAWAL = 'Withdrawal'
const MARKET = 'Market'
const COMPARISON = 'Comparison'

const PRIVATE_ROUTES = {
  PORTFOLIO,
  TRADE,
  DEPOSIT,
  WITHDRAWAL,
  ACCOUNT,
  COMPARISON
}

const privateRoutes = _.map(PRIVATE_ROUTES)

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
    [MARKET]: { screen: ({ navigation }: any) => (
      <MarketPricesContextConsumer>
        {({ marketPrices, fetchMarketPrices }) => (
          <MarketScreen navigation={navigation} fetchMarketPrices={fetchMarketPrices} marketPrices={marketPrices} />
        )}
      </MarketPricesContextConsumer>
    )
    },
    Asset: { screen: AssetScreen },
    [TRADE]: { screen: ({ navigation }: any) => (
      <BalancesContextConsumer>
        {(args) => (
          <TradeScreen navigation={navigation} {...args} />
        )}
      </BalancesContextConsumer>
    )}
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

const PortfolioStack = createStackNavigator(
  {
    [PORTFOLIO]: { screen: ({ navigation }: any) => (
      <MarketPricesContextConsumer>
        {(args1) => (
          <BalancesContextConsumer>
            {(args2) => (
              <PortfolioScreen navigation={navigation} {...args1} {...args2} />
            )}
          </BalancesContextConsumer>
        )}
      </MarketPricesContextConsumer>
    )},
    [DEPOSIT]: { screen: DepositScreen },
    [WITHDRAWAL]: { screen: WithdrawalScreen },
    [COMPARISON]: { screen: ComparisonScreen }
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

const AppContent = createBottomTabNavigator(
  {
    MarketStack: {
      screen: MarketStack,
      navigationOptions: {
        tabBarOnPress: ({ navigation }: any) => {
          logEvent('tab-bar/press-market-menu')
          navigation.navigate('Market')
        }
      }
    },
    PortfolioStack: {
      screen: PortfolioStack,
      navigationOptions: {
        tabBarOnPress: ({ navigation }: any) => {
          logEvent('tab-bar/press-portfolio-menu')
          navigation.navigate('Portfolio')
        }
      }
    },
    [ACCOUNT]: {
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
        if (routeName === 'PortfolioStack') {
          iconName = 'pie-chart'
        } else if (routeName === 'MarketStack') {
          iconName = 'line-chart'
        } else {
          return (
            <Text
              style={{ fontFamily: 'flipay-icon', fontSize: 28 }}
              color={tintColor || undefined}
            >
              
            </Text>
          )
        }
        return (
          <FontAwesome
            name={iconName}
            size={25}
            color={tintColor || undefined}
          />
        )
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

const MainApp = createStackNavigator(
  {
    AppContent: { screen: AppContent },
    Unlock: { screen: PinScreen }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

const defaultGetStateForAction = MainApp.router.getStateForAction

MainApp.router.getStateForAction = (action, state) => {
  const newDefaultState = defaultGetStateForAction(action, state)
  if (
    action.type === 'Navigation/NAVIGATE' &&
    _.includes(privateRoutes, action.routeName) &&
    isLocked()
  ) {
    return handlePrivateScreens(action, state)
  }

  return newDefaultState
}

function handlePrivateScreens (action: any, state: any) {
  const { routes } = state
  return {
    ...state,
    index: 1,
    routes: [
      ...routes,
      {
        routeName: 'Unlock',
        key: 'Unlock',
        params: {
          title: 'Unlock with PIN',
          closable: true,
          onSuccess: (...args: Array<any>) => onUnlockPinSuccessfully(...args, action.routeName)
        }
      }
    ]
  }
}

async function onUnlockPinSuccessfully (
  pin: string,
  stackNavigationLogInPin: any,
  setErrorConfirm: (errorMessage: string) => void,
  startLoading: () => void,
  stopLoading: () => void,
  clearPin: () => void,
  destinationRoute: string
) {
  try {
    startLoading()
    await unlock(pin)
    logEvent('unlock/successfully-unlock')
    stackNavigationLogInPin.navigate(destinationRoute)
  } catch (err) {
    stopLoading()
    logEvent('unlock/wrong-pin')
    setErrorConfirm('Wrong PIN')
    setTimeout(() => {
      clearPin()
    }, 1000)
  }
}

const AppNavigator = createSwitchNavigator({
  Starter,
  Verification: VerificationStack,
  MainApp,
  Auth: AuthStack
})

export default AppNavigator

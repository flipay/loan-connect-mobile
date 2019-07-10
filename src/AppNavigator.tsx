import * as React from 'react'
import { Animated, Easing } from 'react-native'
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
import CollectInfoScreen from './screens/CollectInfoScreen'
import MarketScreen from './screens/MarketScreen'
import CryptoScreen from './screens/CryptoScreen'
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
import SplashScreen from './screens/SplashScreen'
import { Text } from './components'
import { COLORS, PRIVATE_ROUTES } from './constants'
import { logEvent } from './analytics'
import { unlock, isLocked } from './requests'

const {
  PORTFOLIO,
  TRADE,
  DEPOSIT,
  WITHDRAWAL,
  ACCOUNT,
  COMPARISON
} = PRIVATE_ROUTES
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
    CollectInfo: { screen: CollectInfoScreen },
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
    Market: { screen: ({ navigation }: any) => (
      <MarketPricesContextConsumer>
        {({ marketPrices, fetchMarketPrices }) => (
          <MarketScreen navigation={navigation} fetchMarketPrices={fetchMarketPrices} marketPrices={marketPrices} />
        )}
      </MarketPricesContextConsumer>
    )
    },
    Crypto: { screen: CryptoScreen },
    [TRADE]: { screen: ({ navigation }: any) => (
      <BalancesContextConsumer>
        {(args) => (
          <TradeScreen navigation={navigation} {...args} />
        )}
      </BalancesContextConsumer>
    )},
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
    [WITHDRAWAL]: { screen: WithdrawalScreen }
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
    headerMode: 'none',
    transitionConfig : () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
      }
    })
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
          onClose: () => {
            logEvent('unlock/press-back-button')
          },
          onSuccess: (...args: Array<any>) => onUnlockPinSuccessfully(...args, action)
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
  action: any
) {
  try {
    startLoading()
    await unlock(pin)
    logEvent('unlock/successfully-unlock')
    stackNavigationLogInPin.navigate(action.routeName, action.params)
  } catch (err) {
    stopLoading()
    logEvent('unlock/wrong-pin')
    setErrorConfirm('Wrong PIN')
    setTimeout(() => {
      clearPin()
    }, 1000)
  }
}

const App = createSwitchNavigator({
  Starter,
  Verification: VerificationStack,
  MainApp,
  Auth: AuthStack
})

export default createStackNavigator(
  {
    App: { screen: App },
    Splash: { screen: SplashScreen }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    transitionConfig : () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
      }
    })
  }
)

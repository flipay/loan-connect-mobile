import * as React from 'react'
import _ from 'lodash'
import {
  ScrollView,
  RefreshControl,
  StatusBar,
  View,
  StyleSheet
} from 'react-native'
import { LinearGradient } from 'expo'
import { NavigationScreenProps } from 'react-navigation'
import { Text, AssetCard, Button } from '../components'
import { COLORS, ASSETS } from '../constants'
import { AssetId, Asset } from '../types'
import { getPortfolio } from '../requests'
import { hasEverDeposit } from '../asyncStorage'
import { alert, toString } from '../utils'
import { logEvent } from '../analytics'

interface State {
  selectedAsset?: AssetId | null
  assets: Array<Asset>
  refreshing: boolean
  hasDeposited: boolean
}

export default class MainScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      selectedAsset: null,
      assets: [],
      refreshing: false,
      hasDeposited: true
    }
  }
  private willFocusSubscription: any

  public componentDidMount () {
    this.fetchData()
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        StatusBar.setBarStyle('light-content')
        this.fetchData()
      }
    )
  }

  public componentWillUnmount () {
    this.willFocusSubscription.remove()
  }

  public async fetchData () {
    try {
      const [assets, hasDeposited] = await Promise.all([getPortfolio(), hasEverDeposit()])
      this.setState({ assets, hasDeposited })
    } catch (err) {
      alert(err)
    }
  }

  public getSumBalance () {
    return _.sumBy(
      this.state.assets,
      asset => (asset.price || 1) * (asset.amount || 0)
    )
  }

  public onPress = (assetId: AssetId) => {
    if (this.state.selectedAsset === assetId) {
      logEvent('main/close-asset-card', {
        assetId: assetId
      })
      this.setState({ selectedAsset: null })
    } else {
      logEvent('main/open-asset-card', {
        assetId: assetId
      })
      this.setState({ selectedAsset: assetId })
    }
  }

  public shouldShowWelcomeMessage () {
    return this.getSumBalance() === 0 && !this.state.hasDeposited
  }

  public onPressDepositFromWelcomeMessage = () => {
    logEvent('main/press-deposit-from-welcome-message')
    this.props.navigation.navigate('Deposit')
  }

  public renderWelcomeMessage () {
    return (
      <View style={styles.welcomeSection}>
        <Text color={COLORS.WHITE} style={styles.welcome}>Welcome to Flipay!</Text>
        <Text type='title' color={COLORS.WHITE} style={styles.howMuch}>How much would you like to start investment?</Text>
        <Button onPress={this.onPressDepositFromWelcomeMessage}>Deposit your money</Button>
      </View>
    )
  }

  public renderHeader () {
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={[styles.header, this.shouldShowWelcomeMessage() && { height: 404 }]}
      >
        {this.shouldShowWelcomeMessage()
          ? this.renderWelcomeMessage()
          : (
            <View style={styles.headerTextContainer}>
              <Text type='caption' color={COLORS.P100}>
                TOTAL VALUE
              </Text>
              <Text style={styles.totalValueContainer}>
                <Text color={COLORS.WHITE}>฿</Text>
                <Text
                  type='large-title'
                  style={styles.totalValue}
                  color={COLORS.WHITE}
                >
                  {` ${toString(this.getSumBalance(), ASSETS.THB.decimal)}`}
                </Text>
              </Text>
            </View>
          )
        }
      </LinearGradient>
    )
  }

  public onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.fetchData()
    this.setState({ refreshing: false })
  }

  public render () {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            backgroundColor: '#fff',
            flex: 1
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              progressBackgroundColor={COLORS.P400}
              tintColor={COLORS.P400}
            />
          }
        >
          {this.renderHeader()}
          <View style={styles.cardsContainer}>
            {this.state.assets.map((asset: Asset, index) => {
              const expanded =
                !!this.state.selectedAsset &&
                this.state.selectedAsset === asset.id
              return (
                <View key={asset.id}>
                  {index !== 0 && (
                    <View
                      style={expanded ? styles.bigSpace : styles.smallSpace}
                    />
                  )}
                  <AssetCard
                    id={asset.id}
                    cash={_.get(this.state.assets, '[0].amount', 0)}
                    amount={asset.amount || 0}
                    price={asset.price}
                    expanded={expanded}
                    onPress={() => this.onPress(asset.id)}
                    navigation={this.props.navigation}
                  />
                  {index !== this.state.assets.length - 1 && (
                    <View
                      style={expanded ? styles.bigSpace : styles.smallSpace}
                    />
                  )}
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    backgroundColor: 'blue',
    height: 236,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTextContainer: {
    alignItems: 'center'
  },
  totalValueContainer: {
    color: COLORS.WHITE,
    marginTop: 8
  },
  totalValue: {
    marginLeft: 8
  },
  cardsContainer: {
    position: 'relative',
    top: -24
  },
  bigSpace: {
    height: 12
  },
  smallSpace: {
    height: 4
  },
  welcomeSection: {
    alignItems: 'flex-start',
    width: '100%',
    padding: 28
  },
  welcome: {
    marginBottom: 8
  },
  howMuch: {
    marginBottom: 24
  }
})

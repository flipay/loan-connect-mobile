import * as React from 'react'
import _ from 'lodash'
import {
  StatusBar,
  View,
  StyleSheet
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import {
  Text,
  AssetCard,
  Button,
  TransferModal,
  ScreenWithCover
} from '../components'
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
  transferModalVisible: boolean
}

export default class PortfolioScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      selectedAsset: null,
      assets: [],
      refreshing: false,
      hasDeposited: true,
      transferModalVisible: false
    }
  }
  private willFocusSubscription: any

  public componentDidMount () {
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
      const [assets, hasDeposited] = await Promise.all([
        getPortfolio(),
        hasEverDeposit()
      ])
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
      logEvent('portfolio/close-asset-card', {
        assetId: assetId
      })
      this.setState({ selectedAsset: null })
    } else {
      logEvent('portfolio/open-asset-card', {
        assetId: assetId
      })
      this.setState({ selectedAsset: assetId })
    }
  }

  public shouldShowWelcomeMessage () {
    return this.getSumBalance() === 0 && !this.state.hasDeposited
  }

  public onPressDepositFromWelcomeMessage = () => {
    logEvent('portfolio/press-deposit-from-welcome-message')
    this.props.navigation.navigate('Deposit')
  }

  public renderWelcomeMessage () {
    return (
      <View style={styles.welcomeSection}>
        <Text color={COLORS.WHITE} style={styles.welcome}>
          Welcome to Flipay!
        </Text>
        <Text type='title' color={COLORS.WHITE} style={styles.howMuch}>
          How much would you like to start the investment?
        </Text>
        <Button onPress={this.onPressDepositFromWelcomeMessage}>
          Deposit your money
        </Button>
      </View>
    )
  }

  public renderHeader () {
    return (
      <View>
        {this.shouldShowWelcomeMessage()
          ? this.renderWelcomeMessage()
          : !_.isEmpty(this.state.assets) && (
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
            )}
      </View>
    )
  }

  public onPressTransferButton = (assetId: AssetId) => {
    logEvent('portfolio/press-transfer-button', { assetId })
    this.setState({ transferModalVisible: true })
  }

  public onRefresh = async () => {
    logEvent('portfolio/pull-the-screen-to-reload')
    this.setState({ refreshing: true })
    await this.fetchData()
    this.setState({ refreshing: false })
  }

  public onPressDeposit = (assetId: AssetId) => {
    return () => {
      logEvent('portfolio/press-deposit-button-on-tranfer-modal', { assetId })
      this.setState({ transferModalVisible: false })
      this.props.navigation.navigate('Deposit', {
        assetId: this.state.selectedAsset
      })
    }
  }

  public onPressWithdraw = (remainingBalance: number, assetId: AssetId) => {
    return () => {
      logEvent('portfolio/press-withdraw-button-on-tranfer-modal', { assetId })
      this.setState({ transferModalVisible: false })
      this.props.navigation.navigate('Withdrawal', {
        assetId: this.state.selectedAsset,
        remainingBalance
      })
    }
  }

  public onPressOutsideModal = (assetId: AssetId) => {
    return () => {
      logEvent('portfolio/press-outside-tranfer-modal', { assetId })
      this.setState({ transferModalVisible: false })
    }
  }

  public renderTransferModal () {
    if (!this.state.transferModalVisible) {
      return null
    }
    if (!this.state.selectedAsset) {
      return null
    }
    const selectedAsset = _.find(
      this.state.assets,
      asset => asset.id === this.state.selectedAsset
    )
    if (!selectedAsset) {
      return null
    }
    return (
      <TransferModal
        assetId={this.state.selectedAsset}
        onPressDeposit={this.onPressDeposit(this.state.selectedAsset)}
        onPressWithdraw={this.onPressWithdraw(
          selectedAsset.amount || 0,
          this.state.selectedAsset
        )}
        onPressOutside={this.onPressOutsideModal(this.state.selectedAsset)}
      />
    )
  }

  public render () {
    return (
      <ScreenWithCover
        header={this.renderHeader()}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        contentStyle={styles.screenContent}
      >
        <View>
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
                  onPressTranferButton={() =>
                    this.onPressTransferButton(asset.id)
                  }
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
      </ScreenWithCover>
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
  screenContent: {
    paddingHorizontal: 0
  },
  totalValueContainer: {
    color: COLORS.WHITE,
    marginTop: 8
  },
  totalValue: {
    marginLeft: 8
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

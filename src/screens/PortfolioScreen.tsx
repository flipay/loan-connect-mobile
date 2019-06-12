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
  TransferModal,
  ScreenWithCover
} from '../components'
import { COLORS, ASSETS } from '../constants'
import { AssetId, Asset, Balances, MarketPrices } from '../types'
import { hasEverDeposit } from '../asyncStorage'
import { alert, toString } from '../utils'
import { logEvent } from '../analytics'

interface Props {
  balances: Balances
  fetchBalances: () => void
  marketPrices: MarketPrices
  fetchMarketPrices: () => void
}

interface State {
  selectedAsset?: AssetId | null
  refreshing: boolean
  hasDeposited: boolean
  transferModalVisible: boolean
}

export default class PortfolioScreen extends React.Component<
  Props & NavigationScreenProps,
  State
> {
  constructor (props: Props & NavigationScreenProps) {
    super(props)
    this.state = {
      selectedAsset: null,
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
      const [, , hasDeposited] = await Promise.all([
        this.props.fetchMarketPrices(),
        this.props.fetchBalances(),
        hasEverDeposit()
      ])
      this.setState({ hasDeposited })
    } catch (err) {
      alert(err)
    }
  }

  public getSumBalance (assets: Array<Asset>) {
    return _.sumBy(
      assets,
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

  public shouldShowDepositSuggestion (assets: Array<Asset>) {
    return this.getSumBalance(assets) === 0 && !this.state.hasDeposited
  }

  public onPressDepositFromWelcomeMessage = () => {
    logEvent('portfolio/press-deposit-from-welcome-message')
    this.props.navigation.navigate('Deposit')
  }

  public renderDepositSuggestion () {
    return (
      <View style={styles.depositSuggestionSection}>
        <Text type='title' bold={true} color={COLORS.WHITE} style={styles.howMuch}>
          Before you can start trading, please deposit your assets first.
        </Text>
        <Text color={COLORS.WHITE}>
          Available assets are as follows.
        </Text>
      </View>
    )
  }

  public renderHeader (assets: Array<Asset>) {
    return (
      <View>
        {this.shouldShowDepositSuggestion(assets)
          ? this.renderDepositSuggestion()
          : !_.isEmpty(assets) && (
              <View style={styles.headerTextContainer}>
                <Text type='large-title' bold={true} color={COLORS.WHITE}>Portfolio</Text>
                <View style={styles.rightHeader}>
                  <Text type='caption' color={COLORS.P100}>
                    Total value
                  </Text>
                  <Text style={styles.totalValueContainer}>
                    <Text color={COLORS.WHITE}>฿</Text>
                    <Text
                      type='title'
                      style={styles.totalValue}
                      color={COLORS.WHITE}
                    >
                      {` ${toString(this.getSumBalance(assets), ASSETS.THB.decimal)}`}
                    </Text>
                  </Text>
                </View>
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

  public getAssets (balances: Balances, marketPrices: MarketPrices) {
    if (!balances || !marketPrices) { return [] }
    return _(ASSETS)
      .map((asset) => ({
        ...asset,
        ...marketPrices[asset.id],
        amount: balances[asset.id]
      }))
      .sortBy((asset) => asset.order)
      .value()
  }

  public renderTransferModal (assets: Array<Asset>) {
    if (!this.state.transferModalVisible) {
      return null
    }
    if (!this.state.selectedAsset) {
      return null
    }
    const selectedAsset = _.find(
      assets,
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
    const assets = this.getAssets(this.props.balances, this.props.marketPrices)

    return (
      <ScreenWithCover
        header={this.renderHeader(assets)}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        contentStyle={styles.screenContent}
      >
        <View>
          {assets.map((asset: Asset, index: number) => {
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
                  cash={_.get(assets, '[0].amount', 0)}
                  amount={asset.amount || 0}
                  price={asset.price}
                  expanded={expanded}
                  onPress={() => this.onPress(asset.id)}
                  navigation={this.props.navigation}
                  onPressTranferButton={() =>
                    this.onPressTransferButton(asset.id)
                  }
                />
                {index !== assets.length - 1 && (
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rightHeader: {
    alignItems: 'flex-end'
  },
  screenContent: {
    paddingHorizontal: 0
  },
  totalValueContainer: {
    color: COLORS.WHITE
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
  depositSuggestionSection: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: 300
  },
  howMuch: {
    marginBottom: 10
  }
})

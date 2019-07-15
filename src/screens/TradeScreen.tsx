import * as React from 'react'
import _ from 'lodash'
import { StyleSheet, View } from 'react-native'
import Sentry from 'sentry-expo'
import { NavigationScreenProps } from 'react-navigation'
import {
  Text,
  AssetBoxWithBalance,
  AssetBox,
  Screen,
  Link,
  Value
} from '../components'
import { COLORS, ASSETS, THBAmountTypes } from '../constants'
import { AssetId, OrderPart, Balances } from '../types'
import { getAmount, getCompetitorTHBAmounts } from '../requests'
import {
  toNumber,
  toString,
  getErrorCode,
  calSaveAmount
} from '../utils'
import { logEvent } from '../analytics'

type AssetBoxType = OrderPart

interface Props {
  balances: Balances
  fetchBalances: () => void
}

interface State {
  activeAssetBox: AssetBoxType
  giveAssetBoxValue: string
  takeAssetBoxValue: string
  giveAssetBoxWarningMessage?: string
  typing: boolean
  submitPressed: boolean
  lastFetchSuccessfullyGiveAmount?: string
  lastFetchSuccessfullyTakeAmount?: string
  tradeResultGive: number
  tradeResultTake: number
  competitorThbAmounts?: THBAmountTypes
}

export default class TradeScreen extends React.Component<
  Props & NavigationScreenProps,
  State
> {
  private mounted: boolean = false
  private timeout: any
  private interval: any
  public constructor (props: Props & NavigationScreenProps) {
    super(props)
    this.state = {
      activeAssetBox: 'give',
      giveAssetBoxValue: '',
      takeAssetBoxValue: '',
      typing: false,
      submitPressed: false,
      tradeResultGive: 0,
      tradeResultTake: 0
    }
  }

  public async componentDidMount () {
    await this.props.fetchBalances()
  }

  public componentDidUpdate (
    prevProps: Props & NavigationScreenProps,
    prevState: State
  ) {
    this.mounted = true
    if (!prevState.typing && this.state.typing) {
      clearInterval(this.interval)
    } else if (prevState.typing && !this.state.typing) {
      this.getAmount()
      this.interval = setInterval(() => {
        this.getAmount()
      }, 1000)
    }
  }

  public componentWillUnmount () {
    this.mounted = false
    clearInterval(this.interval)
    clearTimeout(this.timeout)
  }

  public handleMinimumAmount (initialAmount: number, flipayResponseAmount: number) {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const minimumThaiAmount = 300
    const thaiAmount = side === 'buy' ? initialAmount : flipayResponseAmount
    const cryptoAmount = side === 'buy' ? flipayResponseAmount : initialAmount
    if (thaiAmount > 0 && thaiAmount < minimumThaiAmount) {
      let minimumAmount
      if (side === 'buy') {
        minimumAmount = `${minimumThaiAmount} THB`
      } else {
        const buffer = 1.05
        const multiplier = minimumThaiAmount / thaiAmount
        const minimumCryptoAmount = multiplier * cryptoAmount * buffer
        minimumAmount = `${toString(minimumCryptoAmount, ASSETS[assetId].decimal)} ${ASSETS[assetId].unit}`
      }
      this.setState({
        giveAssetBoxWarningMessage: `${minimumAmount} is the minimum amount.`
      })
      throw(Error('below_minimum'))
    }
  }

  public disableTrade = () => {
    if (this.mounted) {
      this.setState({
        competitorThbAmounts: undefined,
        lastFetchSuccessfullyGiveAmount: undefined,
        lastFetchSuccessfullyTakeAmount: undefined,
        takeAssetBoxValue: ''
      })
    }
  }

  public getAmount = async () => {
    const activeAssetBox = this.state.activeAssetBox
    const initialValue =
      activeAssetBox === 'give'
        ? this.state.giveAssetBoxValue
        : this.state.takeAssetBoxValue
    const num = toNumber(initialValue)
    let flipayResponseValue = '0'
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    try {
      const amount = await getAmount(
        side,
        assetId,
        activeAssetBox,
        num,
        'liquid'
      )
      const responseAsset = side === 'buy' ? assetId : 'THB'
      flipayResponseValue = toString(amount, ASSETS[responseAsset].decimal)
      const result = await getCompetitorTHBAmounts(
        side,
        assetId,
        side === 'buy'
          ? amount
          : toNumber(this.state.giveAssetBoxValue)
      )

      if (toNumber(flipayResponseValue) === 0) {
        this.disableTrade()
        return
      }

      this.handleMinimumAmount(toNumber(initialValue), toNumber(flipayResponseValue))

      if (this.mounted) {
        this.setState({
          competitorThbAmounts: result,
          lastFetchSuccessfullyGiveAmount: initialValue,
          lastFetchSuccessfullyTakeAmount: flipayResponseValue,
          giveAssetBoxWarningMessage: undefined,
          takeAssetBoxValue: flipayResponseValue
        })
      }
    } catch (err) {
      this.disableTrade()
      if (getErrorCode(err) === 'rate_unavailable') {
        this.setState({
          giveAssetBoxWarningMessage: 'Maximum amount exceeded'
        })
      } else if (err.message !== 'below_minimum') {
        Sentry.captureException(err)
      }
    }
  }

  public onPressAssetBox = (assetBox: AssetBoxType) => {
    logEvent('trade/press-asset-box', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      tradeSide: assetBox
    })
    if (assetBox !== this.state.activeAssetBox) {
      this.setState({
        activeAssetBox: assetBox
      })
    }
  }

  public onChangeValue = async (assetBox: AssetBoxType, value: string) => {
    if (assetBox === 'give') {
      this.setState({
        typing: true,
        giveAssetBoxValue: value
      })
    } else if (assetBox === 'take') {
      this.setState({
        typing: true,
        takeAssetBoxValue: value
      })
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({ typing: false })
    }, 500)
  }

  public onClose = () => {
    logEvent('trade/press-back-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    this.props.navigation.goBack()
  }

  public onPressPriceComparison = () => {
    const cryptoAmount =
      this.props.navigation.getParam('side') === 'buy'
        ? this.state.lastFetchSuccessfullyTakeAmount
        : this.state.lastFetchSuccessfullyGiveAmount
    const flipayAmount =
      this.props.navigation.getParam('side') === 'sell'
        ? this.state.lastFetchSuccessfullyTakeAmount
        : this.state.lastFetchSuccessfullyGiveAmount

    if (!flipayAmount) {
      return null
    }

    logEvent('trade/press-price-comparison-link', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    this.props.navigation.navigate('Comparison', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      competitorAmounts: this.state.competitorThbAmounts,
      flipayAmount: toNumber(flipayAmount),
      cryptoAmount
    })
  }

  public isSubmitable = () => {
    return (
      this.state.giveAssetBoxValue ===
        this.state.lastFetchSuccessfullyGiveAmount &&
      this.state.takeAssetBoxValue ===
        this.state.lastFetchSuccessfullyTakeAmount
    )
  }

  public renderFooter () {
    if (!this.state.lastFetchSuccessfullyGiveAmount || !toNumber(this.state.lastFetchSuccessfullyGiveAmount)) {
      return null
    }
    if (!this.state.lastFetchSuccessfullyTakeAmount || !toNumber(this.state.lastFetchSuccessfullyTakeAmount)) {
      return null
    }

    const side = this.props.navigation.getParam('side', 'buy')
    const saved = calSaveAmount(
      side,
      side === 'buy'
        ? toNumber(this.state.lastFetchSuccessfullyGiveAmount)
        : toNumber(this.state.lastFetchSuccessfullyTakeAmount),
      this.state.competitorThbAmounts
    )
    let countError = 0
    _.map(this.state.competitorThbAmounts, (amount) => {
      if (isNaN(Number(amount))) { countError++ }
    })
    if (countError === _.map(this.state.competitorThbAmounts).length) {
      return (
        <View style={styles.footer}>
          <Text color={COLORS.N500} style={{ textAlign: 'center' }}>
            Flipay is the only provider having this pair and volume.
          </Text>
        </View>
      )
    }
    return (
      <View style={styles.footer}>
        <Text color={COLORS.N500}>
          You save up to
          <Text color={COLORS.N800}>{` ${toString(saved, 2)} THB`}</Text>
        </Text>
        <Link onPress={this.onPressPriceComparison}>See price comparison</Link>
      </View>
    )
  }

  public getGiveAsset () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return side === 'buy' ? 'THB' : assetId
  }

  public renderPrice () {
    return (
      <View style={styles.priceRow}>
        <Text type='caption' color={COLORS.N500}>
          {`Price `}
        </Text>
        <Value assetId='THB' fontType='caption' color={COLORS.N800}>
          {3000}
        </Value>
      </View>
    )
  }

  public renderTradeBody (autoFocus: boolean) {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const remainingBalance = this.props.balances && this.props.balances[side === 'buy' ? 'THB' : assetId]
    const giveSideAssetId = side === 'buy' ? 'THB' : assetId
    return (
      <View style={styles.body}>
        <View style={styles.assetBoxesContainer}>
          <AssetBoxWithBalance
            autoFocus={autoFocus}
            description={side === 'buy' ? 'You buy with' : 'You sell'}
            assetId={giveSideAssetId}
            onPress={() => this.onPressAssetBox('give')}
            onChangeValue={(value: string) => this.onChangeValue('give', value)}
            active={this.state.activeAssetBox === 'give'}
            value={this.state.giveAssetBoxValue}
            onPressMax={() => this.onChangeValue('give', toString(remainingBalance, ASSETS[giveSideAssetId].decimal))}
            onPressHalf={() => this.onChangeValue('give', toString(remainingBalance / 2, ASSETS[giveSideAssetId].decimal))}
            balance={remainingBalance}
            warning={this.state.giveAssetBoxWarningMessage}
          />
          <AssetBox
            description={side === 'sell' ? 'You will receive' : 'You will receive'}
            assetId={side === 'sell' ? 'THB' : assetId}
            value={this.state.takeAssetBoxValue}
          />
          {this.renderPrice()}
        </View>
        {this.renderFooter()}
      </View>
    )
  }

  public goToReview = () => {
    this.props.navigation.navigate('TradeConfirmation', {

    })
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return (
      <Screen
        backButtonType='close'
        title={`${_.capitalize(side)} ${ASSETS[assetId].name}`}
        onPressBackButton={this.onClose}
        submitButtonText='Review'
        activeSubmitButton={this.isSubmitable()}
        onPessSubmitButton={this.goToReview}
      >
        {(autoFocus: boolean) => (
          <View style={styles.bodyContainer}>
            {this.renderTradeBody(autoFocus)}
          </View>
        )}
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1
  },
  body: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center'
  },
  assetBoxesContainer: {
    width: '100%'
  },
  footer: {
    marginTop: 10,
    marginHorizontal: 50,
    alignItems: 'center'
  },
  priceRow: {
    marginTop: 11,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

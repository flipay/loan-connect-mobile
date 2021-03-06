import * as React from 'react'
import _ from 'lodash'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { AntDesign } from '@expo/vector-icons'
import {
  Text,
  AssetBoxWithBalance,
  AssetBox,
  Screen,
  OrderTypeModal,
  SetLimitPriceFullScreenModal,
  PriceSection
} from '../components'
import { COLORS, ASSETS, THBAmountTypes } from '../constants'
import { AssetId, OrderPart, OrderType, Balances } from '../types'
import { getAmount, getCompetitorTHBAmounts } from '../requests'
import { toNumber, toString, getErrorCode, calSaveAmount, calLimitTakeAmount } from '../utils'
import { logEvent } from '../services/Analytic'
import * as ErrorReport from '../services/ErrorReport'

type AssetBoxType = OrderPart

interface Props {
  balances: Balances
  fetchBalances: () => void
  lastFetchSuccessfullyTakeAmount?: string
  competitorThbAmounts?: THBAmountTypes
  setRateData: (a: string, b: THBAmountTypes) => void
  clearRateData: () => void
}

interface State {
  giveAmount: string
  marketTakeAmount: string
  lastFetchSuccessfullyMarketGiveAmount?: string
  giveAssetBoxWarningMessage?: string
  typing: boolean
  submitPressed: boolean
  orderTypeModalVisible: boolean
  orderType: OrderType
  limitPriceModalVisible: boolean
  limitPrice?: number
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
      giveAmount: '',
      marketTakeAmount: '',
      typing: false,
      submitPressed: false,
      orderTypeModalVisible: false,
      orderType: 'market',
      limitPriceModalVisible: false
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
    this.props.clearRateData()
    clearInterval(this.interval)
    clearTimeout(this.timeout)
  }

  public handleMinimumAmount (
    initialAmount: number,
    flipayResponseAmount: number
  ) {
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
        minimumAmount = `${toString(
          minimumCryptoAmount,
          ASSETS[assetId].decimal
        )} ${ASSETS[assetId].unit}`
      }
      this.setState({
        giveAssetBoxWarningMessage: `${minimumAmount} is the minimum amount.`
      })
      throw Error('below_minimum')
    }
  }

  public disableTrade = () => {
    if (this.mounted) {
      this.props.clearRateData()
      this.setState({
        lastFetchSuccessfullyMarketGiveAmount: undefined,
        marketTakeAmount: ''
      })
    }
  }

  public getAmount = async () => {
    const initialValue = this.state.giveAmount
    const num = toNumber(initialValue)
    let flipayResponseValue = '0'
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    try {
      const amount = await getAmount(side, assetId, 'give', num, 'liquid')
      const responseAsset = side === 'buy' ? assetId : 'THB'
      flipayResponseValue = toString(amount, ASSETS[responseAsset].decimal)
      const result = await getCompetitorTHBAmounts(
        side,
        assetId,
        side === 'buy' ? amount : toNumber(this.state.giveAmount)
      )

      if (toNumber(flipayResponseValue) === 0) {
        this.disableTrade()
        return
      }

      this.handleMinimumAmount(
        toNumber(initialValue),
        toNumber(flipayResponseValue)
      )

      if (this.mounted) {
        this.props.setRateData(flipayResponseValue, result)
        this.setState({
          lastFetchSuccessfullyMarketGiveAmount: initialValue,
          giveAssetBoxWarningMessage: undefined,
          marketTakeAmount: flipayResponseValue
        })
      }
    } catch (err) {
      this.disableTrade()
      if (getErrorCode(err) === 'rate_unavailable') {
        this.setState({
          giveAssetBoxWarningMessage: 'Maximum amount exceeded'
        })
      } else if (err.message !== 'below_minimum') {
        ErrorReport.notify(err)
      }
    }
  }

  public onChangeValue = async (assetBox: AssetBoxType, value: string) => {
    if (assetBox === 'give') {
      this.setState({
        typing: true,
        giveAmount: value
      })
    } else if (assetBox === 'take') {
      this.setState({
        typing: true,
        marketTakeAmount: value
      })
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({ typing: false })
    }, 500)
  }

  public onSelectOrderType = (orderType: OrderType) => {
    this.setState({ orderType, orderTypeModalVisible: false })
    if (orderType === 'limit') {
      this.setState({
        limitPriceModalVisible: true
      })
    }
  }

  public toggleOrderTypeModal = () => {
    this.setState({ orderTypeModalVisible: !this.state.orderTypeModalVisible })
  }

  public onSetLimitPrice = (price: number) => {
    this.setState({ limitPrice: price, limitPriceModalVisible: false })
  }

  public toggleLimitPriceModal = () => {
    this.setState({
      limitPriceModalVisible: !this.state.limitPriceModalVisible
    })
  }

  public onClose = () => {
    logEvent('trade/press-back-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    this.props.navigation.navigate('Crypto')
  }

  public onPressEditLimitPrice = () => {
    this.setState({
      limitPriceModalVisible: true
    })
  }

  public throwNoOrderTypeError () {
    throw(Error('unrecognizable order type'))
  }

  public isSubmitable = () => {
    if (this.state.orderType === 'market') {
      return (
        this.state.giveAmount ===
        this.state.lastFetchSuccessfullyMarketGiveAmount &&
        this.state.marketTakeAmount === this.props.lastFetchSuccessfullyTakeAmount
      )
    } else if (this.state.orderType === 'limit') {
      return !!this.state.giveAmount && !!this.state.limitPrice
    } else {
      this.throwNoOrderTypeError()
      return
    }
  }

  public getSavedAmount () {
    if (
      !this.state.lastFetchSuccessfullyMarketGiveAmount ||
      !toNumber(this.state.lastFetchSuccessfullyMarketGiveAmount)
    ) {
      return null
    }
    if (
      !this.props.lastFetchSuccessfullyTakeAmount ||
      !toNumber(this.props.lastFetchSuccessfullyTakeAmount)
    ) {
      return null
    }

    const side = this.props.navigation.getParam('side', 'buy')
    return calSaveAmount(
      side,
      side === 'buy'
        ? toNumber(this.state.lastFetchSuccessfullyMarketGiveAmount)
        : toNumber(this.props.lastFetchSuccessfullyTakeAmount),
      this.props.competitorThbAmounts
    )
  }

  public renderSavedAmount = () => {
    if (this.state.orderType !== 'market') {
      return null
    }
    const saved = this.getSavedAmount()
    if (
      !this.state.lastFetchSuccessfullyMarketGiveAmount &&
      !this.props.lastFetchSuccessfullyTakeAmount
    ) {
      return null
    }
    let countError = 0
    _.map(this.props.competitorThbAmounts, amount => {
      if (isNaN(Number(amount))) {
        countError++
      }
    })
    if (countError === _.map(this.props.competitorThbAmounts).length) {
      return (
        <View style={styles.savedAmount}>
          <Text color={COLORS.N500} style={{ textAlign: 'center' }}>
            Only available at Flipay
          </Text>
        </View>
      )
    }

    if (!saved) {
      return null
    }
    return (
      <Text color={COLORS.G400} style={styles.savedAmount}>
        Save up to
        <Text color={COLORS.G400} bold={true}>{` ${toString(
          saved,
          2
        )} THB `}</Text>
      </Text>
    )
  }

  public getGiveAsset () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return side === 'buy' ? 'THB' : assetId
  }

  public renderPriceSection () {
    let price
    if (this.state.orderType === 'market') {
      const { lastFetchSuccessfullyMarketGiveAmount } = this.state
      const { lastFetchSuccessfullyTakeAmount } = this.props
      if (
        !lastFetchSuccessfullyMarketGiveAmount ||
        !lastFetchSuccessfullyTakeAmount
      ) {
        price = undefined
      } else {
        const amountGive = toNumber(lastFetchSuccessfullyMarketGiveAmount)
        const amountTake = toNumber(lastFetchSuccessfullyTakeAmount)
        const side = this.props.navigation.getParam('side', 'buy')
        price =
          side === 'buy' ? amountGive / amountTake : amountTake / amountGive
      }
    } else {
      price = this.state.limitPrice
    }
    return (
      <PriceSection
        orderType={this.state.orderType}
        price={price}
        renderSavedAmount={this.renderSavedAmount}
        onPressEditLink={this.onPressEditLimitPrice}
      />
    )
  }

  public getTakeAmount () {
    const { orderType } = this.state
    if (orderType === 'market') {
      return this.state.marketTakeAmount
    } else if (orderType === 'limit') {
      const side = this.props.navigation.getParam('side', 'buy')
      const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
      return calLimitTakeAmount(side, assetId, this.state.giveAmount, this.state.limitPrice)
    } else {
      this.throwNoOrderTypeError()
      return
    }
  }

  public renderTradeBody () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const remainingBalance =
      this.props.balances &&
      this.props.balances[side === 'buy' ? 'THB' : assetId]
    const giveSideAssetId = side === 'buy' ? 'THB' : assetId
    return (
      <View style={styles.body}>
        <View style={styles.assetBoxesContainer}>
          <AssetBoxWithBalance
            autoFocus={true}
            description={side === 'buy' ? 'You buy with' : 'You sell'}
            assetId={giveSideAssetId}
            onChangeValue={(value: string) => this.onChangeValue('give', value)}
            value={this.state.giveAmount}
            onPressMax={() =>
              this.onChangeValue(
                'give',
                toString(remainingBalance, ASSETS[giveSideAssetId].decimal)
              )
            }
            onPressHalf={() =>
              this.onChangeValue(
                'give',
                toString(remainingBalance / 2, ASSETS[giveSideAssetId].decimal)
              )
            }
            balance={remainingBalance}
            warning={this.state.giveAssetBoxWarningMessage}
            containerStyle={styles.giveAssetBox}
            errorMessageStyle={styles.errorMessage}
          />
          {this.renderPriceSection()}
          <AssetBox
            description={
              side === 'sell' ? 'You will receive' : 'You will receive'
            }
            assetId={side === 'sell' ? 'THB' : assetId}
            value={this.getTakeAmount()}
          />
        </View>
      </View>
    )
  }

  public goToReview = () => {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const giveAmount = this.state.lastFetchSuccessfullyMarketGiveAmount
    const takeAmount = this.props.lastFetchSuccessfullyTakeAmount

    logEvent('trade/press-review-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      thbAmount: side === 'buy' ? giveAmount : takeAmount,
      cryptoAmount: side === 'sell' ? giveAmount : takeAmount
    })

    this.props.navigation.navigate('TradeConfirmation', {
      side,
      assetId,
      giveAmount,
      orderType: this.state.orderType,
      limitPrice: this.state.limitPrice,
      competitorThbAmounts: this.props.competitorThbAmounts
    })
  }

  public renderHeader = () => {
    const limitOrderEnable = false
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return (
      <View style={styles.header}>
        <Text type='headline'>
          {_.capitalize(side) + ' ' + ASSETS[assetId].name}
        </Text>
        {limitOrderEnable && <TouchableOpacity
          onPress={this.toggleOrderTypeModal}
          style={styles.dropdown}
        >
          <Text color={COLORS.P400} bold={true}>{`Order Typed: ${_.capitalize(
            this.state.orderType
          )} order`}</Text>
          <AntDesign name='down' color={COLORS.P400} style={styles.downIcon} />
        </TouchableOpacity>}
      </View>
    )
  }

  public renderOrderTypeModal () {
    return (
      <OrderTypeModal
        selectedOrderType={this.state.orderType}
        onSelect={this.onSelectOrderType}
        onClose={this.toggleOrderTypeModal}
      />
    )
  }

  public renderLimitPriceModalVisible () {
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const side = this.props.navigation.getParam('side', 'buy')
    return (
      <SetLimitPriceFullScreenModal
        initialPrice={this.state.limitPrice}
        assetId={assetId}
        orderSide={side}
        onSetPrice={this.onSetLimitPrice}
        onClose={this.toggleLimitPriceModal}
      />
    )
  }

  public render () {
    return (
      <Screen
        backButtonType='close'
        header={this.renderHeader}
        noHeaderLine={true}
        onPressBackButton={this.onClose}
        submitButtonText='Review'
        activeSubmitButton={this.isSubmitable()}
        onPessSubmitButton={this.goToReview}
      >
        <View style={styles.bodyContainer}>{this.renderTradeBody()}</View>
        {this.state.orderTypeModalVisible && this.renderOrderTypeModal()}
        {this.state.limitPriceModalVisible &&
          this.renderLimitPriceModalVisible()}
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center'
  },
  dropdown: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  downIcon: {
    marginLeft: 4,
    position: 'relative',
    top: 2
  },
  bodyContainer: {
    flex: 1
  },
  body: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center'
  },
  assetBoxesContainer: {
    width: '100%'
  },
  giveAssetBox: {
    zIndex: 1
  },
  errorMessage: {
    position: 'absolute',
    bottom: -25,
    right: 0
  },
  savedAmount: {
    alignItems: 'center',
    textAlign: 'right'
  }
})

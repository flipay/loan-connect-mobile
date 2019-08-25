import * as React from 'react'
import _ from 'lodash'
import { View, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationScreenProps, StackActions, NavigationActions } from 'react-navigation'
import {
  Text,
  AssetBox,
  TradeResult,
  Screen,
  PriceSection
} from '../components'
import { COLORS, ASSETS, THBAmountTypes } from '../constants'
import { AssetId, Balances } from '../types'
import { executeOrder } from '../requests'
import {
  toNumber,
  toString,
  getErrorCode,
  alert,
  calSaveAmount,
  calLimitTakeAmount
} from '../utils'
import { logEvent } from '../services/Analytic'

interface Props {
  balances: Balances
  lastFetchSuccessfullyTakeAmount: string
  competitorThbAmounts: THBAmountTypes
}

interface State {
  submitPressed: boolean
  executed: boolean
  tradeResultGive: number
  tradeResultTake: number
}

export default class TradeConfirmationScreen extends React.Component<
  Props & NavigationScreenProps,
  State
> {
  private interval: any
  public constructor (props: Props & NavigationScreenProps) {
    super(props)
    this.state = {
      submitPressed: false,
      executed: false,
      tradeResultGive: 0,
      tradeResultTake: 0
    }
  }

  public getThaiBahtAmount () {
    const side = this.props.navigation.getParam('side', 'buy')
    const giveAmount = this.props.navigation.getParam('giveAmount')
    const takeAmount = this.props.lastFetchSuccessfullyTakeAmount
    return side === 'buy' ? toNumber(giveAmount) : toNumber(takeAmount)
  }

  public execute = async () => {
    if (!this.isSubmitable()) { return }
    const side = this.props.navigation.getParam('side')
    const assetId = this.props.navigation.getParam('assetId')
    const orderType = this.props.navigation.getParam('orderType', 'market')

    await this.setState({ submitPressed: true })
    try {
      const {
        amount_give: tradeResultGive,
        amount_take: tradeResultTake
      } = await executeOrder(
        side === 'buy' ? 'THB' : assetId,
        side === 'buy' ? assetId : 'THB',
        toNumber(this.props.navigation.getParam('giveAmount')),
        toNumber(this.getTakeAmount() || '0'),
        orderType
      )

      this.setState({
        executed: true,
        tradeResultGive: Number(tradeResultGive),
        tradeResultTake: Number(tradeResultTake)
      })
      clearInterval(this.interval)
      logEvent('trade-confirmation/press-submit-button', {
        side: this.props.navigation.getParam('side'),
        assetId: this.props.navigation.getParam('assetId'),
        thbAmount: side === 'buy' ? tradeResultGive : tradeResultTake,
        cryptoAmount: side === 'sell' ? tradeResultGive : tradeResultTake
      })

    } catch (err) {
      const code = getErrorCode(err)
      this.setState({ submitPressed: false })
      if (code === 'insufficient_balance') {
        const remainingBalance = this.props.balances && this.props.balances[side === 'buy' ? 'THB' : assetId]
        Alert.alert(
          `The balance is not enough. (remaining ${toString(
            remainingBalance,
            ASSETS[this.getGiveAsset()].decimal
          )} ${ASSETS[this.getGiveAsset()].unit})`
        )
      } else {
        alert(err)
      }
    }
  }

  public onClose = () => {
    logEvent('trade-confirmation/press-back-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    this.props.navigation.goBack()
  }

  public isSubmitable = () => {
    if (this.state.submitPressed && !this.state.executed) { return false }
    return true
  }

  public onPressPriceComparison = () => {
    const cryptoAmount =
      this.props.navigation.getParam('side') === 'buy'
        ? this.props.lastFetchSuccessfullyTakeAmount
        : this.props.navigation.getParam('giveAmount')
    const thbAmount = this.getThaiBahtAmount()

    if (!thbAmount) {
      return null
    }

    logEvent('trade-confirmation/press-price-comparison-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    this.props.navigation.navigate('Comparison', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      competitorAmounts: this.props.competitorThbAmounts,
      flipayAmount: thbAmount,
      cryptoAmount
    })
  }

  public renderFooter () {
    const orderType = this.props.navigation.getParam('orderType')
    if (orderType === 'limit') {
      return null
    }
    const side = this.props.navigation.getParam('side', 'buy')
    const saved = calSaveAmount(
      side,
      side === 'buy'
        ? toNumber(this.props.navigation.getParam('giveAmount'))
        : toNumber(this.props.lastFetchSuccessfullyTakeAmount),
      this.props.competitorThbAmounts
    )
    let countError = 0
    _.map(this.props.competitorThbAmounts, (amount) => {
      if (isNaN(Number(amount))) { countError++ }
    })
    if (countError === _.map(this.props.competitorThbAmounts).length) {
      return (
        <View style={styles.footer}>
          <Text color={COLORS.N500} style={{ textAlign: 'center' }}>
            Flipay is the only provider having this pair and volume.
          </Text>
        </View>
      )
    }
    return (
      <TouchableOpacity style={[styles.footer, styles.savedFooter]} onPress={this.onPressPriceComparison}>
        <Text color={COLORS.N500}>
          You save up to
          <Text color={COLORS.N800}>{` ${toString(saved, 2)} THB`}</Text>
        </Text>
        <Text bold={true} color={COLORS.P400}>See price comparison</Text>
      </TouchableOpacity>
    )
  }

  public isMarketOrder () {
    const orderType = this.props.navigation.getParam('orderType', 'market')
    return orderType === 'market'
  }

  public getGiveAsset () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return side === 'buy' ? 'THB' : assetId
  }

  public pressDone = () => {
    logEvent('trade-result/press-done-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    const resetAction = StackActions.reset({
      index: 0,
      key: 'MarketStack',
      actions: [NavigationActions.navigate({ routeName: 'Market' })]
    })
    this.props.navigation.dispatch(resetAction)
    this.props.navigation.navigate('Portfolio')
  }

  public getTakeAmount () {
    if (this.isMarketOrder()) {
      return this.props.lastFetchSuccessfullyTakeAmount
    } else {
      const limitPrice = this.props.navigation.getParam('limitPrice', 1)
      const side = this.props.navigation.getParam('side', 'buy')
      const giveAmount = this.props.navigation.getParam('giveAmount', 1)
      const assetId = this.props.navigation.getParam('assetId', 'BTC')
      return calLimitTakeAmount(side, assetId, giveAmount, limitPrice)
    }
  }

  public renderPriceSection () {
    const orderType = this.props.navigation.getParam('orderType', 'market')
    let price
    if (this.isMarketOrder()) {
      const { lastFetchSuccessfullyTakeAmount } = this.props
      const giveAmount = this.props.navigation.getParam('giveAmount')
      const amountGive = toNumber(giveAmount)
      const amountTake = toNumber(lastFetchSuccessfullyTakeAmount)
      const side = this.props.navigation.getParam('side', 'buy')
      price = side === 'buy' ? (amountGive / amountTake) : (amountTake / amountGive)
    } else {
      price = this.props.navigation.getParam('limitPrice', 1)
    }
    return (
      <PriceSection
        orderType={orderType}
        price={price}
      />
    )
  }

  public renderConfirmationBody () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const giveSideAssetId = side === 'buy' ? 'THB' : assetId
    const giveAmount = this.props.navigation.getParam('giveAmount')

    return (
      <View style={styles.body}>
        <View style={styles.assetBoxesContainer}>
          <Text>Review</Text>
          <Text type='title' bold={true}>{`${_.capitalize(side)} ${ASSETS[assetId].name}`}</Text>
          <View style={{ height: 18 }} />
          <AssetBox
            description={side === 'buy' ? 'You buy with' : 'You sell'}
            assetId={giveSideAssetId}
            value={giveAmount}
          />
          {this.renderPriceSection()}
          <AssetBox
            description={side === 'sell' ? 'You will receive' : 'You will receive'}
            assetId={side === 'sell' ? 'THB' : assetId}
            value={this.getTakeAmount()}
          />
        </View>
        {this.renderFooter()}
      </View>
    )
  }

  public renderExecutedScreen () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return (
      <TradeResult
        orderSide={side}
        assetId={assetId}
        onPressDone={this.pressDone}
        cryptoAmount={
          side === 'buy'
            ? this.state.tradeResultTake
            : this.state.tradeResultGive
        }
        thbAmount={
          side === 'sell'
            ? this.state.tradeResultTake
            : this.state.tradeResultGive
        }
      />
    )
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'buy')
    return !this.state.executed ? (
      <Screen
        backButtonType='arrowleft'
        gradientSubmitButton={true}
        onPressBackButton={this.onClose}
        submitButtonText={`Confirm to ${_.capitalize(side)}`}
        activeSubmitButton={!this.state.submitPressed}
        onPessSubmitButton={this.execute}
        fullScreenLoading={this.state.submitPressed}
      >
        <View style={styles.bodyContainer}>
          {this.renderConfirmationBody()}
        </View>
      </Screen>
    ) : this.renderExecutedScreen()
  }
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1
  },
  body: {
    alignItems: 'center'
  },
  assetBoxesContainer: {
    width: '100%'
  },
  footer: {
    marginTop: 20,
    marginHorizontal: 50,
    alignItems: 'center'
  },
  savedFooter: {
    width: '100%',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.P400,
    borderRadius: 6
  },
  priceRow: {
    marginTop: 11,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

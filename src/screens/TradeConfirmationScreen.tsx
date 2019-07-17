import * as React from 'react'
import _ from 'lodash'
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native'
import { NavigationScreenProps, StackActions, NavigationActions } from 'react-navigation'
import {
  Text,
  AssetBox,
  TradeResult,
  Screen,
  Value
} from '../components'
import { COLORS, ASSETS, THBAmountTypes } from '../constants'
import { AssetId, Balances } from '../types'
import { getAmount, order, getCompetitorTHBAmounts } from '../requests'
import {
  toNumber,
  toString,
  getErrorCode,
  alert,
  calSaveAmount
} from '../utils'
import { logEvent } from '../analytics'

interface Props {
  balances: Balances
}

interface State {
  submitPressed: boolean
  executed: boolean
  takeAmount: string
  competitorThbAmounts?: THBAmountTypes
  tradeResultGive: number
  tradeResultTake: number
}

export default class TradeConfirmationScreen extends React.Component<
  Props & NavigationScreenProps,
  State
> {
  private mounted: boolean = false
  private interval: any
  public constructor (props: Props & NavigationScreenProps) {
    super(props)
    this.state = {
      submitPressed: false,
      executed: false,
      takeAmount: props.navigation.getParam('takeAmount'),
      competitorThbAmounts: props.navigation.getParam('competitorThbAmounts'),
      tradeResultGive: 0,
      tradeResultTake: 0
    }
  }

  public componentDidMount () {
    this.mounted = true
    this.interval = setInterval(() => {
      this.getAmount()
    }, 1000)
  }

  public componentWillUnmount () {
    this.mounted = false
    clearInterval(this.interval)
  }

  public getThaiBahtAmount () {
    const side = this.props.navigation.getParam('side', 'buy')
    const giveAmount = this.props.navigation.getParam('giveAmount')
    const takeAmount = this.state.takeAmount
    return side === 'buy' ? toNumber(giveAmount) : toNumber(takeAmount)
  }

  public getAmount = async () => {
    const giveAmount = this.props.navigation.getParam('giveAmount')
    const initialValue = giveAmount
    const num = toNumber(initialValue)
    let flipayResponseValue = '0'
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const amount = await getAmount(
      side,
      assetId,
      'give',
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
        : toNumber(giveAmount)
    )

    if (this.mounted) {
      this.setState({
        competitorThbAmounts: result,
        takeAmount: flipayResponseValue
      })
    }
  }

  public execute = async () => {
    if (!this.isSubmitable()) { return }
    const side = this.props.navigation.getParam('side')
    const assetId = this.props.navigation.getParam('assetId')

    await this.setState({ submitPressed: true })
    try {
      const {
        amount_give: tradeResultGive,
        amount_take: tradeResultTake
      } = await order(
        side === 'buy' ? 'THB' : assetId,
        side === 'buy' ? assetId : 'THB',
        toNumber(this.props.navigation.getParam('giveAmount')),
        toNumber(this.state.takeAmount || '0')
      )
      this.setState({
        executed: true,
        tradeResultGive: Number(tradeResultGive),
        tradeResultTake: Number(tradeResultTake)
      })

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
        ? this.state.takeAmount
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
      competitorAmounts: this.state.competitorThbAmounts,
      flipayAmount: thbAmount,
      cryptoAmount
    })
  }

  public renderFooter () {
    const side = this.props.navigation.getParam('side', 'buy')
    const saved = calSaveAmount(
      side,
      side === 'buy'
        ? toNumber(this.props.navigation.getParam('giveAmount'))
        : toNumber(this.state.takeAmount),
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
      <TouchableOpacity style={[styles.footer, styles.savedFooter]} onPress={this.onPressPriceComparison}>
        <Text color={COLORS.N500}>
          You save up to
          <Text color={COLORS.N800}>{` ${toString(saved, 2)} THB`}</Text>
        </Text>
        <Text bold={true} color={COLORS.P400}>See price comparison</Text>
      </TouchableOpacity>
    )
  }

  public renderPrice () {
    const { takeAmount } = this.state
    const giveAmount = this.props.navigation.getParam('giveAmount')
    const amountGive = toNumber(giveAmount)
    const amountTake = toNumber(takeAmount)
    const side = this.props.navigation.getParam('side', 'buy')
    const price = side === 'buy' ? (amountGive / amountTake) : (amountTake / amountGive)
    return (
      <View style={styles.priceRow}>
        <Text type='caption' color={COLORS.N500}>
          {`Price `}
        </Text>
        <Value assetId='THB' fontType='caption' color={COLORS.N800}>
          {price}
        </Value>
      </View>
    )
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

  public renderConfirmationBody () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const giveSideAssetId = side === 'buy' ? 'THB' : assetId
    const giveAmount = this.props.navigation.getParam('giveAmount')

    return (
      <View style={styles.body}>
        <View style={styles.assetBoxesContainer}>
          <Text type='title' bold={true}>Ready to buy Bitcoin?</Text>
          <View style={{ height: 27 }} />
          <AssetBox
            description={side === 'buy' ? 'You buy with' : 'You sell'}
            assetId={giveSideAssetId}
            value={giveAmount}
          />
          <View style={{ height: 8 }} />
          <AssetBox
            description={side === 'sell' ? 'You will receive' : 'You will receive'}
            assetId={side === 'sell' ? 'THB' : assetId}
            value={this.state.takeAmount}
          />
          {this.renderPrice()}
        </View>
        {this.renderFooter()}
      </View>
    )
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return (
      <Screen
        backButtonType='arrowleft'
        gradientSubmitButton={true}
        onPressBackButton={this.state.executed ? undefined : this.onClose}
        submitButtonText={this.state.executed ? 'Done' : `Confirm to ${_.capitalize(side)}`}
        activeSubmitButton={this.isSubmitable()}
        onPessSubmitButton={this.state.executed ? this.pressDone : this.execute}
      >
        {() => (
          <View style={styles.bodyContainer}>
            {this.state.executed ? (
              <TradeResult
                orderType={side}
                assetId={assetId}
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
            ) : (
              this.renderConfirmationBody()
            )}
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

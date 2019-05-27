import * as React from 'react'
import _ from 'lodash'
import { StyleSheet, View, Alert } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import {
  Text,
  AssetBoxWithBalance,
  AssetBoxTemp,
  TradeResult,
  ScreenWithKeyboard,
  Link
} from '../components'
import { COLORS, ASSETS, THBAmountTypes } from '../constants'
import { AssetId, OrderPart } from '../types'
import { getAmount, order, getCompetitorTHBAmounts } from '../requests'
import {
  toNumber,
  toString,
  getErrorCode,
  alert,
  calSaveAmount
} from '../utils'
import { logEvent } from '../analytics'

type AssetBoxType = OrderPart

interface State {
  activeAssetBox: AssetBoxType
  giveAssetBoxValue: string
  takeAssetBoxValue: string
  giveAssetBoxErrorMessage: string
  typing: boolean
  loading: boolean
  lastFetchSuccessfullyGiveAmount?: string
  lastFetchSuccessfullyTakeAmount?: string
  executed: boolean
  tradeResultGive: number
  tradeResultTake: number
  competitorThbAmounts?: THBAmountTypes
}

export default class TradeScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private mounted: boolean = false
  private timeout: any
  private interval: any
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      activeAssetBox: 'give',
      giveAssetBoxValue: '',
      takeAssetBoxValue: '',
      giveAssetBoxErrorMessage: '',
      typing: false,
      loading: false,
      executed: false,
      tradeResultGive: 0,
      tradeResultTake: 0
    }
  }

  public componentDidUpdate (
    prevProps: NavigationScreenProps,
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
        this.props.navigation.getParam('side', 'buy'),
        this.props.navigation.getParam('assetId', 'BTC'),
        this.props.navigation.getParam('side', 'buy') === 'buy'
          ? amount
          : toNumber(this.state.giveAssetBoxValue)
      )
      if (this.mounted) {
        this.setState({
          competitorThbAmounts: result,
          lastFetchSuccessfullyGiveAmount: initialValue,
          lastFetchSuccessfullyTakeAmount: flipayResponseValue,
          giveAssetBoxErrorMessage: '',
          takeAssetBoxValue: flipayResponseValue,
          loading: false
        })
      }
    } catch (err) {
      if (getErrorCode(err) === 'rate_unavailable') {
        this.setState({
          competitorThbAmounts: undefined,
          lastFetchSuccessfullyGiveAmount: initialValue,
          lastFetchSuccessfullyTakeAmount: undefined,
          giveAssetBoxErrorMessage: 'Maximum amount exceeded',
          takeAssetBoxValue: '',
          loading: false
        })
      } else {
        throw(err)
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

  public execute = async () => {
    const side = this.props.navigation.getParam('side')
    const assetId = this.props.navigation.getParam('assetId')
    logEvent('trade/press-submit-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    try {
      const {
        amount_give: tradeResultGive,
        amount_take: tradeResultTake
      } = await order(
        side === 'buy' ? 'THB' : assetId,
        side === 'buy' ? assetId : 'THB',
        toNumber(this.state.giveAssetBoxValue),
        toNumber(this.state.takeAssetBoxValue)
      )
      this.setState({
        executed: true,
        tradeResultGive: Number(tradeResultGive),
        tradeResultTake: Number(tradeResultTake)
      })
    } catch (err) {
      const code = getErrorCode(err)
      if (code === 'insufficient_balance') {
        const remainingBalance = this.props.navigation.getParam(
          'remainingBalance',
          0
        )
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

  public renderTradeBody (autoFocus: boolean) {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const remainingBalance = this.props.navigation.getParam(
      'remainingBalance',
      0
    )

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
            error={this.state.giveAssetBoxErrorMessage}
          />
          <AssetBoxTemp
            description={
              side === 'sell' ? 'You will receive' : 'You will receive'
            }
            assetId={side === 'sell' ? 'THB' : assetId}
            // onPress={() => this.onPressAssetBox('take')}
            // onChangeValue={(value: string) => this.onChangeValue('take', value)}
            // active={this.state.activeAssetBox === 'take'}
            value={this.state.takeAssetBoxValue}
          />
        </View>
        {this.renderFooter()}
      </View>
    )
  }

  public pressDone = () => {
    logEvent('trade-result/press-done-button', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId')
    })
    this.props.navigation.goBack()
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    return (
      <ScreenWithKeyboard
        backButtonType='close'
        title={!this.state.executed ? `${_.capitalize(side)} ${ASSETS[assetId].name}` : undefined}
        onPressBackButton={this.state.executed ? undefined : this.onClose}
        submitButtonText={
          this.state.executed ? 'Done' : _.capitalize(side)
        }
        activeSubmitButton={this.isSubmitable()}
        onPessSubmitButton={this.state.executed ? this.pressDone : this.execute}
      >
        {autoFocus => (
          <View style={styles.bodyContainer}>
            {this.state.executed ? (
              <TradeResult
                orderType={side}
                assetId={this.props.navigation.getParam('assetId', 'BTC')}
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
              this.renderTradeBody(autoFocus)
            )}
          </View>
        )}
      </ScreenWithKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1
  },
  body: {
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
  }
})

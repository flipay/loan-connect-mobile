import * as React from 'react'
import _ from 'lodash'
import { StyleSheet, View, Alert } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import {
  Text,
  Value,
  AssetBox,
  AssetBoxTemp,
  TradeResult,
  ScreenWithKeyboard,
  Link
} from '../components'
import { COLORS, ASSETS } from '../constants'
import { AssetId, OrderPart } from '../types'
import { getAmount, order } from '../requests'
import { toNumber, toString, getErrorCode, alert } from '../utils'
import { Amplitude } from 'expo'

type AssetBoxType = OrderPart

interface State {
  activeAssetBox: AssetBoxType
  giveAssetBoxValue: string
  takeAssetBoxValue: string
  typing: boolean
  loading: boolean
  executed: boolean
  resultGive: number
  resultTake: number
}

export default class TradeScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private timeout: any
  private interval: any
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      activeAssetBox: 'give',
      giveAssetBoxValue: '',
      takeAssetBoxValue: '',
      typing: false,
      loading: false,
      executed: false,
      resultGive: 0,
      resultTake: 0
    }
  }

  public componentDidUpdate (
    prevProps: NavigationScreenProps,
    prevState: State
  ) {
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
    clearInterval(this.interval)
  }

  public getAmount = async () => {
    const activeAssetBox = this.state.activeAssetBox
    const value = activeAssetBox === 'give'
      ? this.state.giveAssetBoxValue
      : this.state.takeAssetBoxValue
    const num = toNumber(value)
    let valueInString = '0'
    if (num > 0) {
      const response = await getAmount(
        this.props.navigation.getParam('side', 'buy'),
        this.props.navigation.getParam('assetId', 'BTC'),
        activeAssetBox,
        num,
        'liquid'
      )
      const { data } = response
      const resultAssetBox = activeAssetBox === 'give' ? 'take' : 'give'
      const amount = data.data[`amount_${resultAssetBox}`]
      const assetId: AssetId = data.data[`asset_${resultAssetBox}`]
      valueInString = toString(amount, ASSETS[assetId].decimal)
    }
    if (activeAssetBox === 'give') {
      this.setState({
        takeAssetBoxValue: valueInString,
        loading: false
      })
    } else {
      this.setState({
        giveAssetBoxValue: valueInString,
        loading: false
      })
    }
  }

  public logEvent = (eventName: string, params?: object) => {
    Amplitude.logEventWithProperties(`trade/${eventName}`, {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      ...(params || {})
    })
  }

  public onPressAssetBox = (assetBox: AssetBoxType) => {
    this.logEvent('press-trade-box', { tradeSide: assetBox })
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
    this.logEvent('preee-submit-button')
    try {
      const { amount_give: resultGive, amount_take: resultTake } = await order(
        side === 'buy' ? 'THB' : assetId,
        side === 'buy' ? assetId : 'THB',
        toNumber(this.state.giveAssetBoxValue),
        toNumber(this.state.takeAssetBoxValue)
      )
      this.setState({
        executed: true,
        resultGive: Number(resultGive),
        resultTake: Number(resultTake)
      })
    } catch (err) {
      const code = getErrorCode(err)
      if (code === 'insufficient_amount') {
        Alert.alert(`You don't have enough fund.`)
      } else {
        alert(err)
      }
    }
  }

  public onClose = () => {
    this.logEvent('press-back-button')
    this.props.navigation.goBack()
  }

  public onPressPriceComparison = () => {
    this.logEvent('press-price-comparison-link')
    this.props.navigation.navigate('Comparison', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      cryptoAmount:
        this.props.navigation.getParam('side') === 'buy'
          ? this.state.takeAssetBoxValue
          : this.state.giveAssetBoxValue
    })
  }

  public isSubmitable = () => {
    return (
      this.state.giveAssetBoxValue !== '' && this.state.takeAssetBoxValue !== ''
    )
  }

  public renderFooter () {
    const side = this.props.navigation.getParam('side', 'buy')
    return (
      this.isSubmitable() && (
        <View style={styles.footer}>
          <Text color={COLORS.N500}>
            {side === 'buy' ? 'You save up to ' : 'You earn up to '}
            <Text color={COLORS.N800}>500 THB</Text>
            {side === 'buy' ? '' : ' more'}
          </Text>
          <Link onPress={this.onPressPriceComparison}>
            See price comparison
          </Link>
        </View>
      )
    )
  }

  public renderTradeBody (autoFocus: boolean) {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const remainingBalance = this.props.navigation.getParam(
      'remainingBalance',
      0
    )
    return (
      <View style={styles.body}>
        <Text type='title'>
          {`${_.capitalize(side)} ${ASSETS[assetId].name}`}
        </Text>
        <Text type='body' color={COLORS.N500}>
          <Value assetId={side === 'buy' ? 'THB' : assetId}>
            {remainingBalance}
          </Value>
          {` available`}
        </Text>
        <View style={styles.assetBoxesContainer}>
          <AssetBox
            autoFocus={autoFocus}
            description={side === 'buy' ? 'You buy with' : 'You sell'}
            assetId={side === 'buy' ? 'THB' : assetId}
            onPress={() => this.onPressAssetBox('give')}
            onChangeValue={(value: string) => this.onChangeValue('give', value)}
            active={this.state.activeAssetBox === 'give'}
            value={this.state.giveAssetBoxValue}
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
        {/* {this.renderFooter()} */}
      </View>
    )
  }

  public pressDone = () => {
    this.logEvent('press-done-button')
    this.props.navigation.goBack()
  }

  public render () {
    const orderType = this.props.navigation.getParam('side', 'buy')
    return (
      <ScreenWithKeyboard
        backButtonType='close'
        onPressBackButton={this.state.executed ? undefined : this.onClose}
        submitButtonText={this.state.executed ? 'Done' : _.capitalize(orderType)}
        activeSubmitButton={this.isSubmitable()}
        onPessSubmitButton={this.state.executed ? this.pressDone : this.execute}
      >
        {autoFocus => (
          <View style={styles.bodyContainer}>
            {this.state.executed ? (
              <TradeResult
                orderType={orderType}
                assetId={this.props.navigation.getParam('assetId', 'BTC')}
                cryptoAmount={orderType === 'buy' ? this.state.resultTake : this.state.resultGive}
                thbAmount={orderType === 'sell' ? this.state.resultTake : this.state.resultGive}
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
    paddingTop: 10,
    alignItems: 'center'
  },
  assetBoxesContainer: {
    marginTop: 20,
    width: '100%'
  },
  footer: {
    alignItems: 'center'
  }
})

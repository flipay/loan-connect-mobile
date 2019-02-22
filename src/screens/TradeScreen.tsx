import * as React from 'react'
import _ from 'lodash'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import {
  Text,
  Value,
  TradeBox,
  TradeResult,
  ScreenWithKeyboard,
  Link
} from '../components'
import { COLORS, ASSETS } from '../constants'
import { AssetId, OrderPart } from '../types'
import { getAmount } from '../requests'

type TradeBoxType = OrderPart

interface State {
  activeTradeBox: TradeBoxType
  giveTradeBoxValue: string
  takeTradeBoxValue: string
  typing: boolean
  loading: boolean
  executed: boolean
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
      activeTradeBox: 'give',
      giveTradeBoxValue: '',
      takeTradeBoxValue: '',
      typing: false,
      loading: false,
      executed: false
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

  public getAmount = async () => {
    const tradeBox = this.state.activeTradeBox
    const value = this.state.activeTradeBox === 'give'
      ? this.state.giveTradeBoxValue
      : this.state.takeTradeBoxValue
    const amount = await getAmount(
      this.props.navigation.getParam('side', 'buy'),
      this.props.navigation.getParam('assetId', 'BTC'),
      tradeBox,
      this.toNumber(value)
    )

    const valueInString = amount.toLocaleString(undefined, {
      maximumFractionDigits: 8
    })

    if (tradeBox === 'give') {
      this.setState({
        takeTradeBoxValue: valueInString,
        loading: false
      })
    } else {
      this.setState({
        giveTradeBoxValue: valueInString,
        loading: false
      })
    }
  }

  public onPressTradeBox = (tradeBox: TradeBoxType) => {
    if (tradeBox !== this.state.activeTradeBox) {
      this.setState({
        activeTradeBox: tradeBox
      })
    }
  }

  public toNumber (value: string) {
    const valueInStringWithoutComma = _.replace(value, /,/g, '')
    return Number(valueInStringWithoutComma)
  }

  public formatNumberInString (valueInString: string) {
    let haveDot = false
    let endingZero = 0
    const valueInNumber = this.toNumber(valueInString)
    if (valueInString === '.') {
      valueInString = '0.'
    } else if (valueInString !== '') {
      const { length } = valueInString
      if (valueInString[length - 1] === '.') {
        haveDot = true
      } else if (
        _.includes(valueInString, '.') &&
        valueInString[length - 1] === '0'
      ) {
        const valueWithoutZero = _.trimEnd(valueInString, '0')
        if (valueWithoutZero[valueWithoutZero.length - 1] === '.') {
          haveDot = true
        }
        endingZero = length - _.trimEnd(valueInString, '0').length
      }
      valueInString = valueInNumber.toLocaleString(undefined, {
        maximumFractionDigits: 8
      })
      if (haveDot) {
        valueInString += '.'
      }
      if (endingZero > 0) {
        for (let i = 0; i < endingZero; i++) {
          valueInString += '0'
        }
      }
    }
    return valueInString
  }

  public onChangeValue = async (tradeBox: TradeBoxType, value: string) => {
    const formattedNumberInString = this.formatNumberInString(value)
    if (tradeBox === 'give') {
      this.setState({
        typing: true,
        giveTradeBoxValue: formattedNumberInString
      })
    } else if (tradeBox === 'take') {
      this.setState({
        typing: true,
        takeTradeBoxValue: formattedNumberInString
      })
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({ typing: false })
    }, 500)
  }

  public execute = () => {
    this.setState({ executed: true })
  }

  public onClose = () => {
    this.props.navigation.goBack()
  }

  public onPressPriceComparison = () => {
    this.props.navigation.navigate('Comparison', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      amount:
        this.props.navigation.getParam('side') === 'buy'
          ? this.state.takeTradeBoxValue
          : this.state.giveTradeBoxValue
    })
  }

  public isSubmitable = () => {
    return (
      this.state.giveTradeBoxValue !== '' && this.state.takeTradeBoxValue !== ''
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
          <Value assetId={assetId}>{remainingBalance}</Value>
          {` available`}
        </Text>
        <View style={styles.tradeBoxesContainer}>
          <TradeBox
            autoFocus={autoFocus}
            description={side === 'buy' ? 'You buy with' : 'You sell'}
            assetId={side === 'buy' ? 'THB' : assetId}
            onPress={() => this.onPressTradeBox('give')}
            onChangeValue={(value: string) => this.onChangeValue('give', value)}
            active={this.state.activeTradeBox === 'give'}
            value={this.state.giveTradeBoxValue}
          />
          <TradeBox
            description={
              side === 'sell' ? 'You will receive' : 'You will receive'
            }
            assetId={side === 'sell' ? 'THB' : assetId}
            onPress={() => this.onPressTradeBox('take')}
            onChangeValue={(value: string) => this.onChangeValue('take', value)}
            active={this.state.activeTradeBox === 'take'}
            value={this.state.takeTradeBoxValue}
          />
        </View>
        {this.renderFooter()}
      </View>
    )
  }

  public pressDone = () => {
    this.props.navigation.goBack()
  }

  public render () {
    const orderType = _.capitalize(
      this.props.navigation.getParam('side', 'buy')
    )
    return (
      <ScreenWithKeyboard
        backButtonType='close'
        onPressBackButton={this.state.executed ? undefined : this.onClose}
        submitButtonText={this.state.executed ? 'Done' : orderType}
        activeSubmitButton={this.isSubmitable()}
        onPessSubmitButton={this.state.executed ? this.pressDone : this.execute}
      >
        {autoFocus => (
          <View style={styles.bodyContainer}>
            {this.state.executed ? (
              <TradeResult assetId='BTC' amount={0.0099} price={950} fee={50} />
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
  tradeBoxesContainer: {
    marginTop: 20,
    width: '100%'
  },
  footer: {
    alignItems: 'center'
  }
})

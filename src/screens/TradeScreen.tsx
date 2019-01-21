import * as React from 'react'
import * as _ from 'lodash'
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableHighlight,
  StatusBar,
  Keyboard,
  Platform
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Constants } from 'expo'
import { Text, Value, TradeBox, CloseButton } from '../components'
import { COLORS, ASSETS } from '../constants'
import { AssetId, OrderPart } from '../types'
import { getAmount } from '../requests'

type TradeBoxType = OrderPart

interface State {
  keyboardAvoidingViewKey: string
  activeTradeBox: TradeBoxType
  giveTradeBoxValue: string
  takeTradeBoxValue: string
  loading: boolean
}

const DEFAULT_KEYBOARD_KEY = 'keyboardAvoidingViewKey'

export default class TradeScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private keyboardHideListener: any
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      keyboardAvoidingViewKey: DEFAULT_KEYBOARD_KEY,
      activeTradeBox: 'give',
      giveTradeBoxValue: '',
      takeTradeBoxValue: '',
      loading: false
    }
  }

  public componentDidMount () {
    // using keyboardWillHide is better but it does not work for android
    this.keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      this.handleKeyboardHide.bind(this)
    )
  }

  public componentWillUnmount () {
    this.keyboardHideListener.remove()
  }

  public handleKeyboardHide () {
    this.setState({
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey' + new Date().getTime()
    })
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
        giveTradeBoxValue: formattedNumberInString,
        loading: true
      })
    } else {
      this.setState({
        takeTradeBoxValue: formattedNumberInString,
        loading: true
      })
    }

    // const amount = await getAmount(
    //   this.props.navigation.getParam('side', 'buy'),
    //   this.props.navigation.getParam('assetId', 'BTC'),
    //   tradeBox,
    //   this.toNumber(value)
    // )

    // const valueInString = amount.toLocaleString(
    //   undefined,
    //   { maximumFractionDigits: 8 }
    // )

    // if (tradeBox === 'give') {
    //   this.setState({
    //     takeTradeBoxValue: valueInString,
    //     loading: false
    //   })
    // } else {
    //   this.setState({
    //     giveTradeBoxValue: valueInString,
    //     loading: false
    //   })
    // }
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

  public onPressSubmit = () => {
    console.log('press submit')
  }

  public isSubmitable = () => {
    return (
      this.state.giveTradeBoxValue !== '' && this.state.takeTradeBoxValue !== ''
    )
  }

  public renderSubmitButton () {
    const content = (
      <Text type='button' color={COLORS.WHITE}>
        {_.capitalize(this.props.navigation.getParam('side', 'buy'))}
      </Text>
    )
    return (
      <TouchableHighlight
        style={[
          styles.submitButton,
          !this.isSubmitable() && styles.inactiveSubmitButton
        ]}
        onPress={this.isSubmitable() ? this.onPressSubmit : undefined}
      >
        {content}
      </TouchableHighlight>
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
          <TouchableHighlight onPress={this.onPressPriceComparison}>
            <Text color={COLORS.P400}>See price comparison</Text>
          </TouchableHighlight>
        </View>
      )
    )
  }

  public renderBody () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const remainingBalance = this.props.navigation.getParam(
      'remainingBalance',
      0
    )
    return (
      <View style={styles.bodyContainer}>
        <CloseButton onPress={this.onClose} />
        <Text type='title'>
          {`${_.capitalize(side)} ${ASSETS[assetId].name}`}
        </Text>
        <Text type='body' color={COLORS.N500}>
          <Value asset={assetId}>{remainingBalance}</Value>
          {` available`}
        </Text>
        <View style={styles.tradeBoxesContainer}>
          <TradeBox
            autoFocus={
              this.state.keyboardAvoidingViewKey === DEFAULT_KEYBOARD_KEY
            }
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

  public render () {
    return (
      <KeyboardAvoidingView
        key={this.state.keyboardAvoidingViewKey}
        style={styles.outsideContainer}
        keyboardVerticalOffset={Constants.statusBarHeight === 40 ? 20 : 0}
        behavior='height'
      >
        <TouchableWithoutFeedback
          style={styles.outsideContainer}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View style={styles.container}>
            <StatusBar barStyle='dark-content' />
            {this.renderBody()}
            {this.renderSubmitButton()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  outsideContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative'
  },
  bodyContainer: {
    paddingTop: 50,
    alignItems: 'center'
  },
  tradeBoxesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%'
  },
  footer: {
    alignItems: 'center'
  },
  submitButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.P400
  },
  inactiveSubmitButton: {
    opacity: 0.35
  }
})

import * as React from 'react'
import * as _ from 'lodash'
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableHighlight,
  StatusBar
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Constants } from 'expo'
import { Text, Value, TradeBox, CloseButton } from '../components'
import { COLORS } from '../constants/styleGuides'
import { ASSETS, AssetId } from '../constants/assets'

type TradeBoxType = 'give' | 'take'

interface State {
  activeTradeBox: TradeBoxType
  giveTradeBoxValue: string
  takeTradeBoxValue: string
}

export default class TradeScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      activeTradeBox: 'give',
      giveTradeBoxValue: '',
      takeTradeBoxValue: ''
    }
  }

  public onPressTradeBox = (tradeBox: TradeBoxType) => {
    if (tradeBox !== this.state.activeTradeBox) {
      this.setState({
        activeTradeBox: tradeBox
      })
    }
  }

  public onChangeValue = (tradeBox: TradeBoxType, value: string) => {
    let valueInString = value
    let haveDot = false
    let endingZero = 0

    if (value === '.') {
      valueInString = '0.'
    } else if (value !== '') {
      const valueInStringWithoutComma = _.replace(value, /,/g, '')
      const { length } = valueInStringWithoutComma
      if (valueInStringWithoutComma[length - 1] === '.') {
        haveDot = true
      } else if (
        _.includes(valueInStringWithoutComma, '.') &&
        valueInStringWithoutComma[length - 1] === '0'
      ) {
        const valueWithoutZero = _.trimEnd(valueInStringWithoutComma, '0')
        if (valueWithoutZero[valueWithoutZero.length - 1] === '.') {
          haveDot = true
        }
        endingZero = length - _.trimEnd(valueInStringWithoutComma, '0').length
      }
      valueInString = Number(valueInStringWithoutComma).toLocaleString(
        undefined,
        { maximumFractionDigits: 8 }
      )
      if (haveDot) {
        valueInString += '.'
      }
      if (endingZero > 0) {
        for (let i = 0; i < endingZero; i++) {
          valueInString += '0'
        }
      }
    }
    if (tradeBox === 'give') {
      this.setState({ giveTradeBoxValue: valueInString })
    } else {
      this.setState({ takeTradeBoxValue: valueInString })
    }
  }

  public onClose = () => {
    this.props.navigation.goBack()
  }

  public onPressPriceComparison = () => {
    this.props.navigation.navigate('Comparison', {
      side: this.props.navigation.getParam('side'),
      assetId: this.props.navigation.getParam('assetId'),
      amount: this.state.currentTradeBoxValue
    })
  }

  public onPressSubmit = () => {
    console.log('press submit')
  }

  public isSubmitable = () => {
    return this.state.currentTradeBoxValue !== ''
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
    const remainingBalance = this.props.navigation.getParam('remainingBalance', 0)
    return (
      <View style={styles.bodyContainer}>
        <CloseButton
          onPress={this.onClose}
        />
        <Text type='title'>
          {`${_.capitalize(side)} ${ASSETS[assetId].name}`}
        </Text>
        <Text type='body' color={COLORS.N500}>
          <Value asset={assetId}>{remainingBalance}</Value>
          {` available`}
        </Text>
        <View style={styles.tradeBoxesContainer}>
          <TradeBox
            autoFocus={true}
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
        style={styles.container}
        keyboardVerticalOffset={Constants.statusBarHeight === 40 ? 20 : 0}
        behavior='height'
      >
        <StatusBar barStyle='dark-content' />
        {this.renderBody()}
        {this.renderSubmitButton()}
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
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

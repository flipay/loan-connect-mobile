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
import { AntDesign } from '@expo/vector-icons'
import { Text, TradeBox } from '../components'
import { COLORS } from '../constants/styleGuides'
import { ASSETS } from '../constants/assets'

interface State {
  activeTradeBoxIndex: number
  currentTradeBoxValue: string
}

export default class TradeScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      activeTradeBoxIndex: 0,
      currentTradeBoxValue: ''
    }
  }

  public calculateValue = () => {
    if (this.state.currentTradeBoxValue === '') {
      return ''
    } else {
      const calculatedNumber = 1000
      return calculatedNumber.toLocaleString()
    }
  }

  public onPressTradeBox = (tradeBoxIndex: number) => {
    if (tradeBoxIndex !== this.state.activeTradeBoxIndex) {
      this.setState({
        activeTradeBoxIndex: tradeBoxIndex,
        currentTradeBoxValue: ''
      })
    }
  }

  public onChangeValue = (value: string) => {
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
    this.setState({ currentTradeBoxValue: valueInString })
  }

  public onClose = () => {
    this.props.navigation.goBack()
  }

  public onPressPriceComparison = () => {
    console.log('onPress Price comparison')
  }

  public onPressSubmit = () => {
    console.log('press submit')
  }

  public isSubmitable = () => {
    return this.state.currentTradeBoxValue !== ''
  }

  public renderCloseButton () {
    return (
      <TouchableHighlight style={styles.closeButton} onPress={this.onClose}>
        <AntDesign name='close' size={32} />
      </TouchableHighlight>
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
    const assetId = this.props.navigation.getParam('assetId', 'bitcoin')
    return (
      <View style={styles.bodyContainer}>
        {this.renderCloseButton()}
        <Text type='title'>
          {`${_.capitalize(side)} ${ASSETS[assetId].name}`}
        </Text>
        <Text type='body' color={COLORS.N500}>
          3,000 THB available
        </Text>
        <View style={styles.tradeBoxesContainer}>
          <TradeBox
            // autoFocus={true}
            description={side === 'buy' ? 'You buy with' : 'You sell'}
            assetId={side === 'buy' ? 'cash' : assetId}
            onPress={() => this.onPressTradeBox(0)}
            onChangeValue={this.onChangeValue}
            active={this.state.activeTradeBoxIndex === 0}
            value={
              this.state.activeTradeBoxIndex === 0
                ? this.state.currentTradeBoxValue
                : this.calculateValue()
            }
          />
          <TradeBox
            description={
              side === 'sell' ? 'You will receive' : 'You will receive'
            }
            assetId={side === 'sell' ? 'cash' : assetId}
            onPress={() => this.onPressTradeBox(1)}
            onChangeValue={this.onChangeValue}
            active={this.state.activeTradeBoxIndex === 1}
            value={
              this.state.activeTradeBoxIndex === 1
                ? this.state.currentTradeBoxValue
                : this.calculateValue()
            }
          />
        </View>
        {this.renderFooter()}
      </View>
    )
  }

  public render () {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='height'>
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
  closeButton: {
    position: 'absolute',
    left: 12,
    top: 24,
    padding: 6
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

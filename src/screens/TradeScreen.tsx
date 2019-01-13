import * as React from 'react'
import * as _ from 'lodash'
import { KeyboardAvoidingView, StyleSheet, View, TouchableHighlight, ScrollView, StatusBar } from 'react-native'
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
      return '1000'
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
    const valueInNumber = Number(_.replace(value, /,/g, ''))
    this.setState({ currentTradeBoxValue: valueInNumber.toLocaleString() })
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

  public renderCloseButton () {
    return (
      <TouchableHighlight
        style={styles.closeButton}
        onPress={this.onClose}
      >
        <AntDesign name='close' size={32} />
      </TouchableHighlight>
    )
  }

  public renderSubmitButton () {
    const content = (
      <Text type='button' color={COLORS.WHITE}>
        {_.capitalize(this.props.navigation.getParam('side'))}
      </Text>
    )
    const submitable = this.state.currentTradeBoxValue !== ''

    return (
      <TouchableHighlight
        style={[styles.submitButton, !submitable && styles.inactiveSubmitButton]}
        onPress={submitable ? this.onPressSubmit : undefined}
      >
        {content}
      </TouchableHighlight>
    )
  }

  public renderFooter () {
    const side = this.props.navigation.getParam('side', 'buy')
    return this.state.currentTradeBoxValue && (
      <View>
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
            autoFocus={true}
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
            description={side === 'sell' ? 'You will receive' : 'You will receive'}
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
      </View>
    )
  }

  public render () {
    return (
      <KeyboardAvoidingView
        behavior='height'
        style={styles.container}
      >
        <StatusBar
          barStyle='dark-content'
        />
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
    marginTop: 42,
    paddingHorizontal: 20,
    width: '100%'
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

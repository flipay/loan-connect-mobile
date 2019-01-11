import * as React from 'react'
import * as _ from 'lodash'
import { ScrollView, StyleSheet, View, TouchableHighlight, TouchableHighlightBase } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { FontAwesome } from '@expo/vector-icons'
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
    if (this.state.activeTradeBoxIndex === 0) {
      return '1000'
    } else {
      return '1000'
    }
  }

  public onPressTradeBox = (tradeBoxIndex: number) => {
    this.setState({ activeTradeBoxIndex: tradeBoxIndex })
  }

  public onChangeValue = (value: string) => {
    this.setState({ currentTradeBoxValue: value })
  }

  public onClose = () => {
    this.props.navigation.goBack()
  }

  public onPressPriceComparison = () => {
    console.log('onPress Price comparison')
  }

  public renderCloseButton () {
    return (
      <TouchableHighlight
        style={styles.closeButtonContainer}
        onPress={this.onClose}
      >
        <FontAwesome name='times' size={16} />
      </TouchableHighlight>
    )
  }

  public renderSubmitButton () {
    const content = (
      <Text type='button'>
        {_.capitalize(this.props.navigation.getParam('side'))}
      </Text>
    )
    const submitable = this.state.currentTradeBoxValue !== ''

    if (submitable) {
      return (
        <TouchableHighlight
          style={styles.submitButton}
        >
          {content}
        </TouchableHighlight>
      )
    }

    return (
      <View
        style={[styles.submitButton, styles.inactiveSubmitButton]}
      >
        {content}
      </View>
    )
  }

  public renderBody () {
    const side = this.props.navigation.getParam('side')
    const assetId = this.props.navigation.getParam('assetId')
    return (
      <View style={styles.bodyContainer}>
        <Text type='title'>
          {`${_.capitalize(side)} ${ASSETS[assetId].name}`}
        </Text>
        <Text type='body' color={COLORS.N500}>
          3,000 THB available
        </Text>
        <View style={styles.tradeBoxesContainer}>
          <TradeBox
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

  public render () {
    return (
      <ScrollView style={styles.container}>
        {this.renderCloseButton()}
        {this.renderBody()}
        {this.renderSubmitButton()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    paddingTop: 50
  },
  closeButtonContainer: {
    alignContent: 'flex-start',
    marginLeft: 18
  },
  bodyContainer: {
    alignItems: 'center'
  },
  tradeBoxesContainer: {
    marginTop: 42,
    paddingHorizontal: 20,
    width: '100%'
  },
  submitButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.P400
  },
  inactiveSubmitButton: {
    opacity: 0.35
  }
})

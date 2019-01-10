import * as React from 'react'
import { ScrollView, StyleSheet, View, TouchableHighlight } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { FontAwesome } from '@expo/vector-icons'
import { Text, TradeBox } from '../components'
import { COLORS } from '../constants/styleGuides'

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

  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: `${props.navigation.getParam(
        'side',
        'Buy'
      )} ${props.navigation.getParam('coinId', 'Bitcoin')}`
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

  public renderCloseButton () {
    return (
      <TouchableHighlight style={styles.closeButtonContainer} onPress={this.onClose}>
        <FontAwesome name='times' size={16} />
      </TouchableHighlight>
    )
  }

  public renderBody () {
    return (
      <View style={styles.bodyContainer}>
        <Text type='title'>
          {`${this.props.navigation.getParam('side')} ${this.props.navigation.getParam('coinId')}`}
        </Text>
        <Text type='body' color={COLORS.N500}>
          3,000 THB available
        </Text>
        <View style={styles.tradeBoxesContainer}>
          <TradeBox
            description='You buy with'
            onPress={() => this.onPressTradeBox(0)}
            onChangeValue={this.onChangeValue}
            active={this.state.activeTradeBoxIndex === 0}
            value={this.state.activeTradeBoxIndex === 0
              ? this.state.currentTradeBoxValue
              : this.calculateValue()
            }
          />
          <TradeBox
            description='You will receive'
            onPress={() => this.onPressTradeBox(1)}
            onChangeValue={this.onChangeValue}
            active={this.state.activeTradeBoxIndex === 1}
            value={this.state.activeTradeBoxIndex === 1
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
      <ScrollView style={styles.container}>
        {this.renderCloseButton()}
        {this.renderBody()}
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
  }
})

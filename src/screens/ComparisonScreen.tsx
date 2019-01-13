import * as React from 'react'
import * as _ from 'lodash'
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Constants } from 'expo'
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

  public render () {
    return (
      <View style={styles.container}>
        <Text type='title'>Save 500 THB with us!</Text>
        <Text>Looks like Flipay is the cheapest way to buy</Text>
        <Text>Bitcoin with 1,000 THB</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
})

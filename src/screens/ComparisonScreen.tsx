import * as React from 'react'
import * as _ from 'lodash'
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Constants } from 'expo'
import { Text, CloseButton } from '../components'
import { COLORS } from '../constants/styleGuides'
import { ASSETS } from '../constants/assets'

interface State {
  activeTradeBoxIndex: number
  currentTradeBoxValue: string
}

interface Record {
  name: string
  amount: number
  difference: number
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

  public onClose = () => {
    this.props.navigation.goBack()
  }

  public renderRecord (data: Record) {
    return (
      <View style={styles.record}>
        <Text>{data.name}</Text>
        <View style={styles.rightPartRecord}>
          <Text>{data.amount}</Text>
          <Text>{data.difference}</Text>
        </View>
      </View>
    )
  }
  public renderTableBody () {
    const mockData = [
      {
        name: 'flipay',
        amount: 0.0099,
        difference: 0
      }, {
        name: 'BX Thailand',
        amount: 0.0097,
        difference: 0.0013
      }, {
        name: 'Bitkub',
        amount: 0.0099,
        difference: 0.0013
      }, {
        name: 'Satang',
        amount: 0.0099,
        difference: 0.0013
      }
    ]

    return (
      <View>
        {mockData.map((data) => this.renderRecord(data))}
      </View>
    )
  }

  public renderTable () {
    return (
      <View>
        {this.renderTableBody()}
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <CloseButton onPress={this.onClose} color={COLORS.WHITE} />
        <Text type='title' color={COLORS.WHITE}>Save 500 THB with us!</Text>
        <Text color={COLORS.WHITE}>Looks like Flipay is the cheapest way to buy</Text>
        <Text color={COLORS.WHITE}>Bitcoin with 1,000 THB</Text>
        {this.renderTable()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: 'blue',
    position: 'relative'
  },
  record: {
    flexDirection: 'row'
  },
  rightPartRecord: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
})

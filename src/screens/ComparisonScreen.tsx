import * as React from 'react'
import * as _ from 'lodash'
import {
  View,
  StyleSheet,
  StatusBar
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { LinearGradient } from 'expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, CloseButton } from '../components'
import { COLORS } from '../constants/styleGuides'

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

  public renderRecord (data: Record, index: number) {
    return (
      <View style={styles.tableRecord} key={data.name}>
        <Text>{data.name}</Text>
        <View style={styles.rightPartRecord}>
          <Text>{data.amount}</Text>
          {index === 0 ? (
            <Text type='caption' color={COLORS.N500}>Best Price</Text>
          ) : (
            <View style={styles.captionRow}>
              <MaterialCommunityIcons name='trending-down' color='#FE4747' style={styles.downTrendIcon} />
              <Text type='caption' color={COLORS.N500}>{`- ${data.difference}`}</Text>
            </View>
          )}
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
        {mockData.map((data, index) => this.renderRecord(data, index))}
      </View>
    )
  }

  public renderTable () {
    return (
      <View style={styles.table}>
        <View style={styles.header}>
          <Text color={COLORS.N500}>If you use</Text>
          <Text color={COLORS.N500}>You will receive</Text>
        </View>
        {this.renderTableBody()}
      </View>
    )
  }

  public render () {
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={styles.container}
      >
        <StatusBar barStyle='light-content' />
        <CloseButton onPress={this.onClose} color={COLORS.WHITE} />
        <Text type='title' color={COLORS.WHITE}>Save 500 THB with us!</Text>
        <Text color={COLORS.WHITE}>Looks like Flipay is the cheapest way to buy</Text>
        <Text color={COLORS.WHITE}>Bitcoin with 1,000 THB</Text>
        {this.renderTable()}
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 86,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'blue',
    position: 'relative'
  },
  table: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    marginTop: 24,
    width: '100%',
    borderRadius: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 8
  },
  tableRecord: {
    borderTopColor: COLORS.N200,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 24
  },
  rightPartRecord: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  downTrendIcon: {
    marginRight: 4
  }
})

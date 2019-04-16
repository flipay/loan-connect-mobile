import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import Text from './Text'
import Asset from './Asset'
import Value from './Value'
import { COLORS, ASSETS } from '../constants'
import { AssetId } from '../types'

interface Props {
  type: 'buy' | 'sell' | 'deposit' | 'withdraw'
  amount: number
  assetId: AssetId
  price?: number
  date: string
  time: string
}

export default class Activity extends React.Component <Props> {
  public renderTimeSection () {
    return (
      <View style={styles.timeSection}>
        <Text type='caption'>{this.props.date}</Text>
        <Text type='caption'>{this.props.time}</Text>
      </View>
    )
  }

  public renderMainSection () {
    const { assetId } = this.props
    return (
      <View style={styles.mainSection}>
        <View style={styles.mainRow}>
          <View style={styles.mainAction}>
            <Text>{_.capitalize(this.props.type)}</Text>
            <Asset id={assetId} />
          </View>
          <Value assetId={assetId}>{this.props.amount}</Value>
        </View>
        <View style={styles.description}>
          {this.props.price && <Text>
            <Text>at</Text>
            <Value assetId='THB'>{this.props.price}</Value>
            <Text>{ASSETS[this.props.assetId].unit}</Text>
          </Text>}
        </View>
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.container}>
        {this.renderTimeSection()}
        {this.renderMainSection()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  timeSection: {
    borderRightWidth: 1,
    borderRightColor: COLORS.N200
  },
  mainSection: {
    backgroundColor: 'green'
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainAction: {
    flexDirection: 'row'
  },
  description: {
    alignItems: 'flex-end'
  }
})
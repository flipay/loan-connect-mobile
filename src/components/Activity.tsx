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
            <Text color={COLORS.N800} style={styles.action}>{_.capitalize(this.props.type)}</Text>
            <Asset id={assetId} bodySize={true} />
          </View>
          <Value assetId={assetId}>{this.props.amount}</Value>
        </View>
        {this.props.price && <View style={styles.description}>
          <Text type='caption'>at </Text>
          <Value assetId='THB' fontType='caption'>{this.props.price}</Value>
          <Text type='caption'>{`/${ASSETS[this.props.assetId].unit}`}</Text>
        </View>}
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
    flexDirection: 'row',
    borderBottomColor: COLORS.N200,
    borderBottomWidth: 1,
    paddingTop: 19,
    paddingBottom: 15
  },
  timeSection: {
    borderRightWidth: 1,
    borderRightColor: COLORS.N200,
    paddingRight: 12,
    justifyContent: 'space-between'
  },
  mainSection: {
    paddingLeft: 10,
    flex: 1,
    justifyContent: 'space-between'
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainAction: {
    flexDirection: 'row'
  },
  action: {
    marginRight: 8
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
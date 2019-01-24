import * as React from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import Layer from './Layer'
import Text from './Text'
import Value from './Value'
import Asset from './Asset'
import { COLORS } from '../constants/styleGuides'
import { AssetId } from '../types'

interface Props {
  assetId: AssetId
  amount: number
  price: number
  fee: number
}

export default class TradeResult extends React.Component<Props> {
  public renderStatusHeader () {
    return (
      <View style={styles.header}>
        <Image
          style={{ width: 48, height: 48 }}
          source={require('../img/confirm_icon.png')}
        />
        <Text type='title' color={COLORS.N800} style={styles.title}>
          Transaction Completed
        </Text>
      </View>
    )
  }

  public renderAssetPart () {
    return (
      <View style={styles.assetPart}>
        <Text>You received</Text>
        <View style={[styles.row, styles.assetRow]}>
          <Asset id={this.props.assetId} />
          <Value assetId={this.props.assetId}>{this.props.amount}</Value>
        </View>
      </View>
    )
  }

  public renderPaymentPart () {
    return (
      <View style={styles.paymentPart}>
        <View style={styles.row}>
          <Text type='caption'>Exchange price</Text>
          <Value fontType='caption' assetId='THB'>{this.props.price}</Value>
        </View>
        <View style={[styles.row, styles.fee]}>
          <Text type='caption'>Transaction Fee</Text>
          <Value fontType='caption' assetId='THB'>{this.props.fee}</Value>
        </View>
        <View style={styles.row}>
          <Text type='headline'>Total expense</Text>
          <Value assetId='THB'>{this.props.price + this.props.fee}</Value>
        </View>
      </View>
    )
  }

  public renderTradeDetail () {
    return (
      <Layer>
        {this.renderAssetPart()}
        {this.renderPaymentPart()}
      </Layer>
    )
  }

  public render () {
    return (
      <View style={styles.container}>
        {this.renderStatusHeader()}
        {this.renderTradeDetail()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center'
  },
  title: {
    marginTop: 12,
    marginBottom: 32
  },
  assetPart: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: COLORS.WHITE
  },
  assetRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  paymentPart: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: COLORS.N200
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fee: {
    marginTop: 8,
    marginBottom: 16
  }
})
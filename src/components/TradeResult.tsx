import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import Layer from './Layer'
import Text from './Text'
import Value from './Value'
import Button from './Button'
import GradientScreen from './GradientScreen'
import { COLORS } from '../constants/styleGuides'
import { AssetId, OrderType } from '../types'

interface Props {
  orderType: OrderType
  assetId: AssetId
  cryptoAmount: number
  thbAmount: number
  fee?: number
  onPressDone: () => void
}

export default class TradeResult extends React.Component<Props> {
  public renderStatusHeader () {
    return (
      <View style={styles.header}>
        <Text
          style={{ fontFamily: 'flipay-icon', fontSize: 40 }}
          color={COLORS.N300}
        >
          
        </Text>
        <Text type='title' bold={true} color={COLORS.WHITE} style={styles.title}>
          Transaction Completed
        </Text>
      </View>
    )
  }

  public renderAssetPart () {
    return (
      <View style={styles.assetPart}>
        <Text type='caption' color={COLORS.N800}>{this.props.orderType === 'buy' ? 'You received' : 'You sold'}</Text>
        <Value assetId={this.props.assetId} fontType='headline' bold={true} withImage={true}>{this.props.cryptoAmount}</Value>
      </View>
    )
  }

  public renderPaymentPart () {
    return (
      <View style={styles.paymentPart}>
        <View style={styles.row}>
          <Text type='caption' color={COLORS.N500}>Total expense</Text>
          <Value assetId='THB' fontType='caption' color={COLORS.N800}>{this.props.thbAmount}</Value>
        </View>
        <View style={styles.space} />
        <View style={styles.row}>
          <Text type='caption' color={COLORS.N500}>Price</Text>
          <Value assetId='THB' fontType='caption' color={COLORS.N800}>{this.props.thbAmount / this.props.cryptoAmount}</Value>
        </View>
      </View>
    )
  }

  public renderTradeDetail () {
    return (
      <Layer style={styles.layer}>
        {this.renderAssetPart()}
        {this.renderPaymentPart()}
        <Button onPress={this.props.onPressDone} primary={true}>Done</Button>
      </Layer>
    )
  }

  public render () {
    return (
      <GradientScreen>
        {this.renderStatusHeader()}
        {this.renderTradeDetail()}
      </GradientScreen>
    )
  }
}

const styles = StyleSheet.create({
  layer: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  header: {
    marginTop: 30,
    marginBottom: 60,
    alignItems: 'center'
  },
  title: {
    marginTop: 12
  },
  assetPart: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  assetRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  paymentPart: {
    padding: 16,
    backgroundColor: COLORS.N200,
    borderRadius: 6,
    marginBottom: 16
  },
  space: {
    height: 16
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

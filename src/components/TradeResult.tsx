import * as React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native'
import Layer from './Layer'
import Text from './Text'
import { COLORS, FONT_TYPES } from '../constants/styleGuides'
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
        <Text type='title' color={COLORS.N800}>
          Transaction Completed
        </Text>
      </View>
    )
  }

  public renderAssetPart () {
    return (
      <View style={styles.assetPart}>
        <Text>You received</Text>
        <View style={styles.row}>
          <View style={styles.asset}>
            <Image
              source={require('../img/btc.png')}
            />
            <Text>Bitcoin</Text>
          </View>
          <Text>
            0.0099 BTC
          </Text>
        </View>
      </View>
    )
  }

  public renderPaymentPart () {
    return (
      <View style={styles.paymentPart}>
        <View style={styles.row}>
          <Text type='caption'>Exchange price</Text>
          <Text type='caption'>950 THB</Text>
        </View>
        <View style={styles.row}>
          <Text type='caption'>Transaction Fee</Text>
          <Text type='caption'>950 THB</Text>
        </View>
        <View style={styles.row}>
          <Text type='headline'>Total expense</Text>
          <Text type='headline'>950 THB</Text>
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
  assetPart: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: COLORS.WHITE
  },
  asset: {
    flexDirection: 'row'
  },
  paymentPart: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: COLORS.N200
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

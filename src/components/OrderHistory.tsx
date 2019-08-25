import * as React from 'react'
import _ from 'lodash'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { OrderType, OrderSide, OrderStatus, AssetId } from '../types'
import Text from './Text'
import Value from './Value'
import { COLORS } from '../constants'

interface Props {
  index: number
  type: OrderType
  side: OrderSide
  assetId: AssetId
  cryptoAmount: number
  thbAmount: number
  time: string
  status: OrderStatus
  onPress: () => void
}

export default class OrderHistory extends React.Component<Props> {
  public renderRightPart () {
    const { status, assetId, cryptoAmount, thbAmount, side } = this.props
    // if (status === 'completed') {
    return (
      <View style={styles.rightPart}>
        <Value assetId={assetId}>{cryptoAmount}</Value>
        <View style={[styles.thbRow, styles.secondRow]}>
          <Text type='caption'>{side === 'buy' ? 'Paid ' : 'Received '}</Text>
          <Value assetId='THB' fontType='caption'>
            {thbAmount}
          </Value>
        </View>
      </View>
    )
    // } else {
    //   return (
    //     <Text>
    //       {`${_.capitalize(status)}`}
    //     </Text>
    //   )
    // }
  }

  public render () {
    const { type, side, time } = this.props
    return (
      <View>
        {this.props.index !== 0 && <View style={styles.line} />}
        <TouchableOpacity
          style={styles.container}
          onPress={this.props.onPress}
        >
          <View style={styles.leftPart}>
            <Text color={COLORS.N800}>{`${_.capitalize(type)} ${_.capitalize(
              side
            )}`}</Text>
            <Text type='caption' style={styles.secondRow}>
              {time}
            </Text>
          </View>
          {this.renderRightPart()}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16
  },
  line: {
    height: 1,
    backgroundColor: COLORS.N200
  },
  leftPart: {
    alignItems: 'flex-start'
  },
  rightPart: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  thbRow: {
    flexDirection: 'row'
  },
  secondRow: {
    marginTop: 4
  }
})

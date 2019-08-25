import * as React from 'react'
import _ from 'lodash'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { OrderType, OrderSide, OrderStatus, AssetId } from '../types'
import Text from './Text'
import Value from './Value'
import Price from './Price'
import { COLORS } from '../constants'

interface Props {
  index: number
  type: OrderType
  side: OrderSide
  assetId: AssetId
  cryptoAmount: number
  price: number
  time: string
  status: OrderStatus
  onPress: () => void
}

export default class OrderHistory extends React.Component<Props> {
  public renderRightPart () {
    const { status, assetId, cryptoAmount, price, side } = this.props
    // if (status === 'completed') {
    return (
      <View style={styles.rightPart}>
        <Value assetId={assetId}>{cryptoAmount}</Value>
        <View style={[styles.thbRow, styles.secondRow]}>
          <Text type='caption' color={COLORS.N500}>{'Price '}</Text>
          <Price fontType='caption' color={COLORS.N500}>
            {price}
          </Price>
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
            <Text type='caption' style={styles.secondRow} color={COLORS.N500}>
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

import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import Modal from './Modal'
import Text from './Text'
import { OrderType } from '../types'
import { COLORS } from '../constants'

interface Props {
  selectedOrderType: OrderType
  onClose: () => void
}

export default class OrderTypeModal extends React.Component<Props> {
  public renderOption (orderType: OrderType) {
    return (
      <View
        style={[
          styles.option,
          styles.paddings,
          this.props.selectedOrderType === orderType && styles.active
        ]}
      >
        <Text>Icon</Text>
        <View>
          <Text type='headline'>{`${_.capitalize(orderType)} order`}</Text>
          {orderType === 'market' ? (
            <Text type='caption'>Buy immediately at the best available price right now.</Text>
          ) : (
            <Text type='caption'>
              Schedule to buy when the price is at the specific price that I’m
              willing to pay.
            </Text>
          )}
        </View>
      </View>
    )
  }

  public render () {
    return (
      <Modal onPressOutside={this.props.onClose}>
        <View>
          <View style={[styles.header, styles.paddings]}>
            <Text>Select an order type</Text>
            <AntDesign name='close' size={28} color={COLORS.N800} />
          </View>
        </View>
        {this.renderOption('market')}
        {this.renderOption('limit')}
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  paddings: {
    paddingVertical: 16,
    paddingHorizontal: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  option: {
    flexDirection: 'row'
  },
  active: {
    backgroundColor: COLORS.N100
  }
})

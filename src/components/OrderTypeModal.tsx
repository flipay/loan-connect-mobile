import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { Entypo, AntDesign } from '@expo/vector-icons'
import Modal from './Modal'
import Text from './Text'
import { OrderType } from '../types'
import { COLORS } from '../constants'

interface Props {
  onSelect: (orderType: OrderType) => void
  selectedOrderType: OrderType
  onClose: () => void
}

export default class OrderTypeModal extends React.Component<Props> {
  public renderOption (orderType: OrderType) {
    const marketType = orderType === 'market'
    return (
      <TouchableOpacity
        onPress={() => this.props.onSelect(orderType)}
        style={[
          styles.option,
          styles.paddings,
          this.props.selectedOrderType === orderType && styles.active
        ]}
      >
        <View style={[styles.icon, { backgroundColor: marketType ? COLORS.P400 : COLORS.Y400 }]}>
          <Entypo name={marketType ? 'flash' : 'back-in-time'} color={COLORS.WHITE} size={15} />
        </View>
        <View style={styles.optionContent}>
          <Text type='headline'>{`${_.capitalize(orderType)} order`}</Text>
          {marketType ? (
            <Text type='caption'>
              Buy immediately at the best available price right now.
            </Text>
          ) : (
            <Text type='caption'>
              Schedule to buy when the price is at the specific price that I’m
              willing to pay.
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  public render () {
    return (
      <Modal onPressOutside={(this.props.onClose)}>
        <View style={[styles.header, styles.paddings]}>
          <Text color={COLORS.N800}>Select an order type</Text>
          <TouchableWithoutFeedback onPress={this.props.onClose}>
            <AntDesign name='close' size={18} color={COLORS.N800} />
          </TouchableWithoutFeedback>
        </View>
        {this.renderOption('market')}
        {this.renderOption('limit')}
      </Modal>
    )
  }
}

const iconSize = 24

const styles = StyleSheet.create({
  paddings: {
    paddingVertical: 16,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  option: {
    flexDirection: 'row'
  },
  optionContent: {
    flex: 1
  },
  active: {
    backgroundColor: COLORS.N100
  },
  icon: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  }
})

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import Modal from './Modal'
import Text from './Text'
import { OrderType } from '../types'
import { COLORS } from '../constants'

interface Props {
  orderType: OrderType
  onClose: () => void
}

export default class OrderTypeModal extends React.Component<Props> {
  public render () {
    return (
      <Modal onPressOutside={this.props.onClose}>
        <View>
          <View style={styles.header}>
            <Text>Select an order type</Text>
            <AntDesign name='close' size={28} color={COLORS.N800} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24
  }
})

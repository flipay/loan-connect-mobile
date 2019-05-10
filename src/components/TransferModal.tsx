import * as React from 'react'
import { View, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import Text from './Text'
import Button from './Button'
import { AssetId } from '../types'
import { ASSETS, COLORS } from '../constants'

interface Props {
  assetId: AssetId
  onPressDeposit: () => void
  onPressWithdraw: () => void
  onPressOutside: () => void
}

export default class TransferModal extends React.Component<Props> {
  public renderContent () {
    const assetName = ASSETS[this.props.assetId].name
    return (
      <View style={styles.modalCard}>
        <Text type='headline' style={styles.title}>Choose the transfer action. </Text>
        <Button onPress={this.props.onPressDeposit} style={styles.button}>{`Deposit ${assetName}`}</Button>
        <Button onPress={this.props.onPressWithdraw} style={styles.button}>{`Withdraw ${assetName}`}</Button>
      </View>
    )
  }

  public render () {
    return (
      <Modal
        animationType='fade'
        transparent={true}
      >
        <TouchableWithoutFeedback
          style={styles.background}
          onPress={this.props.onPressOutside}
        >
          <View style={styles.background}>
            <View style={styles.space} />
            {this.renderContent()}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  space: {
    flex: 1
  },
  title: {
    marginTop: 20,
    marginBottom: 15
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  modalCard: {
    opacity: 1,
    backgroundColor: COLORS.WHITE,
    margin: 8,
    paddingHorizontal: 10,
    borderRadius: 4
  },
  button: {
    marginBottom: 8
  }
})
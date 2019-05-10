import * as React from 'react'
import { View, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import Text from './Text'
import Button from './Button'
import { AssetId } from '../types'
import { ASSETS, COLORS } from '../constants'

interface Props {
  assetId: AssetId
  onPressDoposit: () => void
  onPressWithdraw: () => void
  onPressOutside: () => void
}

export default class TransferModal extends React.Component<Props> {
  public renderContent () {
    const assetName = ASSETS[this.props.assetId].name
    return (
      <View>
        <Button onPress={this.props.onPressDoposit}>{`Deposit ${assetName}`}</Button>
        <Button onPress={this.props.onPressWithdraw}>{`Withdraw ${assetName}`}</Button>
      </View>
    )
  }

  public render () {
    return (
      <Modal
        transparent={true}
      >
        <TouchableWithoutFeedback
          style={styles.background}
          onPress={this.props.onPressOutside}
        >
          <View>
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
  background: {
    backgroundColor: COLORS.N100
  }
})
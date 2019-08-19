import * as React from 'react'
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import { COLORS } from '../constants'

interface Props {
  children: any
  onPressOutside: () => void
}

export default class FlipModal extends React.Component<Props> {
  public render () {
    return (
      <Modal animationType='fade' transparent={true}>
        <TouchableWithoutFeedback
          style={styles.background}
          onPress={this.props.onPressOutside}
        >
          <View style={styles.background}>
            <View style={styles.modalCard}>{this.props.children}</View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    opacity: 1,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  button: {
    marginBottom: 8
  }
})

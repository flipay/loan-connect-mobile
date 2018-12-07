import * as React from 'react'
import {
  View,
  TextInput,
  StyleSheet
} from 'react-native'
import { COLORS } from '../constants/styleGuides'
import _ from 'lodash'

type Index = 0 | 1 | 2 | 3 | 4 | 5

interface Props {
  pin: string
  onPinChange: (pin: string) => void
}

export default class PinScreen extends React.Component<Props> {
  public onChangeText = (text: string) => {
    this.props.onPinChange(text)
  }

  public renderDot (index: Index) {
    return (
      <View
        style={[styles.dot, this.props.pin.length > index && styles.activeDot]}
      />
    )
  }

  public renderDots () {
    return (
      <View style={styles.dots}>
        {this.renderDot(0)}
        {this.renderDot(1)}
        {this.renderDot(2)}
        {this.renderDot(3)}
        {this.renderDot(4)}
        {this.renderDot(5)}
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        {this.renderDots()}
        <TextInput
          keyboardType='number-pad'
          onChangeText={this.onChangeText}
          autoFocus={true}
          maxLength={6}
          style={styles.invisibleTextInput}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative'
  },
  dots: {
    flexDirection: 'row'
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: COLORS.P500,
    borderWidth: 1
  },
  activeDot: {
    backgroundColor: COLORS.P500
  },
  invisibleTextInput: {
    position: 'absolute',
    top: -1000,
    left: -1000
  }
})

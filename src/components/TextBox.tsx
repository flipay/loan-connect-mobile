import * as React from 'react'
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native'
import Text from './Text'
import Layer from './Layer'
import { COLORS, FONT_TYPES } from '../constants'

interface Props {
  autoFocus?: boolean
  description: string
  placeholder?: string
  onPress: () => void
  onChangeValue: (value: string) => void
  active: boolean
  value?: string
  numberPad?: boolean
}

export default class TextBox extends React.Component<Props> {
  private input: TextInput | null = null

  public onPress = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  public render () {
    return (
      <Layer
        style={styles.container}
        onPress={this.onPress}
        active={this.props.active}
      >
        <View style={styles.leftContainer}>
          <Text type='caption' color={COLORS.N500}>{this.props.description}</Text>
          <TextInput
            ref={element => {
              this.input = element
            }}
            style={[styles.textInput, this.props.active && styles.activeTextInput]}
            autoFocus={this.props.autoFocus}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.active ? COLORS.P100 : COLORS.N300}
            selectionColor={COLORS.P400}
            onChangeText={text => this.props.onChangeValue(text)}
            value={this.props.value}
            keyboardType={this.props.numberPad ? 'decimal-pad' : 'default'}
            onFocus={this.props.onPress}
          />
        </View>
      </Layer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  leftContainer: {
    flex: 2,
    padding: 10
  },
  textInput: {
    fontSize: FONT_TYPES['large-title'].fontSize,
    fontFamily: FONT_TYPES['large-title'].fontFamily,
    color: COLORS.N800
  },
  activeTextInput: {
    color: COLORS.P400
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.N200,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16
  }
})

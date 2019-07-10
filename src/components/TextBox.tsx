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
  label: string
  placeholder?: string
  onPress: () => void
  onChangeValue: (value: string) => void
  active: boolean
  autoCorrect?: boolean
  value?: string
  numberPad?: boolean
  style?: any
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
        style={[styles.container, this.props.style]}
        onPress={this.onPress}
        active={this.props.active}
      >
        <Text type='caption' color={this.props.active ? COLORS.P400 : COLORS.N500}>{this.props.label}</Text>
        <TextInput
          ref={element => {
            this.input = element
          }}
          style={styles.textInput}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.active ? COLORS.P100 : COLORS.N300}
          selectionColor={COLORS.P400}
          onChangeText={text => this.props.onChangeValue(text)}
          value={this.props.value}
          keyboardType={this.props.numberPad ? 'decimal-pad' : 'default'}
          onFocus={this.props.onPress}
          autoCorrect={this.props.autoCorrect}
        />
      </Layer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 17
  },
  textInput: {
    marginTop: 6,
    fontSize: FONT_TYPES['body'].fontSize,
    fontFamily: FONT_TYPES['large-title'].fontFamily,
    color: COLORS.N800
  }
})

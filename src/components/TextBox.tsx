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
  validate?: () => boolean
  errorMessage?: string
  numberPad?: boolean
  style?: any
}

interface State {
  typing: boolean
}

export default class TextBox extends React.Component<Props, State> {
  private input: TextInput | null = null
  private timeout: any

  constructor (props: Props) {
    super(props)
    this.state = {
      typing: false
    }
  }

  public getDerivedStateFromProps (props: Props, state: State) {
    if (props.value !== this.props.value) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setState({ typing: false })
      }, 3000)
      return { typing: true }
    }
    return null
  }

  public isError () {
    if (!this.props.validate) { return false }
    return !this.state.typing && !this.props.validate()
  }

  public onPress = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  public render () {
    return (
      <View>
        <Layer
          style={[styles.container, this.isError() && styles.errorContainer, this.props.style]}
          onPress={this.onPress}
          active={this.props.active}
        >
          <Text type='caption' color={this.isError() ? COLORS.R400 : (this.props.active ? COLORS.P400 : COLORS.N500)}>{this.props.label}</Text>
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
        {this.props.errorMessage && this.isError() && <Text type='caption' style={styles.errorMessage} color={COLORS.R400}>{this.props.errorMessage}</Text>}
      </View>
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
  errorContainer: {
    borderColor: COLORS.R400
  },
  textInput: {
    marginTop: 6,
    fontSize: FONT_TYPES.body.fontSize,
    fontFamily: FONT_TYPES['large-title'].fontFamily,
    color: COLORS.N800
  },
  errorMessage: {
    marginTop: 8
  }
})

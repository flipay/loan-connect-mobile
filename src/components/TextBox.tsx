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
  onChangeValue: (value: string) => void
  autoCorrect?: boolean
  value?: string
  validate?: () => boolean
  errorMessage?: string
  numberPad?: boolean
  style?: any
}

interface State {
  typing?: boolean
  active: boolean
}

export default class TextBox extends React.Component<Props, State> {
  private input: TextInput | null = null
  private timeout: any

  constructor (props: Props) {
    super(props)
    this.state = {
      typing: undefined,
      active: false
    }
  }

  public UNSAFE_componentWillReceiveProps (props: Props, state: State) {
    if (props.value !== this.props.value) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setState({ typing: false })
      }, 1000)
      this.setState({ typing: true })
    }
  }

  public componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  public isError () {
    if (!this.props.validate) { return false }
    return this.state.typing === false && !this.props.validate()
  }

  public onPress = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  public onFocus = () => {
    this.setState({ active: true })
  }

  public onBlur = () => {
    this.setState({ active: false })
  }

  public render () {
    return (
      <View style={{ flex: 1 }}>
        <Layer
          style={[styles.container, this.isError() && styles.errorContainer, this.props.style]}
          onPress={this.onPress}
          active={this.state.active}
        >
          <Text type='caption' color={this.isError() ? COLORS.R400 : (this.state.active ? COLORS.P400 : COLORS.N500)}>{this.props.label}</Text>
          <TextInput
            ref={element => {
              this.input = element
            }}
            autoCapitalize='none'
            style={styles.textInput}
            autoFocus={this.props.autoFocus}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.state.active ? COLORS.P100 : COLORS.N300}
            selectionColor={COLORS.P400}
            onChangeText={text => this.props.onChangeValue(text)}
            value={this.props.value}
            keyboardType={this.props.numberPad ? 'decimal-pad' : 'default'}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
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

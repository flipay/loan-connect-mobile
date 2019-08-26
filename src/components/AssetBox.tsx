import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, TextInput, Image } from 'react-native'
import Text from './Text'
import Layer from './Layer'
import { toNumber } from '../utils'
import { COLORS, FONT_TYPES, ASSETS } from '../constants'
import { AssetId } from '../types'

interface Props {
  autoFocus?: boolean
  description: string
  assetId: AssetId
  onChangeValue?: (value: string) => void
  value?: string
  warning?: string
  error?: string
  renderFooter?: () => any
  errorMessageStyle?: any
}

interface State {
  active: boolean
}

export default class AssetBox extends React.Component<Props, State> {

  public constructor (props: Props) {
    super(props)
    this.state = ({
      active: false
    })
  }

  private input: TextInput | null = null

  public formatNumberInString (valueInString: string) {
    let haveDot = false
    let endingZero = 0
    const valueInNumber = toNumber(valueInString)
    if (valueInString === '.') {
      valueInString = '0.'
    } else if (isNaN(valueInNumber)) {
      return this.props.value
    } else if (valueInString !== '') {
      const { length } = valueInString
      if (valueInString[length - 1] === '.') {
        haveDot = true
      } else if (
        _.includes(valueInString, '.') &&
        valueInString[length - 1] === '0'
      ) {
        const valueWithoutZero = _.trimEnd(valueInString, '0')
        if (valueWithoutZero[valueWithoutZero.length - 1] === '.') {
          haveDot = true
        }
        endingZero = length - _.trimEnd(valueInString, '0').length
      }
      valueInString = valueInNumber.toLocaleString(undefined, {
        maximumFractionDigits: 8
      })
      if (haveDot) {
        valueInString += '.'
      }
      if (endingZero > 0) {
        for (let i = 0; i < endingZero; i++) {
          valueInString += '0'
        }
      }
    }
    return valueInString
  }

  public onPress = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  public renderErrorMessage () {
    if (this.props.error) {
      return (
        <Text type='caption' color={COLORS.R400} style={[styles.errorMessage, this.props.errorMessageStyle]}>
          {this.props.error}
        </Text>
      )
    } else if (this.props.warning) {
      return (
        <Text type='caption' color={COLORS.Y400} style={[styles.errorMessage, this.props.errorMessageStyle]}>
          {this.props.warning}
        </Text>
      )
    } else {
      return null
    }
  }

  public getDescriptionColor () {
    if (this.props.error) {
      return COLORS.R400
    } else if (this.props.warning) {
      return COLORS.Y400
    } else if (this.state.active) {
      return COLORS.P400
    } else {
      return COLORS.N500
    }
  }

  public onFocus = () => {
    this.setState({
      active: true
    })
  }

  public onBlur = () => {
    this.setState({
      active: false
    })
  }

  public renderTextInput () {
    return this.props.onChangeValue ? (
      <TextInput
        ref={element => {
          this.input = element
        }}
        style={styles.textInput}
        maxLength={10}
        autoFocus={this.props.autoFocus}
        placeholderTextColor={
          this.state.active ? COLORS.P100 : COLORS.N300
        }
        selectionColor={COLORS.P400}
        onChangeText={text =>
          this.props.onChangeValue(this.formatNumberInString(text))
        }
        value={this.props.value}
        keyboardType='decimal-pad'
        placeholder='0'
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    ) : (
      <Text type='large-title'>{this.props.value || 0}</Text>
    )
  }

  public renderContent () {
    const { image, unit } = ASSETS[this.props.assetId]
    return (
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          <Text type='caption' color={this.getDescriptionColor()}>
            {this.props.description}
          </Text>
          {this.renderTextInput()}
        </View>
        <View style={styles.rightContainer}>
          <Image
            source={image}
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          <Text>{unit}</Text>
        </View>
      </View>
    )
  }

  public renderContentWithFooter () {
    return (
      <View>
        {this.renderContent()}
        {this.props.renderFooter && (
          <View style={styles.footerContainer}>
            {this.props.renderFooter()}
          </View>
        )}
      </View>
    )
  }

  public render () {
    return (
      <View>
        {this.props.onChangeValue ? (
          <Layer
            style={[
              styles.container,
              this.props.renderFooter && styles.footerPadding,
              this.props.warning && styles.warningContainer,
              this.props.error && styles.errorContainer
            ]}
            onPress={this.onPress}
            active={this.state.active}
            borderRadius={6}
          >
            {this.props.renderFooter
              ? this.renderContentWithFooter()
              : this.renderContent()}
          </Layer>
        ) : (
          <View style={[styles.staticContainer, styles.container]}>{this.renderContent()}</View>
        )}
        {this.renderErrorMessage()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0
  },
  footerPadding: {
    paddingBottom: 8
  },
  content: {
    flexDirection: 'row',
    paddingBottom: 16
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.N200
  },
  staticContainer: {
    backgroundColor: COLORS.N100,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.N200
  },
  warningContainer: {
    borderColor: COLORS.Y400,
    borderWidth: 1
  },
  errorContainer: {
    borderColor: COLORS.R400,
    borderWidth: 1
  },
  leftContainer: {
    flex: 3
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16
  },
  errorMessage: {
    marginTop: 8
  }
})

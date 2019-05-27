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
  onPress: () => void
  onChangeValue: (value: string) => void
  active: boolean
  value?: string
  warning?: string
  error?: string
}

export default class AssetBox extends React.Component<Props> {
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
      valueInString = valueInNumber.toLocaleString(undefined, { maximumFractionDigits: 8 })
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
        <Text type='caption' color={COLORS.R400} style={styles.errorMessage}>
          {this.props.error}
        </Text>
      )
    } else if (this.props.warning) {
      return (
        <Text type='caption' color={COLORS.Y400} style={styles.errorMessage}>
          {this.props.warning}
        </Text>
      )
    } else {
      return null
    }
  }

  public getColor () {
    if (this.props.error) {
      return COLORS.R400
    } else if (this.props.warning) {
      return COLORS.Y400
    } else if (this.props.active) {
      return COLORS.P400
    } else {
      return COLORS.N500
    }
  }

  public render () {
    const { image, unit } = ASSETS[this.props.assetId]
    return (
      <View>
        <Layer
          style={[styles.container, this.props.warning && styles.warningContainer, this.props.error && styles.errorContainer]}
          onPress={this.onPress}
          active={this.props.active}
        >
          <View style={styles.leftContainer}>
            <Text type='caption' color={this.getColor()}>
              {this.props.description}
            </Text>
            <TextInput
              ref={element => {
                this.input = element
              }}
              style={styles.textInput}
              maxLength={10}
              autoFocus={this.props.autoFocus}
              placeholderTextColor={this.props.active ? COLORS.P100 : COLORS.N300}
              selectionColor={this.getColor()}
              onChangeText={text =>
                this.props.onChangeValue(this.formatNumberInString(text))
              }
              value={this.props.value}
              keyboardType='decimal-pad'
              placeholder='0'
              onFocus={this.props.onPress}
            />
          </View>
          <View style={styles.rightContainer}>
            <Image
              source={image}
              style={{ width: 16, height: 16, marginRight: 8 }}
            />
            <Text>{unit}</Text>
          </View>
        </Layer>
        {this.renderErrorMessage()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
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
  },
  errorMessage: {
    marginTop: 8
  }
})

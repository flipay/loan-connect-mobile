import * as React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import AssetBox from './AssetBox'
import Text from './Text'
import Value from './Value'
import { AssetId } from '../types'
import { COLORS } from '../constants'

interface Props {
  autoFocus?: boolean
  description: string
  assetId: AssetId
  onChangeValue: (value: string) => void
  value?: string
  warning?: string
  error?: string
  balance?: number
  onPressMax: () => void
  onPressHalf: () => void
  containerStyle?: any
  errorMessageStyle?: any
}

export default class AssetBoxWithBalance extends React.Component<Props> {
  public renderSmallbutton (text: string, onPress: () => void) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text type='body' bold={true} color={COLORS.P400}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }

  public renderBalanceSection = () => {
    return (
      <View
        style={[
          styles.balanceSection,
          !!this.props.error && styles.errorBalanceSection
        ]}
      >
        {this.props.balance !== undefined ? (
          <View style={styles.balance}>
            <Text type='caption' color={COLORS.N500}>{`Balance `}</Text>
            <Value
              assetId={this.props.assetId}
              color={COLORS.N800}
              fontType='caption'
            >
              {this.props.balance}
            </Value>
          </View>
        ) : (
          <View />
        )}
        <View style={styles.buttonGroup}>
          {this.renderSmallbutton('Max', this.props.onPressMax)}
          {this.renderSmallbutton('Half', this.props.onPressHalf)}
        </View>
      </View>
    )
  }

  public render () {
    return (
      <View style={this.props.containerStyle}>
        <AssetBox
          autoFocus={this.props.autoFocus}
          description={this.props.description}
          assetId={this.props.assetId}
          onChangeValue={this.props.onChangeValue}
          value={this.props.value}
          warning={this.props.warning}
          error={this.props.error}
          renderFooter={this.renderBalanceSection}
          errorMessageStyle={this.props.errorMessageStyle}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  balanceSection: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balance: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  errorBalanceSection: {
    marginTop: 8
  },
  buttonGroup: {
    flexDirection: 'row'
  },
  button: {
    borderWidth: 1,
    borderColor: COLORS.P200,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8
  }
})

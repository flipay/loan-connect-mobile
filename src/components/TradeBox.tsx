import * as React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native'
import Text from './Text'
import { COLORS, FONT_TYPES } from '../constants/styleGuides'
import { ASSETS, AssetId } from '../constants/assets'

interface Props {
  autoFocus?: boolean
  description: string
  assetId: AssetId
  onPress: () => void
  onChangeValue: (value: string) => void
  active: boolean
  value?: string
}

export default class TradeBox extends React.Component<Props> {
  private input: TextInput | null = null

  public onPress = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  public render () {
    const { image, unit } = ASSETS[this.props.assetId]
    return (
      <TouchableOpacity
        style={[styles.container, this.props.active && styles.activeContainer]}
        onPress={this.onPress}
      >
        <View style={styles.leftContainer}>
          <Text type='caption' color={COLORS.N500}>{this.props.description}</Text>
          <TextInput
            ref={element => {
              this.input = element
            }}
            style={[styles.textInput, this.props.active && styles.activeTextInput]}
            autoFocus={this.props.autoFocus}
            placeholderTextColor={this.props.active ? COLORS.P100 : COLORS.N300}
            selectionColor={COLORS.P400}
            onChangeText={text => this.props.onChangeValue(text)}
            value={this.props.value}
            keyboardType='decimal-pad'
            placeholder='0'
            onFocus={this.props.onPress}
          />
        </View>
        <View style={styles.rightContainer}>
          <Image source={image} style={styles.image} />
          <Text>{unit}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.N200,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16
  },
  activeContainer: {
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2
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
  image: {
    marginRight: 8
  }
})

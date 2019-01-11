import * as React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native'
import Text from './Text'
import { COLORS } from '../constants/styleGuides'
import { ASSETS } from '../constants/assets'

interface Props {
  description: string
  assetId: string
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
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <View style={styles.leftContainer}>
          <Text color={COLORS.N500}>{this.props.description}</Text>
          <TextInput
            ref={element => {
              this.input = element
            }}
            onChangeText={text => this.props.onChangeValue(text)}
            value={this.props.value}
            keyboardType='number-pad'
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
    borderColor: COLORS.N100,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16
  },
  leftContainer: {
    flex: 2,
    padding: 16
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

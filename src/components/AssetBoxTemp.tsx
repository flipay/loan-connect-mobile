import * as React from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import Text from './Text'
import { COLORS, FONT_TYPES, ASSETS } from '../constants'
import { AssetId } from '../types'

interface Props {
  description: string
  assetId: AssetId
  value?: string
}

export default class AssetBoxTemp extends React.Component<Props> {
  public render () {
    const { image, unit } = ASSETS[this.props.assetId]
    return (
      <View
        style={styles.container}
      >
        <View style={styles.leftContainer}>
          <Text type='caption' color={COLORS.N500}>{this.props.description}</Text>
          <Text style={styles.text}>
            {this.props.value || 0}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Image source={image} style={{ width: 16, height: 16, marginRight: 8 }} />
          <Text>{unit}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.N200
  },
  leftContainer: {
    flex: 2,
    padding: 10
  },
  text: {
    fontSize: FONT_TYPES['large-title'].fontSize,
    fontFamily: FONT_TYPES['large-title'].fontFamily,
    color: COLORS.N800
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

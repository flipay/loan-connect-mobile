import * as React from 'react'

import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType
} from 'react-native'

interface Props {
  image: ImageSourcePropType
  name: string
  amount: number
  price?: number
  unit?: string
  isFiat?: boolean
}
import { COLORS } from '../constants/styleGuide'

export default class AssetCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    return (
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Image source={this.props.image} style={styles.icon} />
          <Text>{this.props.name}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text>{`${this.props.amount} ${this.props.unit || 'THB'}`}</Text>
          {!this.props.isFiat && (
            <Text style={styles.bahtPrice}>{`${(this.props.price || 0) * this.props.amount} THB`}</Text>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    height: 72
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  valueContainer: {
    alignItems: 'flex-end'
  },
  bahtPrice: {
    color: COLORS.N500,
    fontSize: 11
  }
})

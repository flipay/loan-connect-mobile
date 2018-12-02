import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType
} from 'react-native'

import { COLORS } from '../constants/styleGuides'
import Button from './Button'

interface Props {
  id: string
  image: ImageSourcePropType
  name: string
  amount: number
  price?: number
  unit?: string
  isFiat?: boolean
  expanded: boolean
  onPress: () => void
}

export default class AssetCard extends React.Component<
  Props & NavigationScreenProps
> {
  public onPressButton = (side: 'buy' | 'sell') => {
    this.props.navigation.navigate('Trade', {
      side,
      coinId: this.props.id
    })
  }

  public renderBuySellButton() {
    return (
      <View style={styles.buttonsContainer}>
        <Button onPress={() => this.onPressButton('buy')}>Buy</Button>
        <Button onPress={() => this.onPressButton('sell')}>Sell</Button>
      </View>
    )
  }

  public render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <View style={styles.content}>
          <View style={styles.labelContainer}>
            <Image source={this.props.image} style={styles.icon} />
            <Text>{this.props.name}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text>{`${this.props.amount} ${this.props.unit || 'THB'}`}</Text>
            {!this.props.isFiat && (
              <Text style={styles.bahtPrice}>{`${(this.props.price || 0) *
                this.props.amount} THB`}</Text>
            )}
          </View>
        </View>
        {this.props.expanded && this.renderBuySellButton()}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 20
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  },
  buttonsContainer: {
    flexDirection: 'row'
  }
})

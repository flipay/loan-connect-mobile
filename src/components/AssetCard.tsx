import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType
} from 'react-native'
import Text from './Text'

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

  public renderLabel () {
    return (
      <View style={styles.labelContainer}>
        <Image source={this.props.image} style={styles.icon} />
        <Text type='headline'>{this.props.name}</Text>
      </View>
    )
  }

  public renderExpandedCardMainContent () {
    return this.props.isFiat
      ? (
        <Text type='title'>
          {`${this.props.amount} THB`}
        </Text>
      ) : (
        <View style={styles.coinMainContent}>
          <Text type='title'>{`${this.props.amount} ${this.props.unit}`}</Text>
          <Text style={styles.bahtPrice}>
            {`${(this.props.price || 0) * this.props.amount} THB`}
          </Text>
        </View>
      )
  }

  public renderExpandedCardDescription () {
    return this.props.isFiat
      ? (
        <Text numberOfLines={2} style={styles.contactUs}>
          To deposit cash in Thai baht, please contact us
        </Text>
      ) : (
        <View style={styles.buttonsContainer}>
          <Button onPress={() => this.onPressButton('buy')}>Buy</Button>
          <View style={styles.spacing} />
          <Button onPress={() => this.onPressButton('sell')}>Sell</Button>
        </View>
      )
  }

  public renderExpandedCard () {
    return (
      <View style={styles.expandedContainer}>
        {this.renderLabel()}
        {this.renderExpandedCardMainContent()}
        {this.renderExpandedCardDescription()}
      </View>
    )
  }

  public renderNormalCard () {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        {this.renderLabel()}
        <View style={styles.valueContainer}>
          <Text type='headline'>{`${this.props.amount} ${this.props.unit || 'THB'}`}</Text>
          {!this.props.isFiat && (
            <Text type='caption' style={styles.bahtPrice}>
              {`${(this.props.price || 0) * this.props.amount} THB`}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  public render () {
    return this.props.expanded
      ? this.renderExpandedCard()
      : this.renderNormalCard()
  }
}

const styles = StyleSheet.create({
  expandedContainer: {
    backgroundColor: COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 194
  },
  container: {
    backgroundColor: COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  coinMainContent: {
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
    color: COLORS.N500
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  spacing: {
    width: 9
  },
  contactUs: {
    paddingHorizontal: 20
  }
})

import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import {
  View,
  StyleSheet,
  Image,
  Animated,
  TouchableWithoutFeedback,
  ImageSourcePropType
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Text, Button, Layer } from '../components'
import { COLORS } from '../constants'
import { AssetId } from '../types'

interface Props {
  id: AssetId
  image: ImageSourcePropType
  name: string
  amount: number
  price?: number
  unit?: string
  isFiat?: boolean
  expanded: boolean
  onPress: () => void
}

interface State {
  cardHeight: Animated.Value
  cardHorizontalMargin: Animated.Value
}

export default class AssetCard extends React.Component<
  Props & NavigationScreenProps,
  State
> {
  public constructor (props: Props & NavigationScreenProps) {
    super(props)
    this.state = {
      cardHeight: new Animated.Value(80),
      cardHorizontalMargin: new Animated.Value(12)
    }
  }

  public componentDidUpdate (prevProps: Props & NavigationScreenProps) {
    if (!prevProps.expanded && this.props.expanded) {
      Animated.parallel([
        Animated.timing(this.state.cardHeight, {
          toValue: 194,
          duration: 300
        }),
        Animated.timing(this.state.cardHorizontalMargin, {
          toValue: 8,
          duration: 300
        })
      ]).start()
    } else if (prevProps.expanded && !this.props.expanded) {
      Animated.parallel([
        Animated.timing(this.state.cardHeight, {
          toValue: 80,
          duration: 300
        }),
        Animated.timing(this.state.cardHorizontalMargin, {
          toValue: 12,
          duration: 300
        })
      ]).start()
    }
  }

  public onPressButton = (side: 'buy' | 'sell') => {
    this.props.navigation.navigate('Trade', {
      side,
      assetId: this.props.id,
      remainingBalance: side ? 3000 : 1
    })
  }

  public renderLabel () {
    return (
      <View style={styles.labelContainer}>
        <Image source={this.props.image} style={styles.coinIcon} />
        <Text type='headline'>{this.props.name}</Text>
      </View>
    )
  }

  public renderExpandedCardMainContent () {
    return this.props.isFiat ? (
      <Text type='title'>{`${this.props.amount} THB`}</Text>
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
    return this.props.isFiat ? (
      <Text numberOfLines={2} style={styles.contactUs} color={COLORS.N500}>
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

  public render () {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <Animated.View
          style={{
            height: this.state.cardHeight,
            marginHorizontal: this.state.cardHorizontalMargin
          }}
        >
          <Layer style={[styles.container, this.props.expanded && styles.expandedContainer]}>
            {this.renderLabel()}
            {!this.props.expanded && (
              <View style={styles.rightSection}>
                <View style={styles.valueContainer}>
                  <Text type='headline'>
                    {`${this.props.amount} ${this.props.unit || 'THB'}`}
                  </Text>
                  {!this.props.isFiat && (
                    <Text type='caption' style={styles.bahtPrice}>
                      {`${(this.props.price || 0) * this.props.amount} THB`}
                    </Text>
                  )}
                </View>
                <FontAwesome name='angle-down' size={16} color={COLORS.N400} />
              </View>
            )}
            {this.props.expanded && this.renderExpandedCardMainContent()}
            {this.props.expanded && this.renderExpandedCardDescription()}
            {this.props.expanded && (
              <FontAwesome
                name='angle-up'
                size={16}
                color={COLORS.N400}
                style={styles.upIcon}
              />
            )}
          </Layer>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  expandedContainer: {
    flexDirection: 'column',
    position: 'relative',
    shadowOffset: { height: 4, width: 0 }
  },
  container: {
    height: '100%',
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  coinMainContent: {
    alignItems: 'center'
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  coinIcon: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  upIcon: {
    position: 'absolute',
    right: 22,
    top: 24
  },
  valueContainer: {
    alignItems: 'flex-end',
    marginRight: 12
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
    paddingHorizontal: 40,
    textAlign: 'center'
  }
})

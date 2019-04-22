import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import Button from './Button'
import Asset from './Asset'
import Value from './Value'
import Layer from './Layer'
import { COLORS } from '../constants'
import { AssetId } from '../types'
import { Amplitude } from 'expo'

interface Props {
  id: AssetId
  cash: number
  amount: number
  price?: number
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

  public onPressDepositButton = () => {
    this.props.navigation.navigate('Deposit')
  }

  public onPressWithdrawButton = () => {
    this.props.navigation.navigate('Withdrawal')
  }

  public onPressButton = (side: 'buy' | 'sell') => {
    Amplitude.logEventWithProperties('main/trade-button', {
      assetId: this.props.id,
      side
    })
    this.props.navigation.navigate('Trade', {
      side,
      assetId: this.props.id,
      remainingBalance:
        side === 'buy'
          ? this.props.cash
          : this.props.amount
    })
  }

  public renderExpandedCardMainContent () {
    return this.props.id === 'THB' ? (
      <Value assetId='THB' fontType='title'>
        {this.props.amount}
      </Value>
    ) : (
      <View style={styles.coinMainContent}>
        <Value assetId={this.props.id} fontType='title'>
          {this.props.amount}
        </Value>
        <Value assetId='THB' fontType='body'>
          {(this.props.price || 0) * this.props.amount}
        </Value>
      </View>
    )
  }

  public renderExpandedCardDescription () {
    const ActionBotton = (props: any) => <Button {...props} style={styles.button} />
    return this.props.id === 'THB' ? (
      <View style={styles.buttonsContainer}>
        <ActionBotton onPress={this.onPressDepositButton}>Deposit</ActionBotton>
        <View style={styles.spacing} />
        <ActionBotton onPress={this.onPressWithdrawButton}>Withdraw</ActionBotton>
      </View>
    ) : (
      <View style={styles.buttonsContainer}>
        <ActionBotton onPress={() => this.onPressButton('buy')}>Buy</ActionBotton>
        <View style={styles.spacing} />
        <ActionBotton onPress={() => this.onPressButton('sell')}>Sell</ActionBotton>
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
          <Layer
            style={[
              styles.container,
              this.props.expanded && styles.expandedContainer
            ]}
          >
            <Asset id={this.props.id} />
            {!this.props.expanded && (
              <View style={styles.rightSection}>
                <View style={styles.valueContainer}>
                  <Value assetId={this.props.id} fontType='headline'>
                    {this.props.amount}
                  </Value>
                  {this.props.id !== 'THB' && <Value assetId='THB' fontType='caption'>
                    {(this.props.price || 1) * this.props.amount}
                  </Value>}
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
  button: {
    flex: 1
  }
})

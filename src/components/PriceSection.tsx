import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import _ from 'lodash'
import { COLORS } from '../constants'
import { OrderType } from '../types'
import Text from './Text'
import OrderTypeIcon from './OrderTypeIcon'
import Link from './Link'
import Value from './Value'

interface Props {
  orderType: OrderType

  // for market order
  renderSavedAmount?: () => any

  // for Limit order
  price?: number
  onPressEditLink?: () => void
}

export default class PriceSection extends React.Component<Props> {
  public renderPrice () {
    if (this.props.orderType === 'market') {
      return this.props.price ? (
        <Value assetId='THB'>{this.props.price}</Value>
      ) : (
        <Text color={COLORS.N400}>Waiting for input...</Text>
      )
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        {this.props.price ? (
          <Value assetId='THB'>{this.props.price}</Value>
        ) : (
          <Text>-</Text>
        )}
        {this.props.onPressEditLink && (
          <Link onPress={this.props.onPressEditLink} style={styles.editLink}>
            Edit
          </Link>
        )}
      </View>
    )
  }
  public render () {
    return (
      <View style={styles.priceSection}>
        <View style={styles.leftPriceSection}>
          <OrderTypeIcon
            type={this.props.orderType}
            size={20}
            style={styles.orderTypeIcon}
          />
          <View style={styles.line} />
          <View style={styles.priceSectionMargin}>
            <Text
              type='caption'
              color={COLORS.N500}
              style={{ marginBottom: 2 }}
            >
              {`${_.capitalize(this.props.orderType)} price`}
            </Text>
            {this.renderPrice()}
          </View>
        </View>
        {this.props.renderSavedAmount && (
          <View style={styles.rightPriceSection}>
            {this.props.renderSavedAmount()}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  leftPriceSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightPriceSection: {
    justifyContent: 'center'
  },
  priceSectionMargin: {
    marginVertical: 28
  },
  line: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.N200,
    position: 'relative',
    left: -19
  },
  orderTypeIcon: {
    marginRight: 8,
    zIndex: 1
  },
  saveAmount: {
    alignItems: 'center'
  },
  editLink: {
    marginLeft: 8
  }
})

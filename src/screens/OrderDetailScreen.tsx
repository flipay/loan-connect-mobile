import * as React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Screen, Asset, Value, Text, Price } from '../components'
import { COLORS } from '../constants'

export default class OrderDetailScreen extends React.Component<
  NavigationScreenProps
> {
  public onPressBackButton = () => {
    this.props.navigation.navigate('Crypto')
  }

  public renderMain () {
    const order = this.props.navigation.getParam('order')
    return (
      <View style={styles.main}>
        <Asset id={order.assetId} />
        <Value
          assetId={order.assetId}
          fontType='title'
          bold={true}
          style={styles.cryptoAmount}
        >
          {order.cryptoAmount}
        </Value>
        <View style={styles.price}>
          <Text color={COLORS.N600}>{`Price `}</Text>
          <Price color={COLORS.N600}>{order.price}</Price>
        </View>
      </View>
    )
  }

  public renderDetailRow (label: string, value: any) {
    return (
      <View style={styles.detailRow}>
        <Text color={COLORS.N500}>{label}</Text>
        {typeof value === 'string' ? (
          <Text color={COLORS.N800}>{value}</Text>
        ) : (
          <View>{value}</View>
        )}
      </View>
    )
  }

  public renderDetail () {
    const order = this.props.navigation.getParam('order')
    return (
      <View style={styles.detail}>
        {this.renderDetailRow(
          'Type',
          `${_.capitalize(order.type)} ${_.capitalize(order.side)}`
        )}

        {this.renderDetailRow('Status', 'Filled')}
        {this.renderDetailRow(
          order.side === 'buy' ? 'Paid' : 'Received',
          <Value assetId='THB'>{order.thbAmount}</Value>
        )}
        {this.renderDetailRow(
          'Submitted',
          `${moment(order.created).format('MMM D, YYYY')} at ${moment(
            order.created
          ).format('hh:MM A')}`
        )}
      </View>
    )
  }

  public render () {
    return (
      <Screen
        backButtonType='close'
        noHeaderLine={true}
        header='Order detail'
        onPressBackButton={this.onPressBackButton}
      >
        {this.renderMain()}
        {this.renderDetail()}
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13
  },
  main: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center'
  },
  cryptoAmount: {
    marginTop: 14,
    marginBottom: 6
  },
  price: {
    flexDirection: 'row'
  },
  detail: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.N200
  }
})

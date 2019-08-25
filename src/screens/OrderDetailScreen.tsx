import * as React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Screen, Asset, Value, Text } from '../components'
import { COLORS } from '../constants'

export default class OrderDetailScreen extends React.Component<
  NavigationScreenProps
> {
  public onPressBackButton = () => {
    this.props.navigation.goBack()
  }

  public renderMain () {
    const order = this.props.navigation.getParam('order')
    return (
      <View style={styles.main}>
        <Asset id={order.assetId} />
        <Value assetId={order.assetId} fontType='title' bold={true} style={styles.cryptoAmount}>
          {order.cryptoAmount}
        </Value>
        <Text>Waiting for Status</Text>
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
        {this.renderDetailRow('Submitted', moment(order.created).format('MMM D'))}
        {this.renderDetailRow('Status', 'No Status yet')}
        {this.renderDetailRow(
          'Submitted',
          <Value assetId='THB'>{order.thbAmount}</Value>
        )}
      </View>
    )
  }

  public render () {
    return (
      <Screen noHeaderLine={true} header='Order detail' onPressBackButton={this.onPressBackButton}>
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
  detail: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.N200
  }
})

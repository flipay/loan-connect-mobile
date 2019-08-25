import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Text, Screen, Asset, Button, Layer, ChangeBox } from '../components'
import { NavigationScreenProps } from 'react-navigation'
import { AssetId, OrderSide } from '../types'
import { ASSETS, COLORS } from '../constants'
import { toString } from '../utils'
import { fetchOrders } from '../requests'
import { logEvent } from '../services/Analytic'
import { WebView } from 'react-native-webview'
import OrderHistory from '../components/OrderHistory'

interface State {
  orders: Array<any>
}

export default class CryptoScreen extends React.Component<
  NavigationScreenProps, State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      orders: []
    }
  }

  public async componentDidMount () {
    const data = await fetchOrders()
    this.setState({
      orders: data
    })
  }

  public onPressBackButton = () => {
    const assetId: AssetId = this.props.navigation.getParam('id')
    logEvent('crypto/press-back-button', { assetId })
    this.props.navigation.goBack()
  }

  public renderSection (content: any, underline: boolean) {
    return (
      <View style={[styles.section, underline && { borderBottomWidth: 1 }]}>
        {content}
      </View>
    )
  }

  public renderPriceSection () {
    const assetId: AssetId = this.props.navigation.getParam('id')
    const price = this.props.navigation.getParam('price')
    const dailyChange = this.props.navigation.getParam('dailyChange')
    const { width } = Dimensions.get('window')
    const color = dailyChange >= 0 ? COLORS.G400 : COLORS.R400
    const height = 200
    const colorCode = color.substring(1)
    return this.renderSection(
      <View style={styles.priceSection}>
        <View style={styles.price}>
          <Text type='large-title'>{toString(price, ASSETS.THB.decimal)}</Text>
          <Text type='headline'>{`  ${ASSETS.THB.unit}`}</Text>
        </View>
        <ChangeBox value={dailyChange} />
        <Text type='caption' style={styles.dailyChange}>
          24hr change
        </Text>
        <WebView
          source={{
            uri: `https://flipay-charts.firebaseapp.com/?crypto=${
              ASSETS[assetId].coinStatsId
            }&width=${width}&height=${height}&color=${colorCode}`
          }}
          scrollEnabled={false}
          style={{ width, height, marginTop: 24 }}
        />
      </View>,
      true
    )
  }

  public renderAboutSection () {
    const assetId: AssetId = this.props.navigation.getParam('id')
    return this.renderSection(
      <View>
        <Text type='title' bold={true}>{`About ${ASSETS[assetId].name}`}</Text>
        <Text style={styles.aboutContent} color={COLORS.N800}>
          {ASSETS[assetId].about}
        </Text>
      </View>,
      true
    )
  }

  public renderHistorySection () {
    return this.renderSection(
      <View>
        <Text type='title' bold={true}>
          History
        </Text>
        {_.map(this.state.orders, order => {
          return (
            <OrderHistory
              key={order.id}
              type={order.type}
              side={order.side}
              assetId={order.assetId}
              cryptoAmount={order.cryptoAmount}
              thbAmount={order.thbAmount}
              time={order.created}
              status={order.status}
            />
          )
        })}
      </View>,
      false
    )
  }

  public onPressTradeButton = (side: OrderSide) => {
    const assetId: AssetId = this.props.navigation.getParam('id')
    logEvent('crypto/press-trade-button', { assetId, side })
    this.props.navigation.navigate('Trade', { side, assetId })
  }

  public renderHeader = () => {
    const assetId: AssetId = this.props.navigation.getParam('id')
    return <Asset id={assetId} withUnit={true} />
  }

  public renderFooter = () => {
    return (
      <Layer style={styles.footer}>
        <Button
          primary={true}
          onPress={() => this.onPressTradeButton('buy')}
          style={styles.tradeButton}
        >
          Buy
        </Button>
        <View style={styles.space} />
        <Button
          primary={true}
          onPress={() => this.onPressTradeButton('sell')}
          style={styles.tradeButton}
        >
          Sell
        </Button>
      </Layer>
    )
  }

  public render () {
    return (
      <Screen
        header={this.renderHeader}
        renderFooter={this.renderFooter}
        onPressBackButton={this.onPressBackButton}
      >
        <View style={{ flex: 1 }}>
          {this.renderPriceSection()}
          {this.renderAboutSection()}
          {this.renderHistorySection()}
        </View>
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    borderBottomColor: COLORS.N200
  },
  priceSection: {
    alignItems: 'center'
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  dailyChange: {
    marginTop: 5
  },
  aboutContent: {
    marginTop: 16
  },
  tradeButton: {
    flex: 1
  },
  footer: {
    shadowRadius: 1,
    shadowOpacity: 0.05,
    shadowOffset: { height: -3, width: 0 },
    borderBottomWidth: 0,
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 46
  },
  space: {
    width: 11
  }
})


import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import { Text, Screen, Asset, Button, Layer, ChangeBox } from '../components'
import { NavigationScreenProps } from 'react-navigation'
import { AssetId, OrderType } from '../types'
import { ASSETS, COLORS } from '../constants'
import { toString } from '../utils'
import { logEvent } from '../analytics'

export default class CryptoScreen extends React.Component<NavigationScreenProps> {
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
    const price = this.props.navigation.getParam('price')
    const dailyChange = this.props.navigation.getParam('dailyChange')
    return this.renderSection(
      <View style={styles.priceSection}>
        <View style={styles.price}>
          <Text type='large-title'>{toString(price, ASSETS.THB.decimal)}</Text>
          <Text type='headline'>{`  ${ASSETS.THB.unit}`}</Text>
        </View>
        <ChangeBox value={dailyChange} />
        <Text type='caption' style={styles.dailyChange}>24hr change</Text>
      </View>
    , true)
  }

  public renderAboutSection () {
    const assetId: AssetId = this.props.navigation.getParam('id')
    return this.renderSection(
      <View>
        <Text type='title' bold={true}>{`About ${ASSETS[assetId].name}`}</Text>
        <Text style={styles.aboutContent} color={COLORS.N800}>{ASSETS[assetId].about}</Text>
      </View>
    , false)
  }

  public onPressTradeButton = (side: OrderType) => {
    const assetId: AssetId = this.props.navigation.getParam('id')
    logEvent('crypto/press-trade-button', { assetId, side })
    this.props.navigation.navigate('Trade', { side, assetId })
  }

  public renderTitle = () => {
    const assetId: AssetId = this.props.navigation.getParam('id')
    return <Asset id={assetId} withUnit={true} />
  }

  public renderFooter = () => {
    return (
      <Layer style={styles.footer}>
        <Button primary={true} onPress={() => this.onPressTradeButton('buy')} style={styles.tradeButton}>Buy</Button>
        <View style={styles.space} />
        <Button primary={true} onPress={() => this.onPressTradeButton('sell')} style={styles.tradeButton}>Sell</Button>
      </Layer>
    )
  }

  public render () {
    return (
      <Screen
        title={this.renderTitle}
        renderFooter={this.renderFooter}
        onPressBackButton={this.onPressBackButton}
      >
        {() => (
          <View style={{ flex: 1 }}>
            {this.renderPriceSection()}
            {this.renderAboutSection()}
          </View>
        )}
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
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 46
  },
  space: {
    width: 11
  }
})
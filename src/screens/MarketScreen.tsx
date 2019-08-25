import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Text, Layer, ChangeBox, ScreenWithCover, Price } from '../components'
import { ASSETS, COLORS } from '../constants'
import { MarketPrices, Asset } from '../types'
import { logEvent } from '../services/Analytic'

interface Props {
  marketPrices?: MarketPrices
  fetchMarketPrices: () => void
}

interface State {
  refreshing: boolean
}

export default class MarketScreen extends React.Component<Props & NavigationScreenProps, State> {

  constructor (props: Props & NavigationScreenProps) {
    super(props)
    this.state = {
      refreshing: false
    }
  }
  public componentDidMount () {
    this.props.fetchMarketPrices()
  }

  public onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.props.fetchMarketPrices()
    this.setState({ refreshing: false })
  }

  public onPressAsset = (crypto: Asset) => {
    logEvent('market/press-crypto-row', { assetId: crypto.id })
    this.props.navigation.navigate('Crypto', crypto)
  }

  public renderCryptoIdentity (crypto: Asset) {
    return (
      <View style={styles.cryptoIdentity}>
        <Image
          source={crypto.image}
          style={{
            width: 16,
            height: 16,
            marginRight: 8,
            marginTop: 4
          }}
        />
        <View style={styles.cryptoText}>
          <Text type='headline'>
            {crypto.name}
          </Text>
          <Text type='caption'>{crypto.unit}</Text>
        </View>
      </View>
    )
  }

  public renderPriceDetail (crypto: Asset) {
    return (
      <View style={styles.priceContainer}>
        {typeof crypto.price === 'number' && <Price style={styles.price}>{crypto.price}</Price>}
      </View>
    )
  }

  public renderDailyChange (crypto: Asset) {
    return (
      <View style={styles.dailyChange}>
        {typeof crypto.dailyChange === 'number' && <ChangeBox value={crypto.dailyChange} style={styles.changeBox} />}
      </View>
    )
  }

  public renderCrypto (crypto: Asset, index: number) {
    return (
      <View key={index} style={styles.cryptoContainer}>
        <TouchableOpacity style={styles.crypto} onPress={() => this.onPressAsset(crypto)}>
          {this.renderCryptoIdentity(crypto)}
          {this.renderPriceDetail(crypto)}
          {this.renderDailyChange(crypto)}
        </TouchableOpacity>
        {index !== _.map(this.props.marketPrices).length - 2 && <View style={styles.line} />}
      </View>
    )
  }

  public renderMarketData () {
    const cryptos = _(ASSETS)
      .map((asset) => ({ ...asset, ...this.props.marketPrices[asset.id] }))
      .reject((asset) => asset.id === 'THB')
      .sortBy((asset) => asset.order)
      .value()
    return (
      <Layer>
        {_.map(cryptos, (crypto, index) => this.renderCrypto(crypto, index))}
      </Layer>
    )
  }

  public renderHeader () {
    return (
      <View style={styles.headerContent}>
        <Text type='large-title' bold={true} color={COLORS.WHITE}>Market</Text>
        <Text color={COLORS.WHITE}>See what's going on in crypto market</Text>
      </View>
    )
  }

  public render () {
    return (
      <ScreenWithCover
        header={this.renderHeader()}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
      >
        {this.renderMarketData()}
      </ScreenWithCover>
    )
  }
}

const styles = StyleSheet.create({
  headerContent: {
    marginBottom: 24
  },
  cryptoContainer: {
  },
  crypto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 80,
    paddingVertical: 16
  },
  cryptoIdentity: {
    width: '40%',
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  cryptoText: {
    flex: 1
  },
  priceContainer: {
    width: '32%',
    paddingLeft: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  price: {
    flex: 1,
    textAlign: 'right'
  },
  dailyChange: {
    width: '28%',
    paddingLeft: 8,
    paddingRight: 12,
    flexDirection: 'row'
  },
  changeBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  line: {
    height: 1,
    backgroundColor: COLORS.N200
  }
})
import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Text, Layer, Value, ChangeBox, ScreenWithCover } from '../components'
import { ASSETS, COLORS } from '../constants'
import { MarketPrices, Asset } from '../types'

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
    this.props.navigation.navigate('Asset', crypto)
  }

  public renderAssetIdentity (crypto: Asset) {
    return (
      <View style={styles.assetIdentity}>
        <Image
          source={crypto.image}
          style={{
            width: 24,
            height: 24,
            marginRight: 8
          }}
        />
        <View>
          <Text type='headline'>{crypto.name}</Text>
          <Text type='caption'>{crypto.unit}</Text>
        </View>
      </View>
    )
  }

  public renderPriceDetail (crypto: Asset) {
    return (
      <View style={styles.priceDetail}>
        {crypto.price && <Value assetId='THB' style={styles.price}>{crypto.price}</Value>}
        {crypto.dailyChange && <ChangeBox value={crypto.dailyChange} style={styles.changeBox} />}
      </View>
    )
  }

  public renderCrypto (crypto: Asset, index: number) {
    return (
      <View key={index} style={styles.assetContainer}>
        <TouchableOpacity style={styles.asset} onPress={() => this.onPressAsset(crypto)}>
          {this.renderAssetIdentity(crypto)}
          {this.renderPriceDetail(crypto)}
        </TouchableOpacity>
        {index !== _.map(this.props.marketPrices).length - 1 && <View style={styles.line} />}
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
  assetContainer: {
    paddingHorizontal: 12
  },
  asset: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 22
  },
  assetIdentity: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  price: {
    flex: 1,
    textAlign: 'right',
    justifyContent: 'flex-end'
  },
  changeBox: {
    marginLeft: 10,
    width: 80,
    justifyContent: 'center'
  },
  line: {
    height: 1,
    backgroundColor: COLORS.N200
  }
})
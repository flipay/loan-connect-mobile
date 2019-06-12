import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Text, Layer, Value, ChangeBox, ScreenWithCover } from '../components'
import { AssetId } from '../types'
import { ASSETS, COLORS } from '../constants'

interface MarketPrice {
  id: AssetId
  price: number,
  dailyChange: number
}

interface Props {
  marketPrices: Array<MarketPrice>
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

  public onPressAsset = (marketPrice: MarketPrice) => {
    this.props.navigation.navigate('Asset', marketPrice)
  }

  public renderAssetIdentity (marketPrice: MarketPrice) {
    return (
      <View style={styles.assetIdentity}>
        <Image
          source={ASSETS[marketPrice.id].image}
          style={{
            width: 24,
            height: 24,
            marginRight: 8
          }}
        />
        <View>
          <Text type='headline'>{ASSETS[marketPrice.id].name}</Text>
          <Text type='caption'>{ASSETS[marketPrice.id].unit}</Text>
        </View>
      </View>
    )
  }

  public renderPriceDetail (marketPrice: MarketPrice) {
    return (
      <View style={styles.priceDetail}>
        <Value assetId='THB' style={styles.price}>{marketPrice.price}</Value>
        <ChangeBox value={marketPrice.dailyChange} style={styles.changeBox} />
      </View>
    )
  }

  public renderAsset (marketPrice: MarketPrice, index: number) {
    return (
      <View key={marketPrice.id} style={styles.assetContainer}>
        <TouchableOpacity style={styles.asset} onPress={() => this.onPressAsset(marketPrice)}>
          {this.renderAssetIdentity(marketPrice)}
          {this.renderPriceDetail(marketPrice)}
        </TouchableOpacity>
        {index !== this.props.marketPrices.length - 1 && <View style={styles.line} />}
      </View>
    )
  }

  public renderMarketData () {
    return (
      <Layer>
        {_.map(this.props.marketPrices, (asset, index) => this.renderAsset(asset, index))}
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
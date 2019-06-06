import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image } from 'react-native'
import { Text, Layer, Value, ChangeBox } from '../components'
import { AssetId } from '../types'
import { ASSETS } from '../constants'

interface Asset {
  id: AssetId
  price: number,
  dailyChange: number
}

interface State {
  assets: Array<Asset>
}

export default class MarketScreen extends React.Component<{}, State> {

  public constructor () {
    super({})
    this.state = {
      assets: []
    }
  }

  public componentDidMount () {
    this.fetchMarketData()
  }

  public fetchMarketData () {
    this.setState({
      assets: [
        {
          id: 'BTC',
          price: 20,
          dailyChange: 30.234234
        },
        {
          id: 'BNB',
          price: 234234234,
          dailyChange: -8.234234
        }
      ]
    })
  }

  public renderAssetIdentity (asset: Asset) {
    return (
      <View>
        <Image source={ASSETS[asset.id].image} />
        <View>
          <Text type='headline'>{ASSETS[asset.id].name}</Text>
          <Text type='caption'>{ASSETS[asset.id].unit}</Text>
        </View>
      </View>
    )
  }

  public renderPriceDetail (asset: Asset) {
    return (
      <View style={styles.priceDetail}>
        <Value assetId='THB'>{asset.price}</Value>
        <ChangeBox value={asset.dailyChange} />
      </View>
    )
  }

  public renderAsset (asset: Asset) {
    return (
      <View style={styles.asset}>
        {this.renderAssetIdentity(asset)}
        {this.renderPriceDetail(asset)}
      </View>
    )
  }

  public renderMarketData () {
    return (
      <Layer>
        {_.map(this.state.assets, asset => this.renderAsset(asset))}
      </Layer>
    )
  }

  public render () {
    return (
      <View style={{ flex: 1 }}>
        <Text type='large-title'>Market</Text>
        <Text type='body'>See what's going on in crypto market</Text>
        {this.renderMarketData()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  asset: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priceDetail: {
    flex: 1,
    flexDirection: 'row'
  },
  changeBox: {
    flexDirection: 'row'
  }
})
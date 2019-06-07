import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Text, Layer, Value, ChangeBox } from '../components'
import { AssetId } from '../types'
import { ASSETS, COLORS } from '../constants'

interface Asset {
  id: AssetId
  price: number,
  dailyChange: number
}

interface State {
  assets: Array<Asset>
}

export default class MarketScreen extends React.Component<NavigationScreenProps, State> {

  public constructor (props: NavigationScreenProps) {
    super(props)
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

  public onPressAsset = (asset: Asset) => {
    this.props.navigation.navigate('Asset', asset)
  }

  public renderAssetIdentity (asset: Asset) {
    return (
      <View style={styles.assetIdentity}>
        <Image source={ASSETS[asset.id].image} style={styles.icon}/>
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
        <Value assetId='THB' style={styles.price}>{asset.price}</Value>
        <ChangeBox value={asset.dailyChange} />
      </View>
    )
  }

  public renderAsset (asset: Asset, index: number) {
    return (
      <View key={asset.id} style={styles.assetContainer}>
        <TouchableOpacity style={styles.asset} onPress={() => this.onPressAsset(asset)}>
          {this.renderAssetIdentity(asset)}
          {this.renderPriceDetail(asset)}
        </TouchableOpacity>
        {index !== this.state.assets.length - 1 && <View style={styles.line} />}
      </View>
    )
  }

  public renderMarketData () {
    return (
      <Layer>
        {_.map(this.state.assets, (asset, index) => this.renderAsset(asset, index))}
      </Layer>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text type='large-title'>Market</Text>
        <Text type='body'>See what's going on in crypto market</Text>
        {this.renderMarketData()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: COLORS.N100
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
  icon: {
    width: 24,
    height: 24,
    marginRight: 8
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
  line: {
    height: 1,
    backgroundColor: COLORS.N200
  }
})
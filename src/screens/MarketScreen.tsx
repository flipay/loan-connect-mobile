import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Text, Layer, Value, ChangeBox, Screen } from '../components'
import { AssetId } from '../types'
import { ASSETS, COLORS } from '../constants'
import { fetchPriceDataSet } from '../requests'
import { PricesContextConsumer } from '../context';
import { ScrollView } from 'react-native-gesture-handler';

interface PriceData {
  id: AssetId
  price: number,
  dailyChange: number
}

interface State {
  priceDataSet: Array<PriceData>
}

export default class MarketScreen extends React.Component<NavigationScreenProps, State> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      priceDataSet: []
    }
  }

  public componentDidMount () {
    this.fetchMarketData()
  }

  public async fetchMarketData () {
    const marketPrices = await fetchPriceDataSet()
    this.setState({ priceDataSet: marketPrices })
  }

  public onPressAsset = (priceData: PriceData) => {
    this.props.navigation.navigate('Asset', priceData)
  }

  public renderAssetIdentity (priceData: PriceData) {
    return (
      <View style={styles.assetIdentity}>
        <Image
          source={ASSETS[priceData.id].image}
          style={{
            width: 24,
            height: 24,
            marginRight: 8
          }}
        />
        <View>
          <Text type='headline'>{ASSETS[priceData.id].name}</Text>
          <Text type='caption'>{ASSETS[priceData.id].unit}</Text>
        </View>
      </View>
    )
  }

  public renderPriceDetail (priceData: PriceData) {
    return (
      <View style={styles.priceDetail}>
        <Value assetId='THB' style={styles.price}>{priceData.price}</Value>
        <ChangeBox value={priceData.dailyChange} />
      </View>
    )
  }

  public renderAsset (priceData: PriceData, index: number) {
    return (
      <View key={priceData.id} style={styles.assetContainer}>
        <TouchableOpacity style={styles.asset} onPress={() => this.onPressAsset(priceData)}>
          {this.renderAssetIdentity(priceData)}
          {this.renderPriceDetail(priceData)}
        </TouchableOpacity>
        {index !== this.state.priceDataSet.length - 1 && <View style={styles.line} />}
      </View>
    )
  }

  public renderMarketData () {
    return (
      <Layer>
        {_.map(this.state.priceDataSet, (asset, index) => this.renderAsset(asset, index))}
      </Layer>
    )
  }

  public render () {
    return (
      <ScrollView style={styles.screen}>
        <View style={styles.headerBackground} />
        <View style={styles.screenContent}>
          <View style={styles.headerContent}>
            <Text type='large-title' color={COLORS.WHITE}>Market</Text>
            <Text color={COLORS.WHITE}>See what's going on in crypto market</Text>
          </View>
          {this.renderMarketData()}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  headerBackground: {
    backgroundColor: 'purple',
    height: 206
  },
  screenContent: {
    paddingHorizontal: 12,
    position: 'relative',
    top: -126
  },
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
  line: {
    height: 1,
    backgroundColor: COLORS.N200
  }
})
import * as React from 'react'
import { ScrollView, StatusBar, View, StyleSheet } from 'react-native'
import { LinearGradient, Amplitude } from 'expo'
import { NavigationScreenProps } from 'react-navigation'
import { Text, AssetCard } from '../components'
import { COLORS } from '../constants'
import { AssetId, Asset } from '../types'
import { getPortfolio } from '../requests'

interface Card {
  id: AssetId,
  amount: number,
  price: number,
}

interface State {
  selectedAsset?: AssetId | null
  assets: Array<Asset>
}

export default class MainScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      selectedAsset: null,
      assets: []
    }
  }

  public async componentDidMount () {
    try {
      const assets = await getPortfolio()
      this.setState({ assets })
    } catch (error) {
      console.log('======= error ========', error) 
    }
  }

  public onPress = (assetId: AssetId) => {
    if (this.state.selectedAsset === assetId) {
      Amplitude.logEventWithProperties('main/close-asset-card', { assetId: assetId })
      this.setState({ selectedAsset: null })
    } else {
      Amplitude.logEventWithProperties('main/open-asset-card', { assetId: assetId })
      this.setState({ selectedAsset: assetId })
    }
  }

  public renderHeader () {
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={styles.header}
      >
        <Text type='caption' color={COLORS.P100}>
          TOTAL VALUE
        </Text>
        <Text style={styles.totalValueContainer}>
          <Text color={COLORS.WHITE}>฿</Text>
          <Text type='large-title' style={styles.totalValue} color={COLORS.WHITE}>
            {' '}
            203,000
          </Text>
        </Text>
      </LinearGradient>
    )
  }

  public render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle='light-content' />
        <ScrollView
          style={{
            backgroundColor: '#fff',
            flex: 1
          }}
        >
          {this.renderHeader()}
          <View style={styles.cardsContainer}>
            {this.state.assets.map((asset: Asset, index) => {
              const expanded =
                !!this.state.selectedAsset &&
                this.state.selectedAsset === asset.id
              return (
                <View key={asset.id}>
                  {index !== 0 && (
                    <View
                      style={expanded ? styles.bigSpace : styles.smallSpace}
                    />
                  )}
                  <AssetCard
                    id={asset.id}
                    amount={asset.amount || 0}
                    price={asset.price}
                    expanded={expanded}
                    onPress={() => this.onPress(asset.id)}
                    navigation={this.props.navigation}
                  />
                  {index !== this.state.assets.length - 1 && (
                    <View
                      style={expanded ? styles.bigSpace : styles.smallSpace}
                    />
                  )}
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    height: 236,
    alignItems: 'center',
    justifyContent: 'center'
  },
  totalValueContainer: {
    color: COLORS.WHITE,
    marginTop: 8
  },
  totalValue: {
    marginLeft: 8
  },
  cardsContainer: {
    position: 'relative',
    top: -24
  },
  bigSpace: {
    height: 12
  },
  smallSpace: {
    height: 4
  }
})

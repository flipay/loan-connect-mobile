import * as React from 'react'
import _ from 'lodash'
import {
  ScrollView,
  RefreshControl,
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { LinearGradient, Amplitude } from 'expo'
import { SimpleLineIcons } from '@expo/vector-icons'
import { NavigationScreenProps } from 'react-navigation'
import { Text, AssetCard } from '../components'
import { COLORS, ASSETS } from '../constants'
import { AssetId, Asset } from '../types'
import { getPortfolio, lock } from '../requests'
import { alert, toString } from '../utils'

interface State {
  selectedAsset?: AssetId | null
  assets: Array<Asset>
  refreshing: boolean
}

export default class MainScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      selectedAsset: null,
      assets: [],
      refreshing: false
    }
  }

  public componentDidMount () {
    this.fetchData()
  }

  public async fetchData () {
    try {
      const assets = await getPortfolio()
      this.setState({ assets })
    } catch (err) {
      alert(err)
    }
  }

  public getSumBalance () {
    return _.sumBy(
      this.state.assets,
      asset => (asset.price || 1) * (asset.amount || 0)
    )
  }

  public onPress = (assetId: AssetId) => {
    if (this.state.selectedAsset === assetId) {
      Amplitude.logEventWithProperties('main/close-asset-card', {
        assetId: assetId
      })
      this.setState({ selectedAsset: null })
    } else {
      Amplitude.logEventWithProperties('main/open-asset-card', {
        assetId: assetId
      })
      this.setState({ selectedAsset: assetId })
    }
  }

  public renderLockButton () {
    return (
      <TouchableOpacity onPress={lock} style={styles.lockButton}>
        <SimpleLineIcons
          name='logout'
          size={24}
          color={COLORS.WHITE}
        />
      </TouchableOpacity>
    )
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
          <Text
            type='large-title'
            style={styles.totalValue}
            color={COLORS.WHITE}
          >
            {` ${toString(this.getSumBalance(), ASSETS.THB.decimal)}`}
          </Text>
        </Text>
        {this.renderLockButton()}
      </LinearGradient>
    )
  }

  public onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.fetchData()
    this.setState({ refreshing: false })
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
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              progressBackgroundColor={COLORS.P400}
              tintColor={COLORS.P400}
            />
          }
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
                    cash={_.get(this.state.assets, '[0].amount', 0)}
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
    position: 'relative',
    backgroundColor: 'blue',
    height: 236,
    alignItems: 'center',
    justifyContent: 'center'
  },
  lockButton: {
    position: 'absolute',
    top: 25,
    right: 10,
    padding: 6,
    transform: [{ rotate: '180deg' }]
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

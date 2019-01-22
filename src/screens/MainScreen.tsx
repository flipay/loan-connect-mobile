import * as React from 'react'
import { ScrollView, StatusBar, View, StyleSheet, ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo'
import { NavigationScreenProps } from 'react-navigation'
import { Text, AssetCard } from '../components'
import { COLORS } from '../constants'
import { AssetId } from '../types'

interface Card {
  id: AssetId,
  amount: number,
  price?: number,
}

const cards: Array<Card> = [
  {
    id: 'THB',
    amount: 3000
  },
  {
    id: 'BTC',
    amount: 1,
    price: 200000
  },
  {
    id: 'ETH',
    amount: 0,
    price: 3000
  },
  {
    id: 'OMG',
    amount: 0,
    price: 300
  }
]

interface State {
  selectedAsset?: AssetId | null
}

export default class MainScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      selectedAsset: null
    }
  }

  public onPress = (assetId: AssetId) => {
    if (this.state.selectedAsset === assetId) {
      this.setState({ selectedAsset: null })
    } else {
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
            {cards.map((card: Card, index) => {
              const expanded =
                !!this.state.selectedAsset &&
                this.state.selectedAsset === card.id
              return (
                <View key={card.id}>
                  {index !== 0 && (
                    <View
                      style={expanded ? styles.bigSpace : styles.smallSpace}
                    />
                  )}
                  <AssetCard
                    id={card.id}
                    amount={card.amount}
                    price={card.price}
                    expanded={expanded}
                    onPress={() => this.onPress(card.id)}
                    navigation={this.props.navigation}
                  />
                  {index !== cards.length - 1 && (
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

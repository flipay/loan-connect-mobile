import * as React from 'react'
import { ScrollView, StatusBar, Text, View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo'
import { NavigationScreenProps } from 'react-navigation'
import AssetCard from '../components/AssetCard'
import { COLORS } from '../constants/styleGuides'

const cards = [
  {
    id: 'cash',
    name: 'Cash',
    image: require('../img/btc.png'),
    amount: 3000,
    isFiat: true
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    image: require('../img/btc.png'),
    amount: 1,
    price: 200000,
    unit: 'BTC'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    image: require('../img/btc.png'),
    amount: 0,
    price: 3000,
    unit: 'ETH'
  },
  {
    id: 'omisego',
    name: 'OmiseGo',
    image: require('../img/btc.png'),
    amount: 0,
    price: 300,
    unit: 'OMG'
  }
]

interface State {
  selectedCoin: string | null
}

// tslint:disable-next-line:max-classes-per-file
export default class MainScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  // public static navigationOptions = {
  //   title: 'Home'
  // }
  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      selectedCoin: null
    }
  }

  public onPress = (coinId: string) => {
    if (this.state.selectedCoin === coinId) {
      this.setState({ selectedCoin: null })
    } else {
      this.setState({ selectedCoin: coinId })
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
        <Text style={styles.totalLabel}>TOTAL VALUE</Text>
        <Text style={styles.totalValueContainer}>
          <Text>฿</Text>
          <Text style={styles.totalValue}> 203,000</Text>
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
            {cards.map(card => (
              <AssetCard
                key={card.id}
                id={card.id}
                name={card.name}
                image={card.image}
                amount={card.amount}
                unit={card.unit}
                price={card.price}
                isFiat={card.isFiat}
                expanded={
                  !!this.state.selectedCoin &&
                  this.state.selectedCoin === card.id
                }
                onPress={() => this.onPress(card.id)}
                navigation={this.props.navigation}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    height: 172,
    alignItems: 'center',
    justifyContent: 'center'
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.P100
  },
  totalValueContainer: {
    color: COLORS.WHITE,
    marginTop: 8
  },
  totalValue: {
    marginLeft: 8,
    fontSize: 32
  },
  cardsContainer: {
    position: 'relative',
    top: -24
  }
})

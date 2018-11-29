import * as React from 'react'
import { Text } from 'react-native'
import { Component } from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { ScrollView } from 'react-native'
import AssetCard from '../components/AssetCard'

const cards = [
  {
    name: 'Cash',
    amount: 3000,
    isFiat: true
  }, {
    name: 'Bitcoin',
    amount: 1,
    price: 200000,
    unit: 'BTC'
  },  {
    name: 'Ethereum',
    amount: 0,
    price: 3000,
    unit: 'ETH'
  },   {
    name: 'OmiseGo',
    amount: 0,
    price: 300,
    unit: 'OMG'
  }
]

// tslint:disable-next-line:max-classes-per-file
export class MainScreen extends Component<NavigationScreenProps> {
  public static navigationOptions = {
    title: 'Home'
  }

  public render() {
    return (
      <ScrollView
        style={{
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <Text>
          test
        </Text>
        {cards.map((card) => (
          <AssetCard
            key={card.name}
            name={card.name}
            amount={card.amount}
            unit={card.unit}
            price={card.price}
            isFiat={card.isFiat}
          />
        ))}
      </ScrollView>
    )
  }
}
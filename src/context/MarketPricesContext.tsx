
import * as React from 'react'
import _ from 'lodash'
import { AssetId } from '../types'
import { fetchMarketPrices } from '../requests'

const MarketPricesContext = React.createContext({
  marketPrices: [],
  fetchMarketPrices: _.noop
})

interface MarketPrice {
  id: AssetId
  price: number,
  dailyChange: number
}

interface Props {
  children: any
}

interface State {
  marketPrices: Array<MarketPrice>
}

export const MarketPricesContextConsumer = MarketPricesContext.Consumer

export class MarketPricesContextProvider extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      marketPrices: []
    }
  }

  public fetchMarketPrices = async () => {
    const marketPrices = await fetchMarketPrices()
    this.setState({ marketPrices })
  }

  public render () {
    return (
      <MarketPricesContext.Provider value={{ marketPrices: this.state.marketPrices, fetchMarketPrices: this.fetchMarketPrices }}>
        {this.props.children}
      </MarketPricesContext.Provider>
    )
  }
}
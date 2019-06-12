
import * as React from 'react'
import { MarketPricesContextProvider, MarketPricesContextConsumer } from './MarketPricesContext'

interface Props {
  children: any
}

export class ContextProvider extends React.Component<Props> {
  public render () {
    return (
      <MarketPricesContextProvider>
        {this.props.children}
      </MarketPricesContextProvider>
    )
  }
}

export {
  MarketPricesContextConsumer
}
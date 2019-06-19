
import * as React from 'react'
import { MarketPricesContextProvider, MarketPricesContextConsumer } from './MarketPricesContext'
import { BalancesContextProvider, BalancesContextConsumer } from './BalancesContext'

interface Props {
  children: any
}

export class ContextProvider extends React.Component<Props> {
  public render () {
    return (
      <MarketPricesContextProvider>
        <BalancesContextProvider>
          {this.props.children}
        </BalancesContextProvider>
      </MarketPricesContextProvider>
    )
  }
}

export {
  MarketPricesContextConsumer,
  BalancesContextConsumer
}
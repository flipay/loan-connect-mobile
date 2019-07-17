
import * as React from 'react'
import { MarketPricesContextProvider, MarketPricesContextConsumer } from './MarketPricesContext'
import { BalancesContextProvider, BalancesContextConsumer } from './BalancesContext'
import { RateContextProvider, RateContextConsumer } from './RateContext'

interface Props {
  children: any
}

export class ContextProvider extends React.Component<Props> {
  public render () {
    return (
      <MarketPricesContextProvider>
        <BalancesContextProvider>
          <RateContextProvider>
            {this.props.children}
          </RateContextProvider>
        </BalancesContextProvider>
      </MarketPricesContextProvider>
    )
  }
}

export {
  MarketPricesContextConsumer,
  BalancesContextConsumer,
  RateContextConsumer
}
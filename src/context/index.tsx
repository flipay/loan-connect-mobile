
import * as React from 'react'
import { PricesContextProvider, PricesContextConsumer } from './PricesContext'

interface Props {
  children: any
}

export class ContextProvider extends React.Component<Props> {
  public render () {
    return (
      <PricesContextProvider>
        {this.props.children}
      </PricesContextProvider>
    )
  }
}

export {
  PricesContextConsumer
}
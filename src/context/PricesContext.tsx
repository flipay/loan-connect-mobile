
import * as React from 'react'
import _ from 'lodash'

const PricesContext = React.createContext({
  prices: 0,
  updatePrices: _.noop
})

interface Props {
  children: any
}

interface State {
  prices: number
  updatePrices: () => void
}

export const PricesContextConsumer = PricesContext.Consumer

export class PricesContextProvider extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      prices: 0,
      updatePrices: () => this.setState({ prices: 10 })
    }
  }

  public render () {
    return (
      <PricesContext.Provider value={this.state}>
        {this.props.children}
      </PricesContext.Provider>
    )
  }
}
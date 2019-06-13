
import * as React from 'react'
import _ from 'lodash'
import { Balances } from '../types'
import { fetchBalances } from '../requests'

const BalancesContext = React.createContext({
  balances: undefined,
  fetchBalances: _.noop
})

interface Props {
  children: any
}

interface State {
  balances?: Balances
}

export const BalancesContextConsumer = BalancesContext.Consumer

export class BalancesContextProvider extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      balances: undefined
    }
  }

  public fetchBalances = async () => {
    const balances = await fetchBalances()
    this.setState({ balances })
  }

  public render () {
    return (
      <BalancesContext.Provider value={{ balances: this.state.balances, fetchBalances: this.fetchBalances }}>
        {this.props.children}
      </BalancesContext.Provider>
    )
  }
}
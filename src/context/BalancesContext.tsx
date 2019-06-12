
import * as React from 'react'
import _ from 'lodash'
import { Balance } from '../types'
import { fetchBalances } from '../requests'

const BalancesContext = React.createContext({
  balances: [],
  fetchBalances: _.noop
})

interface Props {
  children: any
}

interface State {
  balances: Array<Balance>
}

export const BalancesContextConsumer = BalancesContext.Consumer

export class BalancesContextProvider extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      balances: []
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
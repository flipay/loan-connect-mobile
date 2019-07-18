
import * as React from 'react'
import _ from 'lodash'
import { THBAmountTypes } from '../constants'

const RateContext = React.createContext({
  lastFetchSuccessfullyTakeAmount: undefined,
  competitorThbAmounts: undefined,
  clearRateDate: _.noop,
  setRateData: _.noop
})

interface Props {
  children: any
}

interface State {
  lastFetchSuccessfullyTakeAmount?: string
  competitorThbAmounts?: THBAmountTypes
}

const initialData = {
  lastFetchSuccessfullyTakeAmount: undefined,
  competitorThbAmounts: undefined
}

export const RateContextConsumer = RateContext.Consumer

export class RateContextProvider extends React.Component<Props, State> {
  public constructor (props: Props) {
    super(props)
    this.state = initialData
  }

  public setRateData = (lastFetchSuccessfullyTakeAmount: string , competitorThbAmounts: THBAmountTypes) => {
    this.setState({
      lastFetchSuccessfullyTakeAmount,
      competitorThbAmounts
    })
  }

  public clearRateData = () => {
    this.setState(initialData)
  }

  public render () {
    return (
      <RateContext.Provider
        value={{
          lastFetchSuccessfullyTakeAmount: this.state.lastFetchSuccessfullyTakeAmount,
          competitorThbAmounts: this.state.competitorThbAmounts,
          setRateData: this.setRateData,
          clearRateData: this.clearRateData
        }}
      >
        {this.props.children}
      </RateContext.Provider>
    )
  }
}
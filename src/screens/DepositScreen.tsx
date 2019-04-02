import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Amplitude } from 'expo'
import { Text, ScreenWithKeyboard, TradeBox } from '../components'
import { deposit, getAllAmounts } from '../requests'
import { toNumber } from '../utils'

interface State {
  amount: string
  active: boolean
}

export default class DepositScreen extends React.Component<
  NavigationScreenProps,
  State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      amount: '',
      active: true
    }
  }

  public onPressBackButton = () => {
    Amplitude.logEvent('deposit/press-back-button')
    this.props.navigation.goBack()
  }

  public onPress = () => {
    this.setState({ active: true })
  }

  public onChangeValue = (value: string) => {
    this.setState({ amount: value })
  }

  public onPressSubmit = () => {
    deposit('THB', toNumber(this.state.amount))
  }

  public render () {
    return (
      <ScreenWithKeyboard
        backButtonType='arrowleft'
        onPressBackButton={this.onPressBackButton}
        activeSubmitButton={!!this.state.amount}
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={false}
      >
        {(autoFocus: boolean) => (
          <View style={styles.body}>
            <Text type='title'>Deposit</Text>
            <TradeBox
              autoFocus={autoFocus}
              description='Deposit amount'
              assetId='THB'
              onPress={this.onPress}
              onChangeValue={this.onChangeValue}
              active={this.state.active}
              value={this.state.amount}
            />
          </View>
        )}
      </ScreenWithKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  }
})

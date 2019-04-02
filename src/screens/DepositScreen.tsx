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
  submitted: boolean
}

export default class DepositScreen extends React.Component<
  NavigationScreenProps,
  State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      amount: '',
      active: true,
      submitted: false
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

  public onPressSubmit = async () => {
    await deposit('THB', toNumber(this.state.amount))
    this.setState({ submitted: true })
  }

  public render () {
    return (
      <ScreenWithKeyboard
        backButtonType='close'
        onPressBackButton={this.onPressBackButton}
        activeSubmitButton={!!this.state.amount}
        submitButtonText={this.state.submitted ? 'OK' : 'Submit'}
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={false}
      >
        {(autoFocus: boolean) => (
          <View style={styles.body}>
            <Text type='title' style={styles.title}>Deposit</Text>
            {!this.state.submitted
              ? (
                <TradeBox
                  autoFocus={autoFocus}
                  description='Deposit amount'
                  assetId='THB'
                  onPress={this.onPress}
                  onChangeValue={this.onChangeValue}
                  active={this.state.active}
                  value={this.state.amount}
                />
              ) : (
                <Text>Submit the transfer receipt to receipt@flipay.co after that, it will be available in your wallet within 24 hours.</Text>
              )
            }
          </View>
        )}
      </ScreenWithKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center'
  },
  title: {
    paddingBottom: 20
  }
})

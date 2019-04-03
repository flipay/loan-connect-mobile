import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Amplitude } from 'expo'
import { Text, ScreenWithKeyboard, TradeBox, TextBox } from '../components'
import { withdraw } from '../requests'
import { toNumber } from '../utils'

const boxes = ['amount', 'accountNumber', 'accountName', 'accountIssuer']
type Box = typeof boxes[number]

interface State {
  amount: string
  accountNumber: string
  accountName: string
  accountissuer: string
  activeBox: Box
  submitted: boolean
}

export default class WithdrawalScreen extends React.Component<
  NavigationScreenProps,
  State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      amount: '',
      accountNumber: '',
      accountName: '',
      accountissuer: '',
      activeBox: 'amount',
      submitted: false
    }
  }

  public onPressBackButton = () => {
    Amplitude.logEvent('deposit/press-back-button')
    this.props.navigation.goBack()
  }

  public onPressBox = (box: Box) => {
    this.setState({ activeBox: box })
  }

  public onChangeValue = (box: Box, value: string) => {
    // TODO: make this work
    // this.setState({ [box]: value })
    if (box === boxes[0]) {
      this.setState({ amount: value })
    } else if (box === boxes[1]) {
      this.setState({ accountNumber: value })
    } else if (box === boxes[2]) {
      this.setState({ accountName: value })
    } else {
      this.setState({ accountissuer: value })
    }
  }

  public onPressSubmit = async () => {
    if (!this.state.submitted) {
      await withdraw(toNumber(this.state.amount))
      this.setState({ submitted: true })
    } else {
      this.props.navigation.goBack()
    }
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
            <Text type='title' style={styles.title}>Withdrawal</Text>
            {!this.state.submitted
              ? (
                <View>
                  <TradeBox
                    autoFocus={autoFocus}
                    description='Withdrawal amount'
                    assetId='THB'
                    onPress={() => this.onPressBox(boxes[0])}
                    onChangeValue={(value) => this.onChangeValue(boxes[0], value)}
                    active={this.state.activeBox === boxes[0]}
                    value={this.state.amount}
                  />
                  <TextBox
                    description='Account number'
                    onPress={() => this.onPressBox(boxes[1])}
                    onChangeValue={(value) => this.onChangeValue(boxes[1], value)}
                    active={this.state.activeBox === boxes[1]}
                    value={this.state.amount}
                  />
                  <TextBox
                    description='Account name'
                    onPress={() => this.onPressBox(boxes[2])}
                    onChangeValue={(value) => this.onChangeValue(boxes[2], value)}
                    active={this.state.activeBox === boxes[2]}
                    value={this.state.amount}
                  />
                  <TextBox
                    description='Bank'
                    onPress={() => this.onPressBox(boxes[3])}
                    onChangeValue={(value) => this.onChangeValue(boxes[3], value)}
                    active={this.state.activeBox === boxes[3]}
                    value={this.state.amount}
                  />
                </View>
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

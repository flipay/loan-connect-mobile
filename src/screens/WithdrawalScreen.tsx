import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import _ from 'lodash'
import { NavigationScreenProps } from 'react-navigation'
import { Text, ScreenWithKeyboard, AssetBox, TextBox, Picker } from '../components'
import { withdraw } from '../requests'
import { toNumber, alert } from '../utils'
import { ACCOUNT_ISSUERS } from '../constants'
import { Issuer } from '../types'
import { logEvent } from '../analytics'

const boxes = ['amount', 'accountNumber', 'accountName']
type Box = typeof boxes[number]

interface State {
  amount: string
  accountNumber: string
  accountName: string
  accountIssuer?: Issuer
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
      accountIssuer: 'kbank',
      activeBox: 'amount',
      submitted: false
    }
  }

  public isSubmitButtonActive = () => {
    if (this.state.amount
      && this.state.accountNumber
      && this.state.accountName
      && this.state.accountIssuer
    ) { return true }
    return false
  }

  public onPressBackButton = () => {
    logEvent('withdrawal/press-back-button')
    this.props.navigation.goBack()
  }

  public onPressAmountBox = () => {
    logEvent('withdrawal/press-amount-box')
    this.setState({ activeBox: 'amount' })
  }

  public onPressAccountNumberBox = () => {
    logEvent('withdrawal/press-account-number-box')
    this.setState({ activeBox: 'accountNumber' })
  }

  public onPressAccountNameBox = () => {
    logEvent('withdrawal/press-account-name-box')
    this.setState({ activeBox: 'accountName' })
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
    }
  }

  public onPressSubmit = async () => {
    if (!this.state.accountIssuer) { return }
    if (!this.state.submitted) {
      logEvent('withdrawal/press-submit-button')
      try {
        await withdraw(
          toNumber(this.state.amount),
          this.state.accountNumber,
          this.state.accountName,
          this.state.accountIssuer
        )
        this.setState({ submitted: true })
      } catch (err) {
        alert(err)
      }
    } else {
      logEvent('withdrawal/press-ok-button')
      this.props.navigation.goBack()
    }
  }

  public onSelectIssuer = (value: Issuer) => {
    logEvent('withdrawal/change-account-issuer')
    this.setState({ accountIssuer: value })
  }

  public render () {
    return (
      <ScreenWithKeyboard
        backButtonType='close'
        onPressBackButton={this.onPressBackButton}
        activeSubmitButton={this.isSubmitButtonActive()}
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
                  <AssetBox
                    autoFocus={autoFocus}
                    description='Withdrawal amount'
                    assetId='THB'
                    onPress={this.onPressAmountBox}
                    onChangeValue={(value) => this.onChangeValue(boxes[0], value)}
                    active={this.state.activeBox === boxes[0]}
                    value={this.state.amount}
                  />
                  <TextBox
                    description='Account number'
                    placeholder='000000'
                    onPress={this.onPressAccountNumberBox}
                    onChangeValue={(value) => this.onChangeValue(boxes[1], value)}
                    active={this.state.activeBox === boxes[1]}
                    value={this.state.accountNumber}
                    numberPad={true}
                  />
                  <TextBox
                    description='Account name'
                    onPress={this.onPressAccountNameBox}
                    onChangeValue={(value) => this.onChangeValue(boxes[2], value)}
                    active={this.state.activeBox === boxes[2]}
                    value={this.state.accountName}
                  />
                  <Text type='caption'>Account Issuer</Text>
                  <Picker
                    selectedValue={this.state.accountIssuer}
                    onValueChange={this.onSelectIssuer}
                    data={ACCOUNT_ISSUERS}
                  />
                </View>
              ) : (
                <Text>We’ll transfer to your bank account within 24 hours. We may reach out to you by phone if we need more information.</Text>
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

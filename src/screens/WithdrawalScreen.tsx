import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import _ from 'lodash'
import { NavigationScreenProps } from 'react-navigation'
import { Text, Screen, TextBox, Picker, AssetBoxWithBalance } from '../components'
import { withdraw } from '../requests'
import { toNumber, toString, alert } from '../utils'
import { ACCOUNT_ISSUERS, ASSETS } from '../constants'
import { Issuer, AssetId } from '../types'
import { logEvent } from '../analytics'

const boxes = ['amount', 'address', 'tag', 'accountName']
type Box = typeof boxes[number]

interface State {
  amount: string
  address: string
  tag: string
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
      address: '',
      tag: '',
      accountName: '',
      accountIssuer: 'kbank',
      activeBox: 'amount',
      submitted: false
    }
  }

  public isSubmitButtonActive = () => {
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'THB')
    if (assetId === 'THB') {
      if (this.state.amount
        && this.state.address
        && this.state.accountName
        && this.state.accountIssuer
      ) { return true }
    } else {
      if (this.state.amount
        && this.state.address
      ) { return true }
    }
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

  public onPressAddressBox = () => {
    logEvent('withdrawal/press-account-number-box')
    this.setState({ activeBox: 'address' })
  }

  public onPressTagBox = () => {
    logEvent('withdrawal/press-tag-box')
    this.setState({ activeBox: 'tag' })
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
      this.setState({ address: value })
    } else if (box === boxes[2]) {
      this.setState({ tag: value })
    } else if (box === boxes[3]) {
      this.setState({ accountName: value })
    }
  }

  public onPressSubmit = async () => {
    if (!this.state.accountIssuer) { return }
    if (!this.state.submitted) {
      logEvent('withdrawal/press-submit-button')
      try {
        const assetId: AssetId = this.props.navigation.getParam('assetId', 'THB')
        await withdraw(
          assetId,
          toNumber(this.state.amount),
          this.state.address,
          this.state.tag,
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

  public renderCashContent () {
    return (
      <View>
        <TextBox
          style={styles.textBox}
          description='Account name'
          autoCorrect={false} // Thai language doesn't handle autocomplete correctly
          onPress={this.onPressAccountNameBox}
          onChangeValue={(value) => this.onChangeValue(boxes[3], value)}
          active={this.state.activeBox === boxes[3]}
          value={this.state.accountName}
        />
        <Text type='caption'>Account Issuer</Text>
        <Picker
          selectedValue={this.state.accountIssuer}
          onValueChange={this.onSelectIssuer}
          data={ACCOUNT_ISSUERS}
        />
      </View>
    )
  }

  public renderResult () {
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'THB')
    const addressType = assetId === 'THB' ? 'bank account' : `${ASSETS[assetId].name} address`
    return (
      <View style={styles.resultContainer}>
        <Text>{`We’ll transfer to your ${addressType} within 24 hours. We may reach out to you by phone if we need more information.`}</Text>
      </View>
    )
  }

  public render () {
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'THB')
    const remainingBalance = this.props.navigation.getParam('remainingBalance')
    const description = `${ASSETS[assetId].name} address`
    return (
      <Screen
        backButtonType='close'
        onPressBackButton={this.onPressBackButton}
        activeSubmitButton={this.isSubmitButtonActive()}
        submitButtonText={this.state.submitted ? 'OK' : 'Submit'}
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={false}
        title={`Withdraw ${ASSETS[assetId].name}`}
      >
        {(autoFocus: boolean) => (
          <View style={styles.container}>
            {this.state.submitted
              ? this.renderResult()
              : (
                <View>
                  <View style={styles.content}>
                    <AssetBoxWithBalance
                      autoFocus={autoFocus}
                      description='Withdrawal amount'
                      assetId={assetId}
                      onPress={this.onPressAmountBox}
                      onChangeValue={(value) => this.onChangeValue(boxes[0], value)}
                      active={this.state.activeBox === boxes[0]}
                      value={this.state.amount}
                      balance={remainingBalance}
                      onPressMax={() => this.setState({ amount: toString(remainingBalance, ASSETS[assetId].decimal) })}
                      onPressHalf={() => this.setState({ amount: toString(remainingBalance / 2, ASSETS[assetId].decimal) })}
                    />
                    <TextBox
                      style={styles.textBox}
                      description={assetId === 'THB' ? 'Account number' : description}
                      onPress={this.onPressAddressBox}
                      onChangeValue={(value) => this.onChangeValue(boxes[1], value)}
                      active={this.state.activeBox === boxes[1]}
                      value={this.state.address}
                      numberPad={assetId === 'THB'}
                    />
                    {ASSETS[assetId].tag && <TextBox
                      description='Tag name'
                      onPress={this.onPressTagBox}
                      onChangeValue={(value) => this.onChangeValue(boxes[2], value)}
                      active={this.state.activeBox === boxes[2]}
                      value={this.state.tag}
                      numberPad={true}
                    />}
                    {assetId === 'THB' && this.renderCashContent()}
                  </View>
                </View>
              )
            }
          </View>
        )}
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    width: '100%'
  },
  resultContainer: {
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20
  },
  content: {
    width: '100%'
  },
  textBox: {
    marginBottom: 16
  }
})

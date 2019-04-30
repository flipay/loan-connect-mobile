import * as React from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Amplitude } from 'expo'
import { Text, ScreenWithKeyboard, AssetBox, Value } from '../components'
import { deposit } from '../requests'
import { toNumber } from '../utils'
import { COLORS } from '../constants'

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
    if (!this.state.submitted) {
      await deposit('THB', toNumber(this.state.amount))
      this.setState({ submitted: true })
    } else {
      this.props.navigation.goBack()
    }
  }

  public renderSteps () {
    return (
      <View>
        <Text type='button'>How to cash in by bank transfer</Text>
        <Text type='button' color={COLORS.N700}>
          <Text>1. Transfer </Text>
          <Value assetId='THB'>{toNumber(this.state.amount)}</Value>
         <Text>cash in amount to following account.</Text>
        </Text>
        <View style={styles.transferDetail}>
          <View style={styles.depositBank}>
            <Image source={require('../img/bank_bbl.png')} style={{ width: 20, height: 20 }}/>
            <Text type='button' color={COLORS.N800} style={styles.bank}>Bangkok Bank</Text>
          </View>
          <View style={styles.transferDetailTable}>
            <View style={styles.labelColumn}>
              <Text color={COLORS.N600} style={styles.row}>Acc No.</Text>
              <Text color={COLORS.N600}>Name</Text>
            </View>
            <View>
              <Text color={COLORS.N800} style={styles.row}>855-0-51723-2</Text>
              <Text color={COLORS.N800}>นาย ภาณุมาชร์ อนันตชัยวณิช</Text>
            </View>
          </View>
        </View>
      </View>
    )
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
                <AssetBox
                  autoFocus={autoFocus}
                  description='Deposit amount'
                  assetId='THB'
                  onPress={this.onPress}
                  onChangeValue={this.onChangeValue}
                  active={this.state.active}
                  value={this.state.amount}
                />
              ) : this.renderSteps()
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
  },
  transferDetail: {
    marginTop: 12,
    backgroundColor: COLORS.N100,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 4
  },
  depositBank: {
    flexDirection: 'row'
  },
  bank: {
    marginLeft: 10,
    marginBottom: 15
  },
  transferDetailTable: {
    flexDirection: 'row'
  },
  labelColumn: {
    marginRight: 9
  },
  row: {
    marginBottom: 6
  }
})

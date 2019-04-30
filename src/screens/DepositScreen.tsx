import * as React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Amplitude } from 'expo'
import { AntDesign } from '@expo/vector-icons'
import { Text, ScreenWithKeyboard, AssetBox, Value } from '../components'
import { deposit } from '../requests'
import { toNumber } from '../utils'
import { COLORS, CONTACTS } from '../constants'

interface State {
  amount: string
  active: boolean
  amountChosen: boolean
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
      amountChosen: false
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
    if (!this.state.amountChosen) {
      this.setState({ amountChosen: true })
    } else {
      await deposit('THB', toNumber(this.state.amount))
      this.props.navigation.goBack()
    }
  }

  public renderBullet (main: any, detail?: any) {
    return (
      <View style={styles.bullet}>
        <Text color={COLORS.N700} style={styles.bulletTitle}>
          {main}
        </Text>
        {detail}
      </View>
    )
  }

  public renderFirstBullet () {
    return this.renderBullet(
      <Text>
        <Text color={COLORS.N700}>1. Transfer '</Text>
        <Value assetId='THB' style={{ color: COLORS.N700 }}>
          {toNumber(this.state.amount)}
        </Value>
        <Text color={COLORS.N700}>
          ' cash in amount to following account.
        </Text>
      </Text>
      ,
      <View style={styles.transferDetail}>
      <View style={styles.depositBank}>
        <Image
          source={require('../img/bank_bbl.png')}
          style={{ width: 20, height: 20 }}
        />
        <Text type='button' color={COLORS.N800} style={styles.bank}>
          Bangkok Bank
        </Text>
      </View>
      <View style={styles.transferDetailTable}>
        <View style={styles.labelColumn}>
          <Text color={COLORS.N600} style={styles.row}>
            Acc No.
          </Text>
          <Text color={COLORS.N600}>Name</Text>
        </View>
        <View>
          <Text color={COLORS.N800} style={styles.row}>
            855-0-51723-2
          </Text>
          <Text color={COLORS.N800}>นาย ภาณุมาชร์ อนันตชัยวณิช</Text>
        </View>
      </View>
    </View>
    )
  }

  public renderContact (label: string, value: string, onPress: () => {}, lastContact?: boolean) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.contact, lastContact && styles.noMargin]}
      >
        <View style={styles.contactContent}>
          <Text color={COLORS.N600} style={styles.contactLabel}>
            {label}
          </Text>
          <Text type='button' color={COLORS.P400}>
            {value}
          </Text>
        </View>
        <AntDesign
          name='right'
          color={COLORS.N500}
          size={16}
        />
      </TouchableOpacity>
    )
  }

  public renderSecondBullet () {
    const email = 'deposit@flipay.co'
    return this.renderBullet(
      '2. Send us the banking transfer slip with your phone number to one of the Flipay contacts',
      <View>
        {this.renderContact('Email', email, () => Linking.openURL(`mailto:${email}`))}
        {this.renderContact('Line', '@flipay', () => Linking.openURL(CONTACTS.LINE_LINK), true)}
      </View>
    )
  }

  public renderThirdBullet () {
    return this.renderBullet(
     ' 3. Tab below ‘Request deposit’ button to finish the process. We will update your balance within 24 hours.'
    )
  }

  public renderSteps () {
    return (
      <View>
        <Text type='button' color={COLORS.N800}>
          Please follow the following steps to deposit
        </Text>
        {this.renderFirstBullet()}
        {this.renderSecondBullet()}
        {this.renderThirdBullet()}
      </View>
    )
  }

  public render () {
    return (
      <ScreenWithKeyboard
        backButtonType='close'
        onPressBackButton={this.onPressBackButton}
        activeSubmitButton={!!this.state.amount}
        submitButtonText={this.state.amountChosen ? 'Request deposit' : 'Next'}
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={false}
      >
        {(autoFocus: boolean) => (
          <View style={styles.body}>
            <Text type='title' style={styles.title}>
              Deposit
            </Text>
            {!this.state.amountChosen ? (
              <AssetBox
                autoFocus={autoFocus}
                description='Deposit amount'
                assetId='THB'
                onPress={this.onPress}
                onChangeValue={this.onChangeValue}
                active={this.state.active}
                value={this.state.amount}
              />
            ) : (
              this.renderSteps()
            )}
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
  bullet: {
    marginTop: 24
  },
  bulletTitle: {
    marginBottom: 12
  },
  transferDetail: {
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
  },
  contact: {
    borderWidth: 1,
    borderColor: COLORS.N200,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 4,
    alignItems: 'center'
  },
  contactContent: {
    flexDirection: 'row'
  },
  contactLabel: {
    width: 45
  },
  noMargin: {
    marginBottom: 0
  }
})

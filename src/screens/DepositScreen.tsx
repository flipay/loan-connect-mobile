import * as React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { AntDesign } from '@expo/vector-icons'
import { Text, ScreenWithKeyboard } from '../components'
import { COLORS, CONTACTS } from '../constants'
import { logEvent } from '../analytics'

export default class DepositScreen extends React.Component<
  NavigationScreenProps
> {

  public onPressBackButton = () => {
    logEvent('deposit/press-back-button')
    this.props.navigation.goBack()
  }

  public onChangeValue = (value: string) => {
    this.setState({ amount: value })
  }

  public onPressSubmit = async () => {
    logEvent('deposit/press-done')
    this.props.navigation.goBack()
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
      <Text color={COLORS.N700}>
        1. Transfer your cash into the following account.
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
          <View style={styles.detailColumn}>
            <Text color={COLORS.N800} style={styles.row}>
              855-0-51723-2
            </Text>
            <Text color={COLORS.N800}>Mr Panumarch Anantachaiwanich</Text>
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
     ' 3. After that, we will update your balance within 24 hours.'
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
        submitButtonText='Done'
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={false}
      >
        {(autoFocus: boolean) => (
          <View style={styles.body}>
            <Text type='title' style={styles.title}>
              Deposit
            </Text>
            {this.renderSteps()}
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
  detailColumn: {
    flex: 1
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

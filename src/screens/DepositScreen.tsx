import * as React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Linking, Clipboard } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { AntDesign } from '@expo/vector-icons'
import { Text, Screen, Button } from '../components'
import { COLORS, CONTACTS, ASSETS } from '../constants'
import { logEvent } from '../services/Analytic'
import { AssetId } from '../types'
import { alert } from '../utils'

interface State {
  copied: boolean
}

export default class DepositScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      copied: false
    }
  }

  public onPressBackButton = () => {
    logEvent('deposit/press-back-button')
    this.props.navigation.goBack()
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
        <View>
          {detail}
        </View>
      </View>
    )
  }

  public onPressCopyButton = (address: string) => {
    try {
      Clipboard.setString(address)
      this.setState({ copied: true })
    } catch (err) {
      alert(err)
    }

  }

  public renderDetailRow (label: string, value: string) {
    return (
      <View style={styles.detailRow}>
        <Text color={COLORS.N600} style={styles.transferLabel}>{label}</Text>
        <Text color={COLORS.N800} style={styles.transferValue}>{value}</Text>
      </View>
    )
  }

  public renderFirstBullet () {
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'THB')
    const assetName = ASSETS[assetId].name
    const addressType = assetId === 'THB' ? 'Acc No.' : 'Address'
    return this.renderBullet(
      <Text color={COLORS.N700}>
        {`1. Transfer your ${assetName} into the following ${assetId === 'THB' ? 'account' : 'wallet'}.`}
      </Text>
      ,
      <View style={styles.transferDetail}>
        <View style={styles.depositBank}>
          <Image
            source={assetId === 'THB' ? require('../img/bank_bbl.png') : ASSETS[assetId].image}
            style={{ width: 20, height: 20 }}
          />
          <Text type='button' color={COLORS.N800} style={styles.bank}>
            {assetId === 'THB' ? 'Bangkok Bank' : `Flipay ${assetName} address`}
          </Text>
        </View>
        <View>
          {this.renderDetailRow(addressType, ASSETS[assetId].address)}
          {ASSETS[assetId].tag && this.renderDetailRow('Name tag', ASSETS[assetId].tag)}
          {assetId === 'THB' && this.renderDetailRow('Name', 'Mr Panumarch Anantachaiwanich')}
        </View>
        <Button
          onPress={() => this.onPressCopyButton(ASSETS[assetId].address)}
          inactive={this.state.copied}
          style={styles.copyButton}
        >
          {this.state.copied ? 'Copied' : `Copy ${addressType}`}
        </Button>
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
          Please follow the following steps.
        </Text>
        {this.renderFirstBullet()}
        {this.renderSecondBullet()}
        {this.renderThirdBullet()}
      </View>
    )
  }

  public render () {
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'THB')

    return (
      <Screen
        backButtonType='close'
        onPressBackButton={this.onPressBackButton}
        submitButtonText='Done'
        onPessSubmitButton={this.onPressSubmit}
        fullScreenLoading={false}
        title={`Deposit ${ASSETS[assetId].name}`}
      >
        {(autoFocus: boolean) => (
          <View style={styles.body}>
            {this.renderSteps()}
          </View>
        )}
      </Screen>
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
  copyButton: {
    marginTop: 8,
    backgroundColor: COLORS.N300
  },
  detailRow: {
    flexDirection: 'row'
  },
  transferLabel: {
    marginRight: 10
  },
  transferValue: {
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

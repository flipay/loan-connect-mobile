import * as React from 'react'
import _ from 'lodash'
import { View, Linking, StyleSheet, Image, StatusBar } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { lock } from '../requests'
import { getPhoneNumber } from '../asyncStorage'
import { Text, Record } from '../components'
import { COLORS } from '../constants'

interface State {
  phoneNumber?: string | null
}

export default class ProfileScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public async componentDidMount () {
    const phoneNumber = await getPhoneNumber()
    this.setState({
      phoneNumber
    })
  }

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      phoneNumber: null
    }
  }

  public onPressLine = () => {
    Linking.openURL('https://line.me/R/ti/p/@flipay')
  }

  public renderLineRecord () {
    return (
      <Record
        onPress={this.onPressLine}
      >
        <View style={styles.lineFirstRow}>
          <View style={styles.lineLeftSide}>
            <Text type='headline'>Contact us at</Text>
            <Image
              source={require('../img/line@_logo.png')}
              style={{ width: 41 , height: 11, marginLeft: 7, marginTop: 8 }}
            />
          </View>
          <Text type='headline' color={COLORS.P400}>@flipay</Text>
        </View>
        <Text>
          Give feedbacks, Report problems
        </Text>
      </Record>
    )
  }

  public renderList () {
    return (
      <View>
        {this.renderLineRecord()}
        <Record onPress={lock}>
          <Text color={COLORS.R400}>
            Log out
          </Text>
        </Record>
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle='dark-content' />
        <View style={styles.header}>
          <Text type='caption'>Your phone number</Text>
          <Text type='large-title'>{this.state.phoneNumber || '08XXXXXXXX'}</Text>
        </View>
        {this.renderList()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 52
  },
  header: {
    marginBottom: 25
  },
  record: {
    borderTopColor: COLORS.N200,
    borderTopWidth: 1
  },
  lineFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  lineLeftSide: {
    flexDirection: 'row'
  }
})

import * as React from 'react'
import _ from 'lodash'
import { View, Linking, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native'
import { Constants } from 'expo'
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
      <Record onPress={this.onPressLine}>
        <View>
          <View style={styles.lineFirstRow}>
            <View style={styles.lineLeftSide}>
              <Text type='headline'>Contact us</Text>
            </View>
          </View>
          <Text type='caption'>
            Give feedback, Report problems
          </Text>
        </View>
        <View style={styles.contactDetail}>
          <Image
            source={require('../img/line_logo.png')}
            style={{ width: 35 , height: 12, marginRight: 5 }}
          />
          <Text type='headline' color={COLORS.N800}>@flipay</Text>
        </View>
      </Record>
    )
  }

  public renderList () {
    return (
      <View>
        {this.renderLineRecord()}
        <Record>
          <Text type='headline'>
            Version
          </Text>
          <Text>
            {`${Constants.manifest.version} (Private Beta)`}
          </Text>
        </Record>
        <TouchableOpacity onPress={lock} style={styles.error}>
          <Text type='headline' color={COLORS.R400}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle='dark-content' />

        <View style={styles.header}>
          <View style={styles.headerDetail}>
            <Text type='caption'>ACCOUNT</Text>
            <Text type='title'>{this.state.phoneNumber || '08XXXXXXXX'}</Text>
          </View>
          <Image
            source={require('../img/default_avatar.png')}
            style={{ width: 60, height: 60 }}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 40
  },
  headerDetail: {
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
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  error: {
    paddingVertical: 24
  }
})

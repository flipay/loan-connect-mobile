import * as React from 'react'
import _ from 'lodash'
import { View, Linking, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

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
        <Text> Line Ja </Text>
      </Record>
    )
  }

  public renderList () {
    return (
      <View>
        {this.renderLineRecord()}
        <Record>
          <Text>
            Log out
          </Text>
        </Record>
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        {!!this.state.phoneNumber && (
          <View>
            <Text type='caption'>Your phone number</Text>
            <Text type='large-title'>{this.state.phoneNumber}</Text>
          </View>
        )}
        {this.renderList()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  record: {
    borderTopColor: COLORS.N200,
    borderTopWidth: 1
  }
})

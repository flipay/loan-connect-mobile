import * as React from 'react'
import _ from 'lodash'
import {
  View, StyleSheet
} from 'react-native'

import { getPhoneNumber } from '../asyncStorage'

import { NavigationScreenProps } from 'react-navigation'
import { Text } from '../components'

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

  public render () {
    return (
      <View style={styles.screen}>
        {!!this.state.phoneNumber && (
          <View>
            <Text type='caption'>Profile Screen</Text>
            <Text type='large-title'>{this.state.phoneNumber}</Text>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
})
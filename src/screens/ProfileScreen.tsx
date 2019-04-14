import * as React from 'react'
import _ from 'lodash'
import {
  View
} from 'react-native'

import { NavigationScreenProps } from 'react-navigation'
import { Text } from '../components'

export default class ProfileScreen extends React.Component<
  NavigationScreenProps
> {
  public render () {
    return (
      <View style={{ flex: 1 }}>
        <Text>Profile Screen</Text>
      </View>
    )
  }
}
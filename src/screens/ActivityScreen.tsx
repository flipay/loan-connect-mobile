import * as React from 'react'
import _ from 'lodash'
import {
  View
} from 'react-native'

import { NavigationScreenProps } from 'react-navigation'
import { Text } from '../components'

export default class ActivityScreen extends React.Component<
  NavigationScreenProps
> {
  public render () {
    return (
      <View style={{ flex: 1 }}>
        <Text>Activity Screen</Text>
      </View>
    )
  }
}
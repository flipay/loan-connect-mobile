import * as React from 'react'
import { View } from 'react-native'
import { Text } from '../components'

export default class MainScreen extends React.Component {
  public render () {
    return (
      <View style={{ flex: 1 }}>
        <Text>Market Screen</Text>
      </View>
    )
  }
}
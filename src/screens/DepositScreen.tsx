import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Text } from '../components'

export default class DepositScreen extends React.Component<
  NavigationScreenProps
> {

  public render () {
    return (
      <View style={styles.screen}>
        <Text>'Doposit'</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
})

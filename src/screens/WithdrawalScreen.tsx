import * as React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Text } from '../components'

export default class WithdrawalScreen extends React.Component<
  NavigationScreenProps
> {

  public render () {
    return (
      <View style={styles.screen}>
        <Text>'Withdrawal'</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
})


import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet, AsyncStorage } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from './constants/styleGuides'
import { Text } from './components'

interface State {
  pin: string
}

export default class Start extends React.Component<
  NavigationScreenProps,
  State
> {

  public async componentDidMount () {

    const accountId = await AsyncStorage.getItem('account_id')
    if (accountId) {
      this.props.navigation.navigate('Pin')
    } else {
      this.props.navigation.navigate('Welcome')
    }
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>nothing</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  kak: {
    width: 50,
    height: 50,
    backgroundColor: 'red'
  },
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1
  }
})
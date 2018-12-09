
import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
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

  public componentDidMount () {
    this.props.navigation.navigate('Pin', {
      screenName: 'Create PIN',
      description: 'PIN will be used for login',
      onSuccess: ({ navigation }: any) => {
        navigation.push('Pin', {
          screenName: 'Confirm PIN',
          description: 'Please insert PIN again',
          onSuccess: () => {
            console.log('finish the PIN creation')
          }
        })
      }
    })
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
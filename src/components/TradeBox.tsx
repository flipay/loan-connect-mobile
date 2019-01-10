import * as React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import Text from './Text'

export default class TradeBox extends React.Component {
  public render () {
    return (
      <View style={styles.container}>
        <View>
          <Text>
            You buy with
          </Text>
          <TextInput />
        </View>
        <View>
          <Text>
            $ DOL
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1
  }
})
import * as React from 'react'
import { View, Platform, StyleSheet } from 'react-native'
import { Text } from '../components'

export default class UpadateVersionScreen extends React.Component {
  public render () {
    return (
      <View style={styles.screen}>
        <Text>This current version is no longer supported.</Text>
        <Text style={styles.row}>{`Please update the app in ${Platform.OS === 'android' ? 'App Store' : 'Google Play'}.`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    marginTop: 10
  }
})
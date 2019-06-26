import * as React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants'

export default class SplashScreen extends React.Component <NavigationScreenProps> {
  public render () {
    return (
      <View style={styles.screen}>
        <Image
          source={require('../img/flipay_logo.png')}
          style={{ width: 150, height: 150 }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
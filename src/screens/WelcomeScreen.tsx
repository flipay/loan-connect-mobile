import * as React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { LinearGradient, Amplitude } from 'expo'
import { Text } from '../components'
import { COLORS } from '../constants'

export default class WelcomeScreen extends React.Component<
  NavigationScreenProps
> {
  public onPressSignUp = () => {
    Amplitude.logEvent('welcome/press-create-account-button')
    this.props.navigation.navigate('SignUp')
  }

  public renderBody () {
    return (
      <View style={styles.body}>
        <Image
          style={{ width: 164, height: 41 }}
          source={require('../img/flipay_horizontal_logo_reverse.png')}
        />
        <Text style={styles.description} color={COLORS.WHITE}>
          Creating the Borderless world of Banking
        </Text>
      </View>
    )
  }

  public renderButton () {
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPressSignUp}>
        <Text type='button' color={COLORS.P400}>
          Create a new account
        </Text>
      </TouchableOpacity>
    )
  }

  public render () {
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.5, 0.6]}
        end={[0.5, 1.5]}
        style={styles.screen}
      >
        <StatusBar barStyle='light-content' />
        {this.renderBody()}
        {this.renderButton()}
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 86,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative'
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  description: {
    marginTop: 28
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 4,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50
  }
})

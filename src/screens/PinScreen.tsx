import * as React from 'react'
import _ from 'lodash'
import { View, Image, TextInput, StatusBar, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/styleGuides'
import { Text, Key } from '../components'

interface State {
  pin: string
}

type Index = 0 | 1 | 2 | 3

export default class PinScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private willFocusSubscription: any
  private didFocusSubscription: any
  private textInput: TextInput | null = null
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      pin: ''
    }
  }

  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: props.navigation.getParam('screenName')
    }
  }

  public componentDidMount () {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.setState({ pin: '' })
      }
    )
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        if (this.textInput) {
          this.textInput.focus()
        }
      }
    )
  }

  public componentWillUnmount () {
    this.willFocusSubscription.remove()
    this.didFocusSubscription.remove()
  }

  public onPinChange = (pin: string) => {
    this.setState({ pin })
    if (pin.length === 4) {
      this.props.navigation.getParam('onSuccess')(
        this.state.pin,
        this.props.navigation
      )
    }
  }

  public onPressNum = (digit: number) => {
    this.setState({ pin: this.state.pin + String(digit) })
  }

  public onBackSpace = () => {
    if (this.state.pin.length > 0) {
      this.setState({
        pin: this.state.pin.slice(0, this.state.pin.length - 1)
      })
    }
  }

  public renderDot (index: Index) {
    return (
      <View
        style={[styles.dot, this.state.pin.length > index && styles.activeDot]}
      />
    )
  }

  public renderSpacing () {
    return <View style={styles.spacing} />
  }

  public renderDots () {
    return (
      <View style={styles.dots}>
        {this.renderDot(0)}
        {this.renderSpacing()}
        {this.renderDot(1)}
        {this.renderSpacing()}
        {this.renderDot(2)}
        {this.renderSpacing()}
        {this.renderDot(3)}
      </View>
    )
  }

  public renderNumRow (digits: Array<number>) {
    return (
      <View style={styles.numRow}>
        {digits.map(digit => (
          <Key key={digit} onPress={() => this.onPressNum(digit)}>
            {digit}
          </Key>
        ))}
      </View>
    )
  }

  public renderNumPad () {
    const zero = 0
    return (
      <View style={styles.numPad}>
        {this.renderNumRow([1, 2, 3])}
        {this.renderNumRow([4, 5, 6])}
        {this.renderNumRow([7, 8, 9])}
        <Key onPress={() => this.onPressNum(zero)}>{zero}</Key>
        <Key onPress={this.onBackSpace}>
          <Ionicons name='md-arrow-round-back' />
        </Key>
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle='dark-content' />
        <Image
          style={{ width: 96, height: 35.6, marginTop: 72 }}
          source={require('../img/flipay_horizontal_logo.png')}
        />
        <Text type='title' style={styles.title}>
          {this.props.navigation.getParam('title', 'Create a PIN')}
        </Text>
        {this.renderDots()}
        {this.renderNumPad()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    alignItems: 'center',
    position: 'relative'
  },
  title: {
    marginTop: 60
  },
  dots: {
    marginTop: 42,
    flexDirection: 'row'
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.N200
  },
  activeDot: {
    backgroundColor: COLORS.P400
  },
  spacing: {
    width: 32
  },
  numPad: {

  },
  numRow: {
    flexDirection: 'row'
  }
})

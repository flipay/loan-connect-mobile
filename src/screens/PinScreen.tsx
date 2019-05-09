import * as React from 'react'
import _ from 'lodash'
import { View, Image, StatusBar, StyleSheet, Dimensions } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/styleGuides'
import { Text, Key, FullScreenLoading } from '../components'

interface State {
  pin: string
  errorMessage: string
  loading: boolean
}

type Index = 0 | 1 | 2 | 3 | 4 | 5

const pinLength = 6

export default class PinScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private willFocusSubscription: any
  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      pin: '',
      errorMessage: '',
      loading: false
    }
  }

  public componentDidMount () {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.setState({ pin: '' })
      }
    )
  }

  public async componentDidUpdate (prevProps: NavigationScreenProps, prevState: State) {
    if (prevState.pin.length === pinLength - 1 && this.state.pin.length === pinLength) {
      await this.props.navigation.getParam('onSuccess')(
        this.state.pin,
        this.props.navigation,
        this.setError,
        () => this.setState({ loading: true }),
        () => this.setState({ loading: false }),
        () => this.setState({ pin: '' })
      )
    } else if (prevState.pin.length === pinLength && this.state.pin.length < pinLength && this.state.errorMessage) {
      this.setState({ errorMessage: '' })
    }
  }

  public componentWillUnmount () {
    this.willFocusSubscription.remove()
  }

  public onPressNum = (digit: number) => {
    if (this.state.pin.length < pinLength) {
      this.setState({ pin: this.state.pin + String(digit) })
    }
  }

  public onBackSpace = () => {
    if (this.state.pin.length > 0) {
      this.setState({
        pin: this.state.pin.slice(0, this.state.pin.length - 1)
      })
    }
  }

  public setError = (errorMessage: string) => {
    this.setState({ errorMessage })
  }

  public getDotColor = (index: Index) => {
    if (this.state.errorMessage) {
      return styles.errorDot
    } else if (this.state.pin.length > index) {
      return styles.filledDot
    }
  }

  public renderDot (index: Index) {
    return (
      <View
        style={[styles.dot, this.getDotColor(index)]}
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
        {this.renderSpacing()}
        {this.renderDot(4)}
        {this.renderSpacing()}
        {this.renderDot(5)}
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

  public renderErrorMessage () {
    return (
      <View style={styles.errorMessageRow}>
        <AntDesign
          name='closecircle'
          color={COLORS.R400}
          style={styles.closeIcon}
        />
        <Text color={COLORS.R400}>{this.state.errorMessage}</Text>
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
        <View style={styles.numRow}>
          <Key />
          <Key onPress={() => this.onPressNum(zero)}>{zero}</Key>
          <Key onPress={this.onBackSpace}>
            <Ionicons name='md-arrow-round-back' color={COLORS.N800} size={16} />
          </Key>
        </View>
      </View>
    )
  }

  public render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle='dark-content' />
        <FullScreenLoading visible={this.state.loading} />
        <View style={styles.screen}>
          <View style={styles.content}>
            <Image
              style={{ width: 96, height: 35.6 }}
              source={require('../img/flipay_horizontal_logo.png')}
            />
            <Text type='title' style={styles.title}>
              {this.props.navigation.getParam('title', 'Create a PIN')}
            </Text>
            <View>
            {this.renderDots()}
              <View style={styles.errorArea}>
                {!!this.state.errorMessage && this.renderErrorMessage()}
              </View>
            </View>
          </View>
          {this.renderNumPad()}
        </View>
      </View>
    )
  }
}

const iPhoneX = Dimensions.get('window').height > 800
const iPhone5 = Dimensions.get('window').height < 600

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    alignItems: 'center',
    margin: 30,
    marginTop: iPhoneX ? 80 : 50,
    justifyContent: 'space-between'
  },
  content: {
    alignItems: 'center'
  },
  title: {
    marginTop: iPhone5 ? 30 : 60
  },
  dotsArea: {
    paddingTop: 20,
    alignItems: 'center'
  },
  dots: {
    paddingTop: 30,
    flexDirection: 'row'
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.N200
  },
  filledDot: {
    backgroundColor: COLORS.P400
  },
  errorDot: {
    backgroundColor: COLORS.R400
  },
  spacing: {
    width: 25
  },
  errorArea: {
    height: 40
  },
  errorMessageRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeIcon: {
    marginRight: 8
  },
  numPad: {
    width: '100%'
  },
  numRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

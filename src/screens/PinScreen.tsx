
import * as React from 'react'
import _ from 'lodash'
import { View, TextInput, StyleSheet } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants/styleGuides'
import { Text } from '../components'

interface State {
  pin: string
}

type Index = 0 | 1 | 2 | 3 | 4 | 5

export default class PinScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private didBlurSubscription: any
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
    this.didBlurSubscription = this.props.navigation.addListener(
    'didBlur',
      payload => {
        this.setState({ pin: '' })
      }
    )
  }

  public componentWillUnmount () {
    this.didBlurSubscription.remove()
  }

  public onPinChange = (pin: string) => {
    this.setState({ pin })
    if (pin.length === 6) {
      this.props.navigation.getParam('onSuccess')({ navigation: this.props.navigation })
    }
  }

  public renderDot (index: Index) {
    return (
      <View
        style={[styles.dot, this.state.pin.length > index && styles.activeDot]}
      />
    )
  }

  public renderDots () {
    return (
      <View style={styles.dots}>
        {this.renderDot(0)}
        {this.renderDot(1)}
        {this.renderDot(2)}
        {this.renderDot(3)}
        {this.renderDot(4)}
        {this.renderDot(5)}
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>{this.props.navigation.getParam('description')}</Text>
        {this.renderDots()}
        <TextInput
          keyboardType='number-pad'
          onChangeText={this.onPinChange}
          autoFocus={true}
          maxLength={6}
          style={styles.invisibleTextInput}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    position: 'relative'
  },
  dots: {
    flexDirection: 'row'
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: COLORS.P500,
    borderWidth: 1
  },
  activeDot: {
    backgroundColor: COLORS.P500
  },
  invisibleTextInput: {
    position: 'absolute',
    top: -1000,
    left: -1000
  }
})
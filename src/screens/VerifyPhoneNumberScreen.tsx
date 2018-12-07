
import * as React from 'react'
import { View, TextInput, StyleSheet, TouchableHighlight } from 'react-native'
import Text from '../components/Text'
import { NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants/styleGuides'
import _ from 'lodash'

interface State {
  phoneNumber: string
}

export default class VerifyPhoneNumberScreen extends React.Component<
  NavigationScreenProps,
  State
> {

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      phoneNumber: ''
    }
  }
  private input: Array<TextInput | null> = []

  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: 'Verify Phone Number'
    }
  }

  public onChangeText = (index: number, text: string) => {
    const nextInput = this.input[index + 1]
    if (text.length === 1 && nextInput) {
      nextInput.focus()
    }
  }

  public renderBox (index: number) {
    return (
      <View style={styles.box}>
        <TextInput
          ref={(element) => { this.input[index] = element }}
          keyboardType='number-pad'
          selectTextOnFocus={true}
          autoFocus={index === 0}
          onChangeText={(text: string) => this.onChangeText(index, text)}
          maxLength={1}
        />
      </View>
    )
  }

  public renderBoxes () {
    return (
      <View style={styles.boxes}>
        {this.renderBox(0)}
        {this.renderBox(1)}
        {this.renderBox(2)}
        {this.renderBox(3)}
        {this.renderBox(4)}
        {this.renderBox(5)}
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <Text>Plese check you SMS to get One Time Password (OTP)</Text>
        <Text>Insert OTP</Text>
        {this.renderBoxes()}
        <TouchableHighlight style={styles.kak} onPress={this.onPress}>
          <Text>
            Verify
          </Text>
        </TouchableHighlight>
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
  },
  boxes: {
    flexDirection: 'row'
  },
  box: {
    width: 30,
    borderColor: COLORS.P500,
    borderWidth: 1
  }
})
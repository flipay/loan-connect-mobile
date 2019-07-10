import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { Screen, TextBox } from '../components'

type Box = 'firstName' | 'lastName' | 'email'

interface State {
  firstName: string
  lastName: string
  email: string
  activeBox: Box
}

export default class CollectInfo extends React.Component<NavigationScreenProps, State> {

  constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      activeBox: 'firstName'
    }
  }

  public onPressFirstName = () => {
    this.setState({
      activeBox: 'firstName'
    })
  }

  public onPressLastName = () => {
    this.setState({
      activeBox: 'firstName'
    })
  }

  public onPressEmail = () => {
    this.setState({
      activeBox: 'firstName'
    })
  }

  public render () {
    return (
      <Screen>
        {(autoFocus: boolean) => (
          <View>
            <TextBox
              autoFocus={autoFocus}
              description='First name'
              onPress={this.onPressFirstName}
              onChangeValue={(value) => this.setState({ firstName: value })}
              value={this.state.firstName}
              active={this.state.activeBox === 'firstName'}
            />
            <TextBox
              description='Last name'
              onPress={this.onPressLastName}
              onChangeValue={(value) => this.setState({ lastName: value })}
              value={this.state.lastName}
              active={this.state.activeBox === 'lastName'}
            />
            <TextBox
              description='Email Address'
              onPress={this.onPressEmail}
              onChangeValue={(value) => this.setState({ email: value })}
              value={this.state.email}
              active={this.state.activeBox === 'email'}
            />
          </View>
        )}
      </Screen>
    )
  }
}

const styles = StyleSheet.create({

})
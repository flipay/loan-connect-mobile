import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { Screen, TextBox, Text } from '../components'

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
      activeBox: 'lastName'
    })
  }

  public onPressEmail = () => {
    this.setState({
      activeBox: 'email'
    })
  }

  public render () {
    return (
      <Screen>
        {(autoFocus: boolean) => (
          <View>
            <Text type='title'>
              Let us know more about yourself.
            </Text>
            <View style={styles.nameRow}>
              <TextBox
                autoFocus={autoFocus}
                label='First name'
                onPress={this.onPressFirstName}
                onChangeValue={(value) => this.setState({ firstName: value })}
                value={this.state.firstName}
                active={this.state.activeBox === 'firstName'}
              />
              <View style={styles.space} />
              <TextBox
                label='Last name'
                onPress={this.onPressLastName}
                onChangeValue={(value) => this.setState({ lastName: value })}
                value={this.state.lastName}
                active={this.state.activeBox === 'lastName'}
              />
            </View>
            <TextBox
              label='Email address'
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
  nameRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 30
  },
  space: {
    width: 10
  }
})
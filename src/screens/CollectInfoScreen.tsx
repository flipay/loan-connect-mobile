import * as React from 'react'
import _ from 'lodash'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Screen, TextBox, Text } from '../components'
import { setUserContext } from '../requests'

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

  public validateEmail = () => {
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const trimData = _.trim(this.state.email)
    return emailReg.test(trimData)
  }

  public onPressSubmitButton = async () => {
    setUserContext({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    })
    this.props.navigation.getParam('onSubmitInfo')()
  }

  public isButtonActive = () => {
    return (
      this.state.firstName !== '' &&
      this.state.lastName !== '' &&
      this.validateEmail()
    )
  }

  public render () {
    return (
      <Screen
        activeSubmitButton={this.isButtonActive()}
        onPessSubmitButton={this.onPressSubmitButton}
      >
        <View style={styles.screen}>
          <Text type='title'>
            Let us know more about yourself.
          </Text>
          <View style={styles.nameRow}>
            <TextBox
              autoFocus={true}
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
            validate={this.validateEmail}
            errorMessage='Incorrect email format'
            active={this.state.activeBox === 'email'}
          />
        </View>
      </Screen>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    marginTop: 30
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 30
  },
  space: {
    width: 10
  }
})
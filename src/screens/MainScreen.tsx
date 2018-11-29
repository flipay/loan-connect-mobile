import * as React from 'react'
import { Text } from 'react-native'
import { Component } from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { ScrollView } from 'react-native'


// tslint:disable-next-line:max-classes-per-file
export class MainScreen extends Component<NavigationScreenProps> {
  public static navigationOptions = {
    title: 'Home'
  }

  public render() {
    return (
      <ScrollView
        style={{
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <Text>
          test
        </Text>
      </ScrollView>
    )
  }
}
import * as React from 'react'
import { Text } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { ScrollView } from 'react-native'

export default class TradeScreen extends React.Component<
  NavigationScreenProps
> {
  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: `${props.navigation.getParam(
        'side',
        'Buy'
      )} ${props.navigation.getParam('coinId', 'Bitcoin')}`
    }
  }

  public render () {
    return (
      <ScrollView
        style={{
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <Text>buy / sell</Text>
      </ScrollView>
    )
  }
}

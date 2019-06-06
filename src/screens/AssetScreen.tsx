
import * as React from 'react'
import { View } from 'react-native'
import { Text } from '../components'
import { NavigationScreenProps } from 'react-navigation'

export default class AssetScreen extends React.Component<NavigationScreenProps> {
  public render () {
    const assetId = this.props.navigation.getParam('assetId')
    return (
      <View>
        <Text type='large-title'>{assetId}</Text>
      </View>
    )
  }
}

import * as React from 'react'
import { Text, ScreenWithKeyboard, Asset } from '../components'
import { NavigationScreenProps } from 'react-navigation'
import { AssetId } from '../types'

export default class AssetScreen extends React.Component<NavigationScreenProps> {
  public onPressBackButton = () => {
    this.props.navigation.goBack()
  }

  public renderTitle = () => {
    const assetId: AssetId = this.props.navigation.getParam('assetId')
    return <Asset id={assetId} withUnit={true} />
  }

  public render () {
    return (
      <ScreenWithKeyboard
        title={this.renderTitle}
        onPressBackButton={this.onPressBackButton}
      >
        {() => (
          <Text>asdfasdfasdf</Text>
        )}
      </ScreenWithKeyboard>
    )
  }
}
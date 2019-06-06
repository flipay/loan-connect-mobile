
import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import { Text, ScreenWithKeyboard, Asset } from '../components'
import { NavigationScreenProps } from 'react-navigation'
import { AssetId } from '../types'
import { ASSETS, COLORS } from '../constants';

export default class AssetScreen extends React.Component<NavigationScreenProps> {
  public onPressBackButton = () => {
    this.props.navigation.goBack()
  }

  public renderSection (content: any) {
    return (
      <View style={styles.section}>
        {content}
      </View>
    )
  }

  public renderAboutSection () {
    const assetId: AssetId = this.props.navigation.getParam('assetId')
    return (
      <View>
        <Text type='title'>{`About ${_.capitalize(ASSETS[assetId].name)}`}</Text>
        <Text style={styles.aboutContent}>{ASSETS[assetId].about}</Text>
      </View>
    )
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
          <View style={{ flex: 1 }}>
            {this.renderSection(this.renderAboutSection())}
          </View>
        )}
      </ScreenWithKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.N200
  },
  aboutContent: {
    marginTop: 16
  }
})

import * as React from 'react'
import _ from 'lodash'
import { View, StyleSheet } from 'react-native'
import { Text, Screen, Asset, Button, Layer } from '../components'
import { NavigationScreenProps } from 'react-navigation'
import { AssetId, OrderType } from '../types'
import { ASSETS, COLORS } from '../constants'

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
    return this.renderSection(
      <View>
        <Text type='title'>{`About ${_.capitalize(ASSETS[assetId].name)}`}</Text>
        <Text style={styles.aboutContent}>{ASSETS[assetId].about}</Text>
      </View>
    )
  }

  public onPressTradeButton = (side: OrderType) => {
    const assetId: AssetId = this.props.navigation.getParam('assetId')
    this.props.navigation.navigate('Trade', { side, assetId })
  }

  public renderTitle = () => {
    const assetId: AssetId = this.props.navigation.getParam('assetId')
    return <Asset id={assetId} withUnit={true} />
  }

  public renderFooter = () => {
    return (
      <Layer style={styles.footer}>
        <Button primary={true} onPress={() => this.onPressTradeButton('buy')} style={styles.tradeButton}>Buy</Button>
        <Button primary={true} onPress={() => this.onPressTradeButton('sell')} style={styles.tradeButton}>Sell</Button>
      </Layer>
    )
  }

  public render () {
    return (
      <Screen
        title={this.renderTitle}
        renderFooter={this.renderFooter}
        onPressBackButton={this.onPressBackButton}
      >
        {() => (
          <View style={{ flex: 1 }}>
            {this.renderAboutSection()}
          </View>
        )}
      </Screen>
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
  },
  tradeButton: {
    flex: 1
  },
  footer: {
    flexDirection: 'row'
  }
})
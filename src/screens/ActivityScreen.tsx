import * as React from 'react'
import _ from 'lodash'
import {
  View,
  StatusBar,
  StyleSheet
} from 'react-native'

import { NavigationScreenProps } from 'react-navigation'
import { Text, Value, Activity } from '../components'

export default class ActivityScreen extends React.Component<
  NavigationScreenProps
> {
  public getSavedAmount () {
    return 500
  }

  public renderHeader () {
    return (
      <View style={styles.header}>
        <View>
          <Text type='large-title'>Activity</Text>
        </View>
        <View>
          <Text>With Flipay, you have saved</Text>
          <Value assetId='THB'>{this.getSavedAmount()}</Value>
        </View>
      </View>
    )
  }

  public renderBody () {
    return (
      <View>
        <Activity
          type='buy'
          amount={0.23423}
          assetId='BTC'
          price={100120}
          date='Jan 12'
          time='21:03'
        />
        <Activity
          type='sell'
          amount={0.23423}
          assetId='BTC'
          price={100120}
          date='Jan 12'
          time='21:03'
        />
        <Activity
          type='deposit'
          amount={0.23423}
          assetId='THB'
          date='Jan 12'
          time='21:03'
        />
        <Activity
          type='sell'
          amount={0.23423}
          assetId='THB'
          date='Jan 12'
          time='21:03'
        />
      </View>
    )
  }

  public render () {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle='dark-content' />
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    flexDirection: 'row'
  }
})
import * as React from 'react'
import { ScrollView, RefreshControl, View, StyleSheet } from 'react-native'
import { COLORS } from '../constants'

interface Props {
  children: any
  header: any
  refreshing: boolean
  onRefresh: () => void
  contentStyle?: any
}

export default class ScreenWithCover extends React.Component<Props> {
  public render () {
    return (
      <ScrollView
        style={styles.screen}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
            progressBackgroundColor={COLORS.P400}
            tintColor={COLORS.P400}
          />
        }
      >
        <View style={styles.header}>
          {this.props.header}
        </View>
        <View style={[styles.screenContent, this.props.contentStyle]}>
          {this.props.children}
        </View>
      </ScrollView>
    )
  }
}

const paddingHorizontal = 12

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    paddingHorizontal,
    backgroundColor: COLORS.P400,
    justifyContent: 'center',
    height: 206
  },
  screenContent: {
    paddingHorizontal,
    position: 'relative',
    top: -39
  }
})
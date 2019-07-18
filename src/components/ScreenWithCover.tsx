import * as React from 'react'
import _ from 'lodash'
import { StatusBar, ScrollView, RefreshControl, View, StyleSheet } from 'react-native'
import { withNavigation, NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants'
import { logEvent } from '../services/Analytic'
import { getCurrentRouteName } from '../services/navigation'

interface Props {
  children: any
  header: any
  refreshing: boolean
  onRefresh: () => void
  contentStyle?: any
}

class ScreenWithCover extends React.Component<Props & NavigationScreenProps> {
  private willFocusSubscription: any
  private scrollView: any
  public componentDidMount () {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        logEvent(`${_.toLower(getCurrentRouteName(this.props.navigation.state))}/land-on-the-screen`)
        StatusBar.setBarStyle('light-content')
        this.scrollView.scrollTo({ y: 0, animated: false })
      }
    )
  }

  public componentWillUnmount () {
    this.willFocusSubscription.remove()
  }

  public render () {
    return (
      <ScrollView
        ref={element => {
          this.scrollView = element
        }}
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

export default withNavigation(ScreenWithCover)

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.P400,
    justifyContent: 'center',
    minHeight: 206
  },
  screenContent: {
    paddingHorizontal: 12,
    position: 'relative',
    top: -39
  }
})
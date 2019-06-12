import * as React from 'react'
import { ScrollView, RefreshControl, View, StyleSheet } from 'react-native'
import { withNavigation, NavigationScreenProps } from 'react-navigation'
import { COLORS } from '../constants'

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

const paddingHorizontal = 12

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    paddingHorizontal,
    backgroundColor: COLORS.P400,
    justifyContent: 'center',
    minHeight: 206
  },
  screenContent: {
    paddingHorizontal,
    position: 'relative',
    top: -39
  }
})
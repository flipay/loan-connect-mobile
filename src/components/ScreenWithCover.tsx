import * as React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'

interface Props {
  children: any
}

export default class ScreenWithCover extends React.Component<Props> {
  public render () {
    return (
      <ScrollView style={styles.screen}>
        <View style={styles.headerBackground} />
        <View style={styles.screenContent}>
          {this.props.children}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  headerBackground: {
    backgroundColor: 'purple',
    height: 206
  },
  screenContent: {
    paddingHorizontal: 12,
    position: 'relative',
    top: -126
  }
})
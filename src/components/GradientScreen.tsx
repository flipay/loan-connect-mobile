import * as React from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar
} from 'react-native'
import { LinearGradient } from 'expo'
import { COLORS } from '../constants'
import CloseButton from './CloseButton'

interface Props {
  onPressBackButton?: () => void
  children: any
}

export default class GradientScreen extends React.Component<Props> {
  public render () {
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={styles.screen}
      >
        <SafeAreaView style={styles.screen}>
          <View style={styles.content}>
            <StatusBar barStyle='light-content' />
            {this.props.onPressBackButton && <CloseButton onPress={this.props.onPressBackButton} color={COLORS.WHITE} top={8} left={5} />}
            {this.props.children}
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 42,
    paddingHorizontal: 12
  }
})
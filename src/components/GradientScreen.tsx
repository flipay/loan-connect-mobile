import * as React from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
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
        <SafeAreaView>
          <View style={styles.content}>
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
    alignItems: 'center',
    position: 'relative',
    paddingTop: 42,
    paddingHorizontal: 12
  }
})
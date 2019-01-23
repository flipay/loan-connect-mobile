import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { AntDesign } from '@expo/vector-icons'
import { COLORS } from '../constants'

interface Props {
  children: any
  type?: 'card' | 'modal'
  baseScreen?: boolean
  statusBar?: 'white' | 'black'
}

export default class Screen extends React.Component<
  Props & NavigationScreenProps
> {
  public static defaultProps = {
    type: 'card',
    statusBar: 'black'
  }

  public render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={
            this.props.statusBar === 'black' ? 'dark-content' : 'light-content'
          }
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.props.navigation.goBack()}
        >
          <AntDesign
            name={this.props.type === 'card' ? 'arrowleft' : 'close'}
            size={28}
            color={COLORS.N800}
          />
          {this.props.children}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 24,
    padding: 6
  }
})

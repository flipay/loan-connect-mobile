import * as React from 'react'
import _ from 'lodash'
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Keyboard,
  ScrollView,
  SafeAreaView
} from 'react-native'
import { Constants } from 'expo'
import { AntDesign } from '@expo/vector-icons'
import { COLORS } from '../constants'
import SubmitButton from './SubmitButton'
import FullScreenLoading from './FullScreenLoading'

interface Props {
  children: (autoFocus: boolean) => any
  statusBar?: 'white' | 'black'
  onPressBackButton?: () => void
  backButtonType?: 'arrowleft' | 'close'
  activeSubmitButton?: boolean
  submitButtonText?: string
  onPessSubmitButton?: () => void
  fullScreenLoading?: boolean
}

interface State {
  keyboardAvoidingViewKey: string
}

const DEFAULT_KEYBOARD_KEY = 'keyboardAvoidingViewKey'

export default class Screen extends React.Component<Props, State> {
  public static defaultProps = {
    backButtonType: 'arrowleft',
    statusBar: 'black'
  }
  private keyboardHideListener: any

  public constructor (props: Props) {
    super(props)
    this.state = {
      keyboardAvoidingViewKey: DEFAULT_KEYBOARD_KEY
    }
  }

  public componentDidMount () {
    // using keyboardWillHide is better but it does not work for android
    this.keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      this.handleKeyboardHide.bind(this)
    )
  }

  public componentWillUnmount () {
    this.keyboardHideListener.remove()
  }

  public handleKeyboardHide () {
    this.setState({
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey' + new Date().getTime()
    })
  }

  public render () {
    return (
      <View style={styles.screen}>
        <KeyboardAvoidingView
          key={this.state.keyboardAvoidingViewKey}
          style={styles.screen}
          behavior='height'
        >
          <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.safeArea}>
              <View style={styles.container}>
                <StatusBar
                  barStyle={
                    this.props.statusBar === 'black'
                      ? 'dark-content'
                      : 'light-content'
                  }
                />
                <ScrollView
                  keyboardShouldPersistTaps='handled'
                >
                  {this.props.onPressBackButton && (
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={this.props.onPressBackButton}
                    >
                      <AntDesign
                        name={this.props.backButtonType}
                        size={28}
                        color={COLORS.N800}
                      />
                    </TouchableOpacity>
                  )}
                  <View style={styles.content}>
                    {this.props.children(
                      this.state.keyboardAvoidingViewKey ===
                        DEFAULT_KEYBOARD_KEY
                    )}
                  </View>
                </ScrollView>
                {this.props.onPessSubmitButton && (
                  <SubmitButton
                    onPress={this.props.onPessSubmitButton}
                    active={this.props.activeSubmitButton}
                  >
                    {this.props.submitButtonText || 'Next'}
                  </SubmitButton>
                )}
              </View>
            </View>
            {this.props.fullScreenLoading && (
              <FullScreenLoading visible={this.props.fullScreenLoading} />
            )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  safeAreaContainer: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
  },
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  backButton: {
    zIndex: 1,
    position: 'absolute',
    left: 12,
    top: 0,
    padding: 10
  },
  content: {
    padding: 20
  }
})

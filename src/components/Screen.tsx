import * as React from 'react'
import _ from 'lodash'
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Keyboard
} from 'react-native'
import { Constants } from 'expo'
import { AntDesign } from '@expo/vector-icons'
import { COLORS } from '../constants'
import { SubmitButton } from '../components'

interface Props {
  children: (autoFocus: boolean) => any
  statusBar?: 'white' | 'black'
  onPressBackButton: () => void
  backButtonType?: 'arrowleft' | 'close'
  activeSubmitButton: boolean
  submitButtonText?: string
  onPessSubmitButton?: () => void
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
      <KeyboardAvoidingView
        key={this.state.keyboardAvoidingViewKey}
        style={styles.outsideContainer}
        keyboardVerticalOffset={Constants.statusBarHeight === 40 ? 20 : 0}
        behavior='height'
      >
        <TouchableWithoutFeedback
          style={styles.outsideContainer}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View style={styles.container}>
            <StatusBar
              barStyle={
                this.props.statusBar === 'black'
                  ? 'dark-content'
                  : 'light-content'
              }
            />
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
                this.state.keyboardAvoidingViewKey === DEFAULT_KEYBOARD_KEY
              )}
            </View>
            {this.props.onPessSubmitButton && (
              <SubmitButton
                onPress={this.props.onPessSubmitButton}
                active={this.props.activeSubmitButton}
              >
                {this.props.submitButtonText || 'Next'}
              </SubmitButton>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  outsideContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 24,
    padding: 6
  },
  content: {
    paddingHorizontal: 20
  }
})

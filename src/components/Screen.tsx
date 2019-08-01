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
  ScrollView
} from 'react-native'
import Constants from 'expo-constants'
import { AntDesign } from '@expo/vector-icons'
import { COLORS } from '../constants'
import Text from './Text'
import SubmitButton from './SubmitButton'
import FullScreenLoading from './FullScreenLoading'
import { logEvent } from '../services/Analytic'
import { getCurrentRouteName } from '../services/navigation'
import { withNavigation, NavigationScreenProps } from 'react-navigation'

interface Props {
  title?: string | any
  noHeaderLine?: boolean
  renderFooter?: () => any
  children: (autoFocus: boolean) => any
  onPressBackButton?: () => void
  backButtonType?: 'arrowleft' | 'close'
  activeSubmitButton?: boolean
  gradientSubmitButton?: boolean
  submitButtonText?: string
  onPessSubmitButton?: () => void
  fullScreenLoading?: boolean
  style?: any
}

interface State {
  keyboardAvoidingViewKey: string
}

const DEFAULT_KEYBOARD_KEY = 'keyboardAvoidingViewKey'

class Screen extends React.Component<Props & NavigationScreenProps, State> {
  public static defaultProps = {
    backButtonType: 'arrowleft'
  }
  private keyboardHideListener: any
  private willFocusSubscription: any

  public constructor (props: Props & NavigationScreenProps) {
    super(props)
    this.state = {
      keyboardAvoidingViewKey: DEFAULT_KEYBOARD_KEY
    }
  }

  public componentDidMount () {
    // using keyboardWillHide is better but it does not work for android

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        logEvent(`${_.toLower(getCurrentRouteName(this.props.navigation.state))}/land-on-the-screen`)
        StatusBar.setBarStyle('dark-content')
      }
    )

    this.keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      this.handleKeyboardHide.bind(this)
    )
  }

  public componentWillUnmount () {
    this.keyboardHideListener.remove()
    this.willFocusSubscription.remove()
  }

  public handleKeyboardHide () {
    this.setState({
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey' + new Date().getTime()
    })
  }

  public hasHeader () {
    return this.props.onPressBackButton || !!this.props.title
  }

  public renderTitle () {
    if (!this.props.title) { return null }
    return (typeof this.props.title) === 'string'
      ? <Text type='headline'>{this.props.title}</Text>
      : this.props.title()
  }

  public render () {
    return (
      <View style={styles.screen}>
        <KeyboardAvoidingView
          key={this.state.keyboardAvoidingViewKey}
          style={styles.screen}
          behavior='height'
        >
            <View style={styles.safeArea}>
              <View style={styles.container}>
                {this.hasHeader() && (
                  <View style={[styles.headerRow, !this.props.noHeaderLine && (!!this.props.title && typeof this.props.title === 'string') && styles.headerRowBorder]}>
                    {this.renderTitle()}
                    {this.props.onPressBackButton && (
                      <View style={styles.backButtonContainer}>
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
                      </View>
                    )}
                  </View>
                )}
                <ScrollView keyboardShouldPersistTaps='handled'>
                  <View
                    style={[
                      styles.content,
                      this.hasHeader() && styles.contentWithHeader,
                      this.props.style
                    ]}
                  >
                    {this.props.children(
                      this.state.keyboardAvoidingViewKey ===
                        DEFAULT_KEYBOARD_KEY
                    )}
                  </View>
                </ScrollView>
                {this.props.renderFooter && this.props.renderFooter()}
                {this.props.onPessSubmitButton && (
                  <SubmitButton
                    onPress={this.props.onPessSubmitButton}
                    active={this.props.activeSubmitButton}
                    gradient={this.props.gradientSubmitButton}
                  >
                    {this.props.submitButtonText || 'Next'}
                  </SubmitButton>
                )}
              </View>
            </View>
            {this.props.fullScreenLoading && (
              <FullScreenLoading visible={this.props.fullScreenLoading} />
            )}
        </KeyboardAvoidingView>
      </View>
    )
  }
}

export default withNavigation(Screen)

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  safeArea: {
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 20,
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  headerRow: {
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerRowBorder: {
    borderBottomColor: COLORS.N200,
    borderBottomWidth: 1
  },
  backButton: {
    padding: 10
  },
  content: {
    padding: 20
  },
  contentWithHeader: {
    paddingTop: 0
  },
  backButtonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

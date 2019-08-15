import * as React from 'react'
import _ from 'lodash'
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView
} from 'react-native'
import Constants from 'expo-constants'
import { AntDesign } from '@expo/vector-icons'
import { COLORS } from '../constants'
import Text from './Text'
import SubmitButton from './SubmitButton'
import FullScreenLoading from './FullScreenLoading'
import * as Device from '../services/Device'
import { logEvent } from '../services/Analytic'
import { getCurrentRouteName } from '../services/navigation'
import { withNavigation, NavigationScreenProps } from 'react-navigation'

interface Props {
  header?: string | any
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

class Screen extends React.Component<Props & NavigationScreenProps> {
  public static defaultProps = {
    backButtonType: 'arrowleft'
  }
  private willFocusSubscription: any

  public componentDidMount () {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        logEvent(`${_.toLower(getCurrentRouteName(this.props.navigation.state))}/land-on-the-screen`)
        StatusBar.setBarStyle('dark-content')
      }
    )
  }

  public componentWillUnmount () {
    this.willFocusSubscription.remove()
  }

  public hasHeader () {
    return this.props.onPressBackButton || !!this.props.header
  }

  public renderHeader () {
    if (!this.props.header) { return null }
    return (typeof this.props.header) === 'string'
      ? <Text type='headline'>{this.props.header}</Text>
      : this.props.header()
  }

  public render () {
    return (
      <View style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior='height'
        >
            <View style={styles.safeArea}>
              <View style={styles.container}>
                {this.hasHeader() && (
                  <View style={[styles.headerRow, !this.props.noHeaderLine && (!!this.props.header && typeof this.props.header === 'string') && styles.headerRowBorder]}>
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
                    {this.renderHeader()}
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
                    {this.props.children}
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
        {this.props.onPessSubmitButton && Device.isIphoneX() && <View style={this.props.activeSubmitButton ? styles.iphoneXFooter : styles.inactiveIphoneXFooter} />}
      </View>
    )
  }
}

export default withNavigation(Screen)

function getTopSafeArea () {
  if (Platform.OS === 'android') {
    return Constants.statusBarHeight
  } else {
    if (Device.isIphoneX()) {
      return 44
    } else {
      return 20
    }
  }

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  safeArea: {
    marginTop: getTopSafeArea(),
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
  },
  iphoneXFooter: {
    height: 34,
    backgroundColor: COLORS.P500
  },
  inactiveIphoneXFooter: {
    height: 34,
    backgroundColor: COLORS.P200
  }
})

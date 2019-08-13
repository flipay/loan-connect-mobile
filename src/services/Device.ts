
import Constants from 'expo-constants'

export function isIphoneX (): boolean {
  return !!(Constants.platform &&
    Constants.platform.ios &&
    Constants.platform.ios.model.toLowerCase().includes('iphone x'))
}
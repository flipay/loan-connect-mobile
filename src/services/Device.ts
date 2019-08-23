
import Constants from 'expo-constants'

const iphoneXFooter = 34

export function isIphoneX (): boolean {
  return !!(Constants.platform &&
    Constants.platform.ios &&
    Constants.platform.ios.model.toLowerCase().includes('iphone x'))
}

export function getFooterHeight () {
  return isIphoneX() ? iphoneXFooter : 0
}
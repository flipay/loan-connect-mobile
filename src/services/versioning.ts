import axios from 'axios'
import _ from 'lodash'
import compareVersions from 'compare-versions'
import { getEnv } from '../services/Env'
import { NetInfo, Alert, Platform } from 'react-native'
import { Updates } from 'expo'
import * as ErrorReport from './ErrorReport'
import * as Amplitude from 'expo-analytics-amplitude'
import Constants from 'expo-constants'
import { navigate } from '../services/navigation'

async function getLastSupportedVersion () {
  const request = axios.create({
    baseURL: 'https://storage.googleapis.com/'
  })
  const response = await request.get('last-supported-version/lastSupportedVersions.txt')
  return _(response.data).split('\n').map(version => {
    return _.split(version, ':')
  }).fromPairs().value()
}

async function checkNewVersion (action: () => void) {
  if (getEnv() !== 'development') {

    const lastSupportedVersions = await getLastSupportedVersion()
    const nativeVersion = Constants.nativeAppVersion
    if (!nativeVersion) { throw Error('no native version') }
    const platform = Platform.OS
    if (platform !== 'ios' && platform !== 'android') {
      throw Error('not supported platform')
    }

    if (compareVersions(nativeVersion, lastSupportedVersions[platform]) < 0) {
      navigate('UpdateVersion')
    }
    Amplitude.setUserProperties({
      expo_version: Constants.expoVersion
    })

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync()
      if (isAvailable) {
        await action()
      } else {
        const otaVersion = Constants.manifest.version || '0'
        if (compareVersions(otaVersion, lastSupportedVersions.ota) < 0) {
          postError('The app is not up to date.')
          ErrorReport.message('The app is not up to date.')
        }
      }
    } catch (err) {
      const { type } = await NetInfo.getConnectionInfo()
      const errorMessage = 'Please connect to the internet.'
      if (type !== 'none') {
        ErrorReport.notify(err)
        checkNewVersion(action)
      }
      postError(errorMessage)
    }
  }
}

export async function reloadIfNewVersionAvailable () {
  await checkNewVersion(Updates.reloadFromCache)
}

export async function fetchNewVersionIfAvailable () {
  const fetchNewVersion = async () => {
    const { isNew } = await Updates.fetchUpdateAsync()

    if (isNew) {
      Updates.reloadFromCache()
    } else {
      const message = 'Could not get the new version of Flipay'
      postError(message)
    }
  }
  await checkNewVersion(fetchNewVersion)
}

function postError (message: string) {

  Alert.alert(
    message,
    'Please contact our customer support team',
    [{ text: 'Reload the app', onPress: Updates.reload }],
    { cancelable: false }
  )
}
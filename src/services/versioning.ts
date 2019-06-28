
import { getEnv } from '../utils'
import { NetInfo, Alert } from 'react-native'
import { Updates } from 'expo'
import Sentry from 'sentry-expo'

async function checkNewVersion (action: () => void) {
  if (getEnv() !== 'development') {
    try {
      const { isAvailable } = await Updates.checkForUpdateAsync()
      if (isAvailable) {
        await action()
      }
    } catch (err) {
      const { type } = await NetInfo.getConnectionInfo()
      const errorMessage = 'Please connect to the internet.'
      if (type !== 'none') {
        Sentry.captureException(err)
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
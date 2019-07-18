
import Constants from 'expo-constants'

type Env = 'production' | 'staging' | 'development'

export function getEnv (): Env {
  if (Constants.manifest.releaseChannel === 'default') {
    return 'production'
  } else if (Constants.manifest.releaseChannel === 'staging') {
    return 'staging'
  } else {
    return 'development'
  }
}
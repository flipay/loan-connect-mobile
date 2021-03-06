import _ from 'lodash'
import { Platform } from 'react-native'
import * as FileSystem from 'expo-file-system'
import BlueBird from 'bluebird'

export async function isJailBroken () {
  if (Platform.OS === 'android') {
    const rooted = await checkFilePaths(androidProhibitedPaths)
    return rooted
  } else {
    const jailBroken = await checkFilePaths(iosProhibitedPaths)
    return jailBroken
  }
}

async function isExisted (path: string) {
  try {
    const { exists } = await FileSystem.getInfoAsync(path)
    return exists
  } catch (err) {
    if (err.code === 'E_FILESYSTEM_PERMISSIONS' || err.code === 'E_UNKNOWN_ERROR') {
      return false
    } else {
      return true
    }
  }
}

async function checkFilePaths (paths: Array<any>) {
  const existedList = await BlueBird.map(paths, async (path) => {
    const existed = await isExisted(path)
    return existed
  })
  for (const existed of existedList) {
    if (existed) { return true }
  }
  return false
}

const androidProhibitedPaths = [
  '/system/app/Superuser.apk',
  '/sbin/su',
  '/system/bin/su',
  '/system/xbin/su',
  '/data/local/xbin/su',
  '/data/local/bin/su',
  '/system/sd/xbin/su',
  '/system/bin/failsafe/su',
  '/data/local/su'
]

const iosProhibitedPaths = [
  '/Applications/Cydia.app',
  '/Library/MobileSubstrate/MobileSubstrate.dylib',
  '/bin/bash',
  '/usr/sbin/sshd',
  '/etc/apt'
]
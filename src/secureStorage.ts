import CryptoJS from 'crypto-js'
import { Alert } from 'react-native'
import { SecureStore } from 'expo'

export async function encrypToken (token: string, pin: string) {
  const cipherText = CryptoJS.AES.encrypt(token, pin).toString()
  try {
    await SecureStore.setItemAsync('encrypted-token', cipherText)
  } catch (err) {
    Alert.alert('Authentication failed')
  }
  return ''
}

export async function decryptToken (pin: string) {
  try {
    const value = await SecureStore.getItemAsync('encrypted-token')
    if (value) {
      return CryptoJS.AES.decrypt(value, pin).toString(CryptoJS.enc.Utf8)
    }
    return ''
  } catch (err) {
    Alert.alert('Authentication failed')
    return ''
  }
}
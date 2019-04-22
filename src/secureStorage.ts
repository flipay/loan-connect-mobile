import CryptoJS from 'crypto-js'
import { Alert } from 'react-native'
import { SecureStore } from 'expo'

const ENCRYPTED_TOKEN = 'encrypted-token'
const HASHED_TOKEN = 'hashed-token'

export async function checkLoginStatus () {
  const value = await SecureStore.getItemAsync(ENCRYPTED_TOKEN)
  return !!value
}

export async function clearToken () {
  await SecureStore.deleteItemAsync(ENCRYPTED_TOKEN)
}

export async function setToken (token: string, pin: string) {
  const encrypted = CryptoJS.AES.encrypt(token, pin).toString()
  const hashed = CryptoJS.SHA256(token).toString()
  try {
    await SecureStore.setItemAsync(ENCRYPTED_TOKEN, encrypted)
    await SecureStore.setItemAsync(HASHED_TOKEN, hashed)
  } catch (err) {
    Alert.alert('Authentication failed')
  }
}

export async function getToken (pin: string) {
  const encrypted = await SecureStore.getItemAsync(ENCRYPTED_TOKEN)
  const hashed = await SecureStore.getItemAsync(HASHED_TOKEN)
  if (encrypted && hashed) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, pin).toString(CryptoJS.enc.Utf8)
    const decryptedHashed = CryptoJS.SHA256(decrypted).toString()
    if (hashed === decryptedHashed) {
      const token = decrypted
      return token
    } else {
      throw (Error('wrong pin'))
    }
  }
  throw (Error('no credential available'))
}
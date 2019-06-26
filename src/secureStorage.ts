import CryptoJS from 'crypto-js'
import { Alert } from 'react-native'
import { SecureStore } from 'expo'
import { navigate } from './services/navigation'

const ENCRYPTED_TOKEN = 'flipay-encrypted-token'
const HASHED_TOKEN = 'flipay-hashed-token'
const WRONG_PIN_ATTEMPTS = 'wrong-pin-attempts'

export async function getWrongPinAttempts () {
  const attempts = await SecureStore.getItemAsync(WRONG_PIN_ATTEMPTS)
  return isNaN(Number(attempts)) ? 0 : Number(attempts)
}
export async function setWrongPinAttempts (value: number) {
  await SecureStore.setItemAsync(WRONG_PIN_ATTEMPTS, String(value))
}

export async function resetWrongPinAttempts () {
  await SecureStore.deleteItemAsync(WRONG_PIN_ATTEMPTS)
}

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
    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, pin).toString(CryptoJS.enc.Utf8)
      const decryptedHashed = CryptoJS.SHA256(decrypted).toString()
      if (hashed === decryptedHashed) {
        await resetWrongPinAttempts()
        const token = decrypted
        return token
      } else {
        await handleWrongPIN()
      }
    } catch (err) {
      await handleWrongPIN()
    }
  }
  throw (Error('no credential available'))
}

async function handleWrongPIN () {
  const wrongAttempts = await getWrongPinAttempts()
  const newWrongAttempts = wrongAttempts + 1
  if (newWrongAttempts >= 5) {
    await Promise.all([clearToken(), resetWrongPinAttempts()])
    Alert.alert(
      'Too many wrong attempts',
      'Please login again.',
      [{
        text: 'OK',
        onPress: async () => {
          navigate('Starter')
        }
      }],
      { cancelable: false }
    )
  } else {
    await setWrongPinAttempts(newWrongAttempts)
    throw (Error('wrong pin'))
  }
}
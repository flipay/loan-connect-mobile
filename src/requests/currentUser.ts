
import axios from 'axios'
import _ from 'lodash'
import { CurrentUser, EditableCurrentUser } from '../types'

export async function getCurrentUser (): Promise<CurrentUser | null> {
  const { data } = await axios.get('users/me')
  if (data && data.data) {
    return _.mapKeys(data.data, (value, key) => _.camelCase(key))
  }
  return null
}

export async function setUserContext (user: EditableCurrentUser) {
  await axios.patch('users/me', {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email
  })
}

export async function hasEmailAndName () {
  const users = await getCurrentUser()
  return users && users.email && users.firstName && users.lastName
}

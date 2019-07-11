
import axios from 'axios'
import _ from 'lodash'
import { CurrentUser } from '../types'

export async function getCurrentUser (): Promise<CurrentUser | null> {
  const { data } = await axios.get('users/me')
  if (data && data.data) {
    return _.mapKeys(data.data, _.camelCase)
  }
  return null
}

export async function hasEmailAndName () {
  const users = await getCurrentUser()
  return users && users.email && users.firstName && users.lastName
}

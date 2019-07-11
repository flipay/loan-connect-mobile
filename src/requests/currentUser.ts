
import axios from 'axios'
import _ from 'lodash'

export async function getCurrentUser () {
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

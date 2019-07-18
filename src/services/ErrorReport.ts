import Sentry from 'sentry-expo'
import bugsnag, { Bugsnag } from '@bugsnag/expo'

let bugsnagClient: Bugsnag.Client
let initialized = false

export function initialize () {
  bugsnagClient = bugsnag()

  // NOTE: for testing Sentry locally
  // Sentry.enableInExpoDevelopment = true
  Sentry.config(
    'https://7461bec2f42c41cdafde6f0048ac0047@sentry.io/1438488'
  ).install()
  initialized = true
}

export function setUserContext (uid: string, name: string , email: string, phoneNumber: string) {
  Sentry.setUserContext({
    id: uid,
    email,
    extra: {
      name,
      phoneNumber
    }
  })
}

export function notify (err: Error) {
  if (!initialized) { initialize() }
  bugsnagClient.notify(err)
  Sentry.captureException(err)
}

export function message (text: string) {
  if (!initialized) { initialize() }
  Sentry.captureBreadcrumb({ message: text })
  bugsnagClient.leaveBreadcrumb(text)
}

export function getErrorBoundary () {
  if (!initialized) { initialize() }
  return bugsnagClient.getPlugin('react')
}
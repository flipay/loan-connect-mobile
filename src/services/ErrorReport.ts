import Sentry from 'sentry-expo'
import bugsnag, { Bugsnag } from '@bugsnag/expo'
import { getEnv } from './Env'

let bugsnagClient: Bugsnag.Client
let initialized = false
let developmentEnabled = false

export function initialize () {
  const notifyReleaseStages = ['production', 'staging']
  if (developmentEnabled) {
    notifyReleaseStages.push('development')
    Sentry.enableInExpoDevelopment = true
  }
  bugsnagClient = bugsnag({
    releaseStage: getEnv(),
    notifyReleaseStages
  })
  Sentry.config(
    'https://7461bec2f42c41cdafde6f0048ac0047@sentry.io/1438488'
  ).install()
  initialized = true
}

export function enableInDevelopment () {
  developmentEnabled = true
}

function createErrorReportFunction (action: any) {
  return (...args: Array<any>) => {
    if (!initialized) { initialize() }
    action(...args)
  }
}

export const setUserContext = createErrorReportFunction(
  (uid: string, name: string , email: string, phoneNumber: string) => {
    Sentry.setUserContext({
      id: uid,
      email,
      extra: {
        name,
        phoneNumber
      }
    })
  }
)

export const notify = createErrorReportFunction(
  (err: Error) => {
    bugsnagClient.notify(err)
    Sentry.captureException(err)
  }
)

export const message = createErrorReportFunction(
  (text: string) => {
    Sentry.captureBreadcrumb({ message: text })
    bugsnagClient.leaveBreadcrumb(text)
  }
)

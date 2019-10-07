import { YellowBox } from 'react-native'
import * as Sentry from 'sentry-expo'
import bugsnag, { Bugsnag } from '@bugsnag/expo'
import { getEnv } from './Env'

let bugsnagClient: Bugsnag.Client
let initialized = false
let developmentEnabled = false

YellowBox.ignoreWarnings(['[bugsnag] "Session not sent'])

export function initialize () {
  const notifyReleaseStages = ['production', 'staging']
  if (developmentEnabled) {
    notifyReleaseStages.push('development')
  }
  bugsnagClient = bugsnag({
    releaseStage: getEnv(),
    notifyReleaseStages
  })
  Sentry.init({
    dsn: 'https://7461bec2f42c41cdafde6f0048ac0047@sentry.io/1438488',
    enableInExpoDevelopment: true,
    debug: true
  })
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
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: uid,
        email,
        extra: {
          name,
          phoneNumber
        }
      })
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
    Sentry.addBreadcrumb({ message: text })
    bugsnagClient.leaveBreadcrumb(text)
  }
)

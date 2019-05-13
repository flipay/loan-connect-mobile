import { Amplitude, Constants } from 'expo'
import _ from 'lodash'

type Event = 'open-the-app'
  | 'welcome/press-create-account-or-login-button'
  | 'authen/submit-phone-number'
  | 'authen/press-back-button'
  | 'verify-phone-number/timeout'
  | 'verify-phone-number/press-backspace'
  | 'verify-phone-number/successfully-verified'
  | 'verify-phone-number/sms-code-incorrect'
  | 'verify-phone-number/press-resend-code-link'
  | 'verify-phone-number/press-next-button'
  | 'verify-phone-number/press-boxes'
  | 'verify-phone-number/press-back-button'
  | 'create-pin/finish-creating-pin'
  | 'confirm-pin/pin-match'
  | 'confirm-pin/successfully-setting-pin'
  | 'confirm-pin/error-setting-pin'
  | 'confirm-pin/pin-does-not-match'
  | 'unlock/wrong-pin'
  | 'unlock/successfully-unlock'
  | 'tab-bar/press-buy-sell-menu'
  | 'tab-bar/press-account-menu'
  | 'main/pull-the-screen-to-reload'
  | 'main/press-deposit-from-welcome-message'
  | 'main/press-deposit-button'
  | 'main/press-withdraw-button'
  | 'main/press-transfer-button'
  | 'main/press-trade-button'
  | 'main/press-deposit-button-on-tranfer-modal'
  | 'main/press-withdraw-button-on-tranfer-modal'
  | 'main/press-outside-tranfer-modal'
  | 'main/close-asset-card'
  | 'main/open-asset-card'
  | 'deposit/press-back-button'
  | 'deposit/press-done'
  | 'withdrawal/press-back-button'
  | 'withdrawal/press-amount-box'
  | 'withdrawal/press-account-number-box'
  | 'withdrawal/press-account-name-box'
  | 'withdrawal/change-account-issuer'
  | 'withdrawal/press-submit-button'
  | 'withdrawal/press-ok-button'
  | 'trade/press-asset-box'
  | 'trade/press-submit-button'
  | 'trade/press-back-button'
  | 'trade/press-price-comparison-link'
  | 'trade-result/press-done-button'
  | 'comparison/press-close-button'
  | 'account/press-sign-out'
  | 'account/press-contact-us-by-line'

let isInitialized = false
const apiKey = 'ca298c390e996d2d0ca61eeabf1a7756'

function isProduction () {
  const releaseChannel = Constants.manifest.releaseChannel
  return _.includes(releaseChannel, 'default')
}

const initialize = () => {
  if (!isProduction()) {
    return
  }
  Amplitude.initialize(apiKey)
  isInitialized = true
}

const maybeInitialize = () => {
  if (!isInitialized) {
    initialize()
  }
}

export function identify (id: string, options?: object) {
  maybeInitialize()
  if (id) {
    Amplitude.setUserId(id)
    if (options) {
      Amplitude.setUserProperties(options)
    }
  } else {
    Amplitude.clearUserProperties()
  }
}

export function logEvent (event: Event, options: any = null) {
  maybeInitialize()
  if (options) {
    Amplitude.logEventWithProperties(event, options)
  } else {
    Amplitude.logEvent(event)
  }
}

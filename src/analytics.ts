import { Amplitude, Constants } from 'expo'

type Event = 'kak'

let isInitialized = false
const apiKey = 'ca298c390e996d2d0ca61eeabf1a7756'

function isProduction () {
  const releaseChannel = Constants.manifest.releaseChannel
  return releaseChannel.indexOf('prod') !== -1
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

// const identify = (id: ?string, options?: ?Object = null) => {
//   maybeInitialize()
//   options = normalizeTrackingOptions(options)

//   if (id) {
//     Amplitude.setUserId(id)
//     if (options) {
//       Amplitude.setUserProperties(options)
//     }
//   } else {
//     Amplitude.clearUserProperties()
//   }
// }

const track = (event: Event, options: any = null) => {
  maybeInitialize()
  if (options) {
    Amplitude.logEventWithProperties(event, options)
  } else {
    Amplitude.logEvent(event)
  }
}

export default {
  track
  // identify
}

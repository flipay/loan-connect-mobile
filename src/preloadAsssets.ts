
import { Image } from 'react-native'
import { Asset, Font } from 'expo'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

function loadImages (images: Array<string | number>) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })
}

export default async function preloadAssets () {

  const fontPromise = Font.loadAsync({
    nunito: require('../assets/fonts/Nunito-Regular.ttf'),
    'nunito-semibold': require('../assets/fonts/Nunito-Regular.ttf')
    // 'font-awesome': FontAwesome.font
  })

  const icons = [FontAwesome.font, MaterialIcons.font]
  const iconPromises = icons.map((icon) => Font.loadAsync(icon))

  const imagePromises = loadImages([require('./img/flipay_horizontal_logo_reverse.png')])
  await Promise.all([fontPromise, ...iconPromises, ...imagePromises])
}
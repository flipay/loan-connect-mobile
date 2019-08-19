import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { COLORS } from '../constants'
import { OrderType } from '../types'

interface Props {
  type: OrderType
  size: number
  style?: any
}

export default class OrderTypeIcon extends React.Component<Props> {
  public render () {
    const { size, type } = this.props
    return (
      <View
        style={[
          this.props.style,
          styles.icon,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: type ? COLORS.P400 : COLORS.Y400
          }
        ]}
      >
        <Entypo
          name={type ? 'flash' : 'back-in-time'}
          color={COLORS.WHITE}
          size={15}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

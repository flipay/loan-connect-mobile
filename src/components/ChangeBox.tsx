import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { toString, toNumber } from '../utils'
import { COLORS } from '../constants'
import { Text } from '../components'

interface Props {
  value: number
}

export default class ChangeBox extends React.Component<Props> {
  public isNegative () {
    const valueInString = toString(this.props.value, 2)
    const valueInNumber = toNumber(valueInString)
    return valueInNumber < 0
  }

  public getColor () {
    return this.isNegative() ? COLORS.R400 : COLORS.G400
  }

  public render () {
    const valueInString = toString(Math.abs(this.props.value), 2)
    return (
      <View style={[styles.container, { backgroundColor: this.getColor() + '15' }]}>
        <MaterialIcons
          size={20}
          name={this.isNegative() ? 'arrow-drop-down' : 'arrow-drop-up'}
          color={this.getColor()}
        />
        <Text color={this.getColor()}>{`${valueInString}%`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  }
})
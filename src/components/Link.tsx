import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from '../components'
import { COLORS } from '../constants'

interface Props {
  onPress: () => void
  children: string
}

export default class Link extends React.Component<Props> {
  public render () {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text color={COLORS.P400} type='button'>{this.props.children}</Text>
      </TouchableOpacity>
    )
  }
}
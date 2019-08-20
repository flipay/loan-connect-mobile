import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import Text from './Text'
import { COLORS } from '../constants'

interface Props {
  onPress: () => void
  children: string
  style?: any
}

export default class Link extends React.Component<Props> {
  public render () {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={this.props.style}>
        <Text color={COLORS.P400} type='button' bold={true}>{this.props.children}</Text>
      </TouchableOpacity>
    )
  }
}
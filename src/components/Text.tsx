import React from 'react'
import { Text, TextStyle } from 'react-native'
import { FONT_TYPES } from '../constants'
import { FontType } from '../types'

interface Props {
  children: JSX.Element | Array<JSX.Element> | string | Array<string>
  type: FontType | 'inherit'
  color?: string
  style?: any
  inherit?: boolean
}

class FlipText extends React.Component<Props> {
  public static defaultProps = {
    type: 'body'
  }

  public render () {
    const { style, ...otherProps } = this.props
    return (
      <Text
        style={[
          {
            fontFamily:
              this.props.type === 'inherit'
                ? undefined
                : FONT_TYPES[this.props.type].fontFamily,
            fontSize:
              this.props.type === 'inherit'
                ? undefined
                : FONT_TYPES[this.props.type].fontSize,
            color:
              this.props.type === 'inherit'
                ? undefined
                : this.props.color || FONT_TYPES[this.props.type].defaultColor
          },
          style
        ]}
        {...otherProps}
      >
        {this.props.children}
      </Text>
    )
  }
}

export default FlipText

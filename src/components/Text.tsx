import React from 'react'
import { Text } from 'react-native'
import { FONT_TYPES, FontType } from '../constants/styleGuides'

interface Props {
  children: any
  type: FontType
  color?: string
  style?: any
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
            fontFamily: FONT_TYPES[this.props.type].fontFamily,
            fontSize: FONT_TYPES[this.props.type].fontSize,
            color: this.props.color
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

import React from 'react'
import { Text } from 'react-native'
import { FONT_TYPES, FontType } from '../constants/styleGuides'

interface Props {
  children: any
  type: FontType
  color: string
  style: any
}

class FlipText extends React.Component<Props> {

    // IMPORTANT NOTE: we need to put I18n.locale in render funtion
    // so that it is calculated at the render time
    // the initial problem is that I18n.locale might change an instant
    // after starting the app
    // resulting in having the wrong font family because of wrong I18n.locale
    // the best solution would be putting locale in redux store so that
    // things get rerendered again if the locale changes

  public render () {
    const { style, ...otherProps } = this.props
    return (
      <Text
        style={[
          {
            fontFamily: 'Nunito',
            fontSize: this.props.type
              ? FONT_TYPES[this.props.type].fontSize
              : FONT_TYPES.body.fontSize,
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

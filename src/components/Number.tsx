import React from 'react'
import Text from './Text'

interface Props {
  children: number
  style?: any
}

class FlipNumber extends React.Component<Props> {
  public render () {
    const { style, ...otherProps } = this.props
    return (
      <Text
        style={this.props.style}
        type='inherit'
        {...otherProps}
      >
        {this.props.children.toLocaleString(
          undefined,
          { maximumFractionDigits: 8 }
        )}
      </Text>
    )
  }
}

export default FlipNumber

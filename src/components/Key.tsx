
import * as React from 'react'
import { TouchableHighlight, StyleSheet } from 'react-native'
import { Text } from '../components'

interface Props {
  children: number | JSX.Element
  onPress: () => void
}

export default class Key extends React.Component<Props>{
  public render () {
    return (
      <TouchableHighlight onPress={this.props.onPress} style={styles.container}>
        {typeof this.props.children === 'number'
          ? (
            <Text type='title'>
              {String(this.props.children)}
            </Text>
          ) : (
            this.props.children
          )
        }
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
    borderRadius: 32
  }
})
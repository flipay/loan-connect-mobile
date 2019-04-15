import * as React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS } from '../constants'

interface Props {
  children: any
  onPress?: () => void
}

export default class Record extends React.Component<Props> {

  public render () {
    return (
      <TouchableOpacity
        style={styles.record}
        onPress={this.props.onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  record: {
    borderTopColor: COLORS.N200,
    borderTopWidth: 1
  }
})

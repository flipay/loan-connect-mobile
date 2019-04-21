import * as React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { COLORS } from '../constants'

interface Props {
  children: any
  onPress?: () => void
}

export default class Record extends React.Component<Props> {
  public render () {
    const Container = this.props.onPress ? TouchableOpacity : View
    return (
      <Container style={styles.container} onPress={this.props.onPress}>
        <View style={styles.record}>{this.props.children}</View>
        {this.props.onPress && (
          <AntDesign
            name='right'
            color={COLORS.N500}
            style={styles.arrowIcon}
            size={16}
          />
        )}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopColor: COLORS.N200,
    borderTopWidth: 1
  },
  record: {
    flex: 1,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  arrowIcon: {
    marginTop: 5,
    marginRight: 5,
    marginLeft: 10
  }
})

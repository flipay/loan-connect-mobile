import * as React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import Text from './Text'
import { COLORS } from '../constants/styleGuides'

interface Props {
  description: string
}

export default class TradeBox extends React.Component<Props> {
  public render () {
    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text color={COLORS.N500}>
            {this.props.description}
          </Text>
          <TextInput />
        </View>
        <View style={styles.rightContainer}>
          <Text>
            $ DOL
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.N100,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16
  },
  leftContainer: {
    flex: 2,
    padding: 16
  },
  rightContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.N200,
    justifyContent: 'center',
    paddingLeft: 16
  }
})
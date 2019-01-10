import * as React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { FontAwesome } from '@expo/vector-icons'
import { Text, TradeBox } from '../components'
import { COLORS } from '../constants/styleGuides';

export default class TradeScreen extends React.Component<
  NavigationScreenProps
> {
  public static navigationOptions = (props: NavigationScreenProps) => {
    return {
      title: `${props.navigation.getParam(
        'side',
        'Buy'
      )} ${props.navigation.getParam('coinId', 'Bitcoin')}`
    }
  }

  public renderCloseButton () {
    return (
      <View style={styles.closeButtonContainer}>
        <FontAwesome name='times' size={16} />
      </View>
    )
  }

  public renderBody () {
    return (
      <View style={styles.bodyContainer}>
        <Text type='title'>
          {`${this.props.navigation.getParam('side')} ${this.props.navigation.getParam('coinId')}`}
        </Text>
        <Text type='body' color={COLORS.N500}>
          3,000 THB available
        </Text>
        <View style={styles.tradeBoxesContainer}>
          <TradeBox
            description='You buy with'
          />
          <TradeBox
            description='You will receive'
          />
        </View>
      </View>
    )
  }

  public render () {
    return (
      <ScrollView
        style={{
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        {this.renderCloseButton()}
        {this.renderBody()}

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  closeButtonContainer: {
    alignContent: 'flex-start',
    marginLeft: 18
  },
  bodyContainer: {
    alignItems: 'center'
  },
  tradeBoxesContainer: {
    marginTop: 42,
    paddingHorizontal: 20,
    width: '100%'
  }
})

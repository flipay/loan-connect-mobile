import * as React from 'react'
import * as _ from 'lodash'
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ImageSourcePropType
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { LinearGradient } from 'expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, Number, CloseButton } from '../components'
import { COLORS } from '../constants/styleGuides'
import { ASSETS } from '../constants/assets'

interface RequestedRecord {
  name: string
  image: ImageSourcePropType
  amount: number
}

interface FormattedRecord {
  name: string
  image: ImageSourcePropType
  amount: number
  difference: number
}

type RequestedRecords = Array<RequestedRecord>

interface State {
  requestedData: RequestedRecords
}

type Side = 'buy' | 'sell'

export default class ComparisonScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  private interval: any = null

  public constructor (props: NavigationScreenProps) {
    super(props)
    this.state = {
      requestedData: []
    }
  }
  public componentDidMount () {
    this.requestData()
    this.interval = setInterval(() => {
      this.requestData()
    }, 5000)
  }

  public componentWillUnmount () {
    clearInterval(this.interval)
  }

  public requestData () {
    const mockData = [
      {
        name: 'Satang',
        amount: 1400,
        image: require('../img/btc.png')
      },
      {
        name: 'BX Thailand',
        amount: 3000,
        image: require('../img/btc.png')
      },
      {
        name: 'Bitkub',
        amount: 2000,
        image: require('../img/btc.png')
      },
      {
        name: 'flipay',
        amount: 1000,
        image: require('../img/btc.png')
      }
    ]

    this.setState({
      requestedData: mockData
    })
  }

  public onClose = () => {
    this.props.navigation.goBack()
  }

  public renderRecord (data: FormattedRecord, index: number) {
    const side = this.props.navigation.getParam('side', 'buy')
    return (
      <View style={styles.tableRecord} key={data.name}>
        <Image source={data.image} />
        <View style={styles.rightPartRecord}>
          <Text>
            <Number>{data.amount}</Number>
            {` THB`}
          </Text>
          {index === 0 ? (
            <Text type='caption' color={COLORS.N500}>
              Best Price
            </Text>
          ) : (
            <View style={styles.captionRow}>
              <MaterialCommunityIcons
                name={side ? 'trending-up' : 'trending-down'}
                color='#FE4747'
                style={styles.downTrendIcon}
              />
              <Text type='caption' color={COLORS.N500}>
                {side ? '+ ' : '- '}
                <Number>{data.difference}</Number>
                {` THB`}
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  }
  public renderTableBody (sortedRecords: Array<RequestedRecord>) {
    if (_.isEmpty(sortedRecords)) {
      return
    }
    const bestAmount = sortedRecords[0].amount
    const formatedRecords = _.map(sortedRecords, record => {
      return {
        ...record,
        difference: record.amount - bestAmount
      }
    })
    return (
      <View>
        {formatedRecords.map((record, index) =>
          this.renderRecord(record, index)
        )}
      </View>
    )
  }

  public renderTable (sortedRecords: Array<RequestedRecord>) {
    const side = this.props.navigation.getParam('side', 'buy')
    return (
      <View style={styles.table}>
        <View style={styles.header}>
          <Text color={COLORS.N500}>If you use</Text>
          <Text color={COLORS.N500}>
            {`You will ${side ? 'spend' : 'receive'}`}
          </Text>
        </View>
        {this.renderTableBody(sortedRecords)}
      </View>
    )
  }

  public renderTitle (side: Side, gain: number) {
    return side === 'buy'
      ? (
        <Text type='title' color={COLORS.WHITE}>
          Save <Number>{gain}</Number> THB with us!
        </Text>
      ) : (
        <Text type='title' color={COLORS.WHITE}>
           Earn <Number>{gain}</Number> THB more with us!
        </Text>
      )
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'buy')
    const assetId = this.props.navigation.getParam('assetId', 'bitcoin')
    const assetName = ASSETS[assetId].name
    const amount = this.props.navigation.getParam('amount', 1000)

    const flipayRecord = _.find(
      this.state.requestedData,
      record => record.name === 'flipay'
    )
    if (!flipayRecord) {
      return <View />
    }
    const flipayAmount = flipayRecord.amount
    const sortedRecords = _.sortBy(this.state.requestedData, record => {
      return record.amount * (side === 'sell' ? -1 : 1)
    })
    const worstAmount = sortedRecords[sortedRecords.length - 1].amount
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={styles.container}
      >
        <StatusBar barStyle='light-content' />
        <CloseButton onPress={this.onClose} color={COLORS.WHITE} />
        {this.renderTitle(side, Math.abs(flipayAmount - worstAmount))}
        <Text color={COLORS.WHITE}>
          {`Looks like Flipay is the best way to ${side}`}
        </Text>
        <Text color={COLORS.WHITE}>
          <Number>{amount}</Number>
          {` ${assetName}`}
        </Text>
        {this.renderTable(sortedRecords)}
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 86,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'blue',
    position: 'relative'
  },
  table: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    marginTop: 24,
    width: '100%',
    borderRadius: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 8
  },
  tableRecord: {
    borderTopColor: COLORS.N200,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 24
  },
  rightPartRecord: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  downTrendIcon: {
    marginRight: 4
  }
})

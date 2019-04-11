import * as React from 'react'
import _ from 'lodash'
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ImageSourcePropType
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import resolveAssetSource from 'resolveAssetSource'
import { LinearGradient, Amplitude } from 'expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, Value, CloseButton } from '../components'
import { COLORS, PROVIDERS } from '../constants'
import { AssetId, OrderType } from '../types'

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

interface Props {
  data: RequestedRecords
}

type Side = OrderType

export default class ComparisonScreen extends React.Component<
  Props & NavigationScreenProps
> {
  public onClose = () => {
    Amplitude.logEvent('comparison/press-close-button')
    this.props.navigation.goBack()
  }

  public getStructuredData () {
    const competitorAmounts = this.props.navigation.getParam('competitorAmounts')
    const flipayAmount = this.props.navigation.getParam('flipayAmount')
    return _.map(PROVIDERS, (provider) => {
      if (provider.id === 'liquid') {
        return ({
          ...provider,
          amount: flipayAmount
        })
      } else {
        return ({
          ...provider,
          amount: competitorAmounts[provider.id]
        })
      }
    })
  }

  public renderRecord (data: FormattedRecord, index: number) {
    const side = this.props.navigation.getParam('side', 'sell')
    const image = data.image
    const source = resolveAssetSource(image)
    return (
      <View style={styles.tableRecord} key={data.name}>
        <Image source={image} style={{ width: source.width / 2, height: source.height / 2 }} />
        <View style={styles.rightPartRecord}>
          <Value assetId='THB'>{data.amount}</Value>
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
                {side === 'buy' ? '+ ' : '- '}
                <Value assetId='THB'>{data.difference}</Value>
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
        difference: Math.abs(record.amount - bestAmount)
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
    const side = this.props.navigation.getParam('side', 'sell')
    return (
      <View style={styles.table}>
        <View style={styles.header}>
          <Text color={COLORS.N500}>If you use</Text>
          <Text color={COLORS.N500}>
            {`You will ${side === 'buy' ? 'spend' : 'receive'}`}
          </Text>
        </View>
        {this.renderTableBody(sortedRecords)}
      </View>
    )
  }

  public renderTitle (side: Side, gain: number) {
    console.log('kneod jaa eieieieiei', gain)
    return side === 'buy'
      ? (
        <Text type='title' color={COLORS.WHITE}>
          Save <Value assetId='THB'>{gain}</Value> with us!
        </Text>
      ) : (
        <Text type='title' color={COLORS.WHITE}>
           Earn <Value assetId='THB'>{gain}</Value> more with us!
        </Text>
      )
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'sell')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'bitcoin')
    const cryptoAmount = this.props.navigation.getParam('cryptoAmount', 1000)
    const structuredData = this.getStructuredData()
    const sortedRecords = _.sortBy(structuredData, record => {
      return record.amount * (side === 'sell' ? -1 : 1)
    })
    const best = sortedRecords[0]
    const worstAmount = sortedRecords[sortedRecords.length - 1].amount

    console.log('kendo ja aeirjaoejraewifjaesfi', best.amount, typeof best.amount)
    console.log('kendo ja aeirjaoejraewifjaesfi 2', worstAmount, typeof worstAmount)
    console.log('kendo ja aeirjaoejraewifjaesfi abs', Math.abs(best.amount - worstAmount))
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={styles.container}
      >
        <StatusBar barStyle='light-content' />
        <CloseButton onPress={this.onClose} color={COLORS.WHITE} />
        {this.renderTitle(side, Math.abs(best.amount - worstAmount))}
        <Text color={COLORS.WHITE}>
          {`Looks like ${best.name} is the best way to ${side}`}
        </Text>
        <Text color={COLORS.WHITE}>
          <Value assetId={assetId} full={true}>{cryptoAmount}</Value>
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

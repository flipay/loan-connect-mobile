import * as React from 'react'
import _ from 'lodash'
import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  ImageSourcePropType,
  SafeAreaView
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import resolveAssetSource from 'resolveAssetSource'
import { LinearGradient, Amplitude } from 'expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, Value, CloseButton } from '../components'
import { COLORS, PROVIDERS } from '../constants'
import { AssetId } from '../types'
import { calSaveAmount } from '../utils'

interface RequestedRecord {
  id: string
  name: string
  image: ImageSourcePropType
  amount: number
}

interface FormattedRecord {
  id: string
  name: string
  image: ImageSourcePropType
  amount: number
  difference: number
}

type RequestedRecords = Array<RequestedRecord>

interface Props {
  data: RequestedRecords
}

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
          amount: _.round(flipayAmount)
        })
      } else {
        return ({
          ...provider,
          amount: _.round(competitorAmounts[provider.id])
        })
      }
    })

  }

  public renderValidRecord (data: FormattedRecord, index: number) {
    const side = this.props.navigation.getParam('side', 'sell')
    return (
      <View style={styles.validRecord}>
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
    )
  }

  public renderRecord (data: FormattedRecord, index: number) {
    const image = data.image
    const source = resolveAssetSource(image)
    return (
      <View style={styles.tableRecord} key={data.name}>
        <Image source={image} style={{ width: source.width / 2, height: source.height / 2 }} />
        <View style={styles.rightPartRecord}>
          {isNaN(data.amount)
            ? <Text type='caption' color={COLORS.N500}>Unavailable</Text>
            : this.renderValidRecord(data, index)
          }
        </View>
      </View>
    )
  }
  public renderTableBody (sortedRecords: Array<RequestedRecord>) {
    if (_.isEmpty(sortedRecords)) {
      return
    }
    const roundedBestAmount = _.round(sortedRecords[0].amount)
    const formatedRecords = _.map(sortedRecords, record => {
      const roundedAmount = _.round(record.amount)
      return {
        ...record,
        amount: roundedAmount,
        difference: Math.abs(roundedAmount - roundedBestAmount)
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

  public renderTitle () {
    const side = this.props.navigation.getParam('side', 'sell')
    const flipayAmount = this.props.navigation.getParam('flipayAmount', 'sell')
    const competitorAmounts = this.props.navigation.getParam('competitorAmounts')
    return (
      <Text type='title' color={COLORS.WHITE}>
        Save <Value assetId='THB' decimal={2}>{calSaveAmount(side, flipayAmount, competitorAmounts)}</Value> with us!
      </Text>
    )
  }

  public renderSubtitle (best: RequestedRecord) {
    const side = this.props.navigation.getParam('side', 'sell')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'bitcoin')
    const cryptoAmount = this.props.navigation.getParam('cryptoAmount', 1000)
    const quility = best.id === 'liquid' ? 'best' : 'competitive'
    return (
        <View style={styles.subtitle}>
          <Text color={COLORS.WHITE}>
            {`Looks like Flipay offers the ${quility} price`}
          </Text>
          <Text color={COLORS.WHITE}>
            {` for ${side}ing `}
            <Value assetId={assetId} full={true}>{cryptoAmount}</Value>
          </Text>
        </View>
    )
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'sell')
    const flipayAmount = this.props.navigation.getParam('flipayAmount', 'sell')
    const structuredData = this.getStructuredData()

    // NOTE: _.sortBy will preserve the order the the value is the same
    // in this case we want flipay to be on top if they have the save value as flipay
    // so make sure flipay is on the top
    const sortedRecords = _.sortBy(structuredData, record => {
      return record.amount * (side === 'sell' ? -1 : 1)
    })
    const best = sortedRecords[0]
    const worst = _.findLast(sortedRecords, (record) => !isNaN(record.amount))
    if (!worst) { return null }
    return (
      <LinearGradient
        colors={[COLORS.P400, COLORS.C500]}
        start={[0.3, 0.7]}
        end={[2, -0.8]}
        style={styles.screen}
      >
        <SafeAreaView style={styles.screen}>
          <View style={styles.content}>
            <StatusBar barStyle='light-content' />
            <CloseButton onPress={this.onClose} color={COLORS.WHITE} />
            {this.renderTitle(flipayAmount, worst.amount)}
            {this.renderSubtitle(best)}
            {this.renderTable(sortedRecords)}
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 42,
    paddingHorizontal: 12
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
    height: 80,
    paddingVertical: 24
  },
  rightPartRecord: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  validRecord: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  downTrendIcon: {
    marginRight: 4
  },
  subtitle: {
    marginTop: 12,
    alignItems: 'center'
  }
})

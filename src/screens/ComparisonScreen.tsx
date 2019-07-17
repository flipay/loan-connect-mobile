import * as React from 'react'
import _ from 'lodash'
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import resolveAssetSource from 'resolveAssetSource'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, Value } from '../components'
import { COLORS, PROVIDERS } from '../constants'
import { AssetId } from '../types'
import { calSaveAmount } from '../utils'
import { logEvent } from '../analytics'
import GradientScreen from '../components/GradientScreen'

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

  private willFocusSubscription: any
  public componentDidMount () {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        logEvent(`comparison/land-on-the-screen`)
      }
    )
  }

  public componentWillUnmount () {
    this.willFocusSubscription.remove()
  }

  public onClose = () => {
    logEvent('comparison/press-close-button')
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
        const value = competitorAmounts[provider.id]
        const amount = Number(value)
        return ({
          ...provider,
          amount: isNaN(amount) ? value : _.round(amount)
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
              name={side === 'buy' ? 'trending-up' : 'trending-down'}
              color='#FE4747'
              style={styles.downTrendIcon}
            />
            <View style={styles.captionData}>
              <Text type='caption' color={COLORS.N500}>{side === 'buy' ? '+ ' : '- '}</Text>
              <Value assetId='THB' fontType='caption' color={COLORS.N500}>{data.difference}</Value>
            </View>
          </View>
        )}
      </View>
    )
  }

  public renderInvalidCase (errorCode: string) {
    const errorMessage = errorCode === 'maximum_exceeded' ? 'Insufficient Volume' : 'Unavailable'
    return <Text type='caption' color={COLORS.N500}>{errorMessage}</Text>
  }

  public renderRecord (data: FormattedRecord, index: number) {
    const image = data.image
    const source = resolveAssetSource(image)
    return (
      <View style={styles.tableRecord} key={data.name}>
        <Image source={image} style={{ width: source.width / 2, height: source.height / 2 }} />
        <View style={styles.rightPartRecord}>
          {typeof data.amount === 'number'
            ? this.renderValidRecord(data, index)
            : this.renderInvalidCase(data.amount)
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
      const amount = record.amount
      return {
        ...record,
        difference: Math.abs(amount - roundedBestAmount)
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
      <View style={{ flexDirection: 'row' }}>
        <Text type='title' color={COLORS.WHITE}>{`Save `}</Text>
        <Value assetId='THB' decimal={2} fontType='title' color={COLORS.WHITE}>{calSaveAmount(side, flipayAmount, competitorAmounts)}</Value>
        <Text type='title' color={COLORS.WHITE}>{` with us!`}</Text>
      </View>
    )
  }

  public renderSubtitle (best: RequestedRecord) {
    const side = this.props.navigation.getParam('side', 'sell')
    const assetId: AssetId = this.props.navigation.getParam('assetId', 'BTC')
    const cryptoAmount = this.props.navigation.getParam('cryptoAmount', 1000)
    const quility = best.id === 'liquid' ? 'best' : 'competitive'
    return (
        <View style={styles.subtitle}>
          <Text color={COLORS.WHITE}>
            {`Looks like Flipay offers the ${quility} price`}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text color={COLORS.WHITE}>{` for ${side}ing `}</Text>
            <Value assetId={assetId} full={true} fontType='body' color={COLORS.WHITE}>{cryptoAmount}</Value>
          </View>
        </View>
    )
  }

  public render () {
    const side = this.props.navigation.getParam('side', 'sell')
    const structuredData = this.getStructuredData()

    // NOTE: _.sortBy will preserve the order the the value is the same
    // in this case we want flipay to be on top if they have the save value as flipay
    // so make sure flipay is on the top
    const sortedRecords = _.sortBy(structuredData, record => {
      return record.amount * (side === 'sell' ? -1 : 1)
    })
    const best = sortedRecords[0]
    const worst = _.findLast(sortedRecords, (record) => (typeof record.amount === 'number'))
    if (!worst) { return null }
    return (
      <GradientScreen
        onPressBackButton={this.onClose}
      >
        {this.renderTitle()}
        {this.renderSubtitle(best)}
        {this.renderTable(sortedRecords)}
      </GradientScreen>
    )
  }
}

const styles = StyleSheet.create({
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
  captionData: {
    flexDirection: 'row'
  },
  downTrendIcon: {
    marginRight: 4
  },
  subtitle: {
    marginTop: 12,
    alignItems: 'center'
  }
})

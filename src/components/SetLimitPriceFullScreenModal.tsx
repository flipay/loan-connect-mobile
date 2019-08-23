import * as React from 'react'
import _ from 'lodash'
import { Modal, View, StyleSheet } from 'react-native'
import Screen from './Screen'
import Text from './Text'
import Asset from './Asset'
import AssetBox from './AssetBox'
import { AssetId, OrderSide } from '../types'
import { ASSETS } from '../constants'
import { toString, toNumber } from '../utils'

interface Props {
  initialPrice?: number
  assetId: AssetId
  orderSide: OrderSide
  onSetPrice: (price: number) => void,
  onClose: () => void
}

interface State {
  price?: number
  priceBoxActive: boolean
}

export default class SetLimitPriceFullScreenModal extends React.Component <Props, State> {

  public constructor (props: Props) {
    super(props)
    this.state = {
      price: this.props.initialPrice,
      priceBoxActive: true
    }
  }

  public onSetPrice = (value: string) => {
    this.setState({ price: toNumber(value) })
  }

  public onPressPriceBox = () => {
    this.setState({ priceBoxActive: true })
  }

  public renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text type='headline' style={styles.title}>{`Set ${_.capitalize(this.props.orderSide)} limit price `}</Text>
        <Asset id={this.props.assetId} />
      </View>
    )
  }

  public render () {
    const assetBoxAssetId = 'THB'
    return (
      <Modal animationType='slide'>
        <Screen
          onPressBackButton={this.props.onClose}
          header={this.renderHeader}
          activeSubmitButton={!!this.state.price}
          onPessSubmitButton={() => this.props.onSetPrice(this.state.price || 0)}
        >
          <AssetBox
            autoFocus={true}
            description={`Limit price per ${ASSETS[this.props.assetId].name}`}
            assetId={assetBoxAssetId}
            value={this.state.price === undefined ? undefined : toString(this.state.price, ASSETS[assetBoxAssetId].decimal)}
            onChangeValue={this.onSetPrice}
          />
        </Screen>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center'
  },
  title: {
    marginBottom: 8
  }
})
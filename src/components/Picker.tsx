
import * as React from 'react'
import { Picker, StyleSheet } from 'react-native'
import _ from 'lodash'

const Item = Picker.Item

interface Item {
  label: string
  value: string
}

interface Props {
  onValueChange: (value: string) => void
  selectedValue?: string
  data: Array<Item>
}

export default class FlipPicker extends React.Component <Props> {
  public renderItem (item: Item) {
    return (
      <Item key={item.value} label={item.label} value={item.value} />
    )
  }

  public render () {
    return (
      <Picker
        style={styles.picker}
        selectedValue={this.props.selectedValue}
        onValueChange={this.props.onValueChange}
      >
        {_.map(this.props.data, (item) => this.renderItem(item))}
      </Picker>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: 'white'
  }
})
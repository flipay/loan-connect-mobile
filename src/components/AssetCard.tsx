import * as React from "react";

import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";

interface Props {
  image: ImageSourcePropType;
  name: string;
  amount: number;
  price?: number;
  unit?: string;
  isFiat?: boolean;
}

export default class AssetCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    console.log('kendo jaa eieie', this.props.image, typeof this.props.image)
    return (
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Image
            source={this.props.image}
          />
          <Text>{this.props.name}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text>{`${this.props.amount} ${this.props.unit || "THB"}`}</Text>
          {!this.props.isFiat && (
            <Text>{`${(this.props.price || 0) * this.props.amount} THB`}</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderWidth: 0.5,
    shadowColor: 'black',
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  valueContainer: {
    alignItems: "flex-end"
  }
});

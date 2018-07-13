import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class DeviceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {

    return(
      <View style={styles.card}>
        <Text>Currently connected to:</Text>
        <Text>{this.props.connectedDevice.name}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    // backgroundColor: '#414141',
    height: 40,
  }
})

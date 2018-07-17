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

    let connectionStatus;
    if (props.connectedDevice.connected) {
      connectionStatus = true;
    } else {
      connectionStatus = false;
    }

    this.state = {
      isConnected: connectionStatus
    }
  }

  componentDidMount() {

  }

  render() {
    if (this.state.isConnected) {
      return(
        <View style={styles.card}>
          <Text fontSize='20'>Currently connected to:</Text>
          <Text fontSize='20'>{this.props.connectedDevice.name}</Text>
        </View>
      )
    } else {
      return(
        <View style={styles.card}>
          <Text fontSize='20'>No device connected.</Text>
        </View>
      )
    }

  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    // backgroundColor: '#414141',
    height: 40,
    // fontSize: 20,
    // color: '#414141'
  }
})

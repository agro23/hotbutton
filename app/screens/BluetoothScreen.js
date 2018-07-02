import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';

export default class BluetoothScreen extends Component {
  constructor(props) {
    super(props);
    this.manager = new BleManager();
    this.state = {
      managerState: 'initialized',
      devices: [
        {name: 'initial'}
      ],
      deviceName: 'initial state'
    };
  }

  componentWillMount() {
    const ble_subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        ble_subscription.remove();
      } else {
        this.setState({ managerState: state });
      }
    }, true);
  }

  scanAndConnect() {
    this.setState({scanStatus: 'entering scan and connect'});
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          // Handle error (scanning will be stopped automatically)
          console.log(error);
          this.setState({scanStatus: 'error in scan. ' + error.message});
          return
        } else {
          this.setState({scanStatus: 'devices found'});
          this.setState({
            devices: this.state.devices.push(device),
            deviceName: device.name
          });
          // connect at this point
        }

    });
  }

  render() {
    return(
      <View>
        <Text>Bluetooth Testing Screen</Text>
        <Button title="Scan" onPress={() => this.scanAndConnect()}/>
        <Text>Manager state: {this.state.managerState}</Text>
        <Text>Device name: {this.state.deviceName}</Text>
        <FlatList
          data={this.state.devices}
          keyExtractor={item => item.name}
          renderItem={({item}) => (<Text>{item.name}</Text>)}
        />
        <Text>{this.state.scanStatus}</Text>
      </View>
    )
  }
}

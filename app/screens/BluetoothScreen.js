import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';

export default class BluetoothScreen extends Component {
  constructor(props) {
    super(props);
    this.manager = new BleManager();
  }

  componentWillMount() {
    const ble_subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        ble_subscription.remove();
      } else {
        console.log('manager not powered on:', state);
      }
    }, true);
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log('error in scan');
            return
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device.name === 'TI BLE Sensor Tag' ||
            device.name === 'SensorTag') {
              console.log('known device');
            // Stop scanning as it's not necessary if you are scanning for one device.
            this.manager.stopDeviceScan();

            // Proceed with connection.
        } else {
          console.log('device name:', device.name);
        }

    });
  }

  render() {
    return(
      <View>
        <Text>Bluetooth Testing Screen</Text>
      </View>
    )
  }
}

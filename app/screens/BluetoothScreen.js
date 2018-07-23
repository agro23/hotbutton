import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  FlatList
} from 'react-native';

import DeviceCard from '../components/DeviceCard';
const uartServiceId = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const rxCharId = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
const txCharId = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

const customServiceId = "9e5c00cc-7541-4205-8df1-74f41e2fb968";
const clickCharId = "0001";

//import BleManager from 'react-native-ble-manager';
// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class BluetoothScreen extends Component {
  static navigationOptions = {
    title: 'Device Manager',
  }

  constructor(props){
    super(props)

    this.state = {
      scanning: false,
      peripherals: new Map(),
      connectedDevice: {},
      isConnected: false,
      subscribedCharacteristicValue: 'no clicks yet',
      connectedServices: [],
      connectedCharacteristics: []
    }

    this.BleManager = this.props.screenProps.BleManager;
    this.BleManagerEmitter = this.props.screenProps.BleManagerEmitter;

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    // this.handleStopScan = this.handleStopScan.bind(this);
    // this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    // this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);

  }

  componentDidMount() {
    console.log('bt screen mount');

    this.handlerDiscover = this.BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    // this.handlerStop = this.BleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    // this.handlerDisconnect = this.BleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    // this.handlerUpdate = this.BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
      });
    }
  }

  componentWillUnmount() {
    console.log('bt screen unmount');
    this.handlerDiscover.remove();
    // this.handlerStop.remove();
    // this.handlerDisconnect.remove();
    //this.handlerUpdate.remove();
  }

  // handleDisconnectedPeripheral(data) {
  //   let peripherals = this.state.peripherals;
  //   let peripheral = peripherals.get(data.peripheral);
  //   if (peripheral) {
  //     peripheral.connected = false;
  //     peripherals.set(peripheral.id, peripheral);
  //     this.setState({
  //       peripherals: peripherals,
  //       isConnected: false,
  //       connectedDevice: {}
  //     });
  //   }
  //   console.log('Disconnected from ' + data.peripheral);
  // }
  //
  // handleUpdateValueForCharacteristic(data) {
  //   console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  //   this.setState({subscribedCharacteristicValue: data.value});
  // }

  // handleStopScan() {
  //   this.setState({ scanning: false });
  // }

  handleDiscoverPeripheral(peripheral){
    console.log('peripheral handler fired');
    var peripherals = this.state.peripherals;
    if (!peripherals.has(peripheral.id)){
      console.log('Got ble peripheral', peripheral);
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
  }

  startScan() {
    console.log('starting scan');
    if (!this.state.scanning) {
      try {
        this.BleManager.scan([], 30, false).then((results) => {
          this.setState({scanning:true});
        });
      } catch(error) {
        console.log('error in scan', error);
      }
    }
  }

  connect(peripheral) {
    this.BleManager.stopScan();
    this.setState({ scanning: false });
    this.BleManager.connect(peripheral.id).then(() => {
      let peripherals = this.state.peripherals;
      let p = peripherals.get(peripheral.id);
      if (p) {
        p.connected = true;
        peripherals.set(peripheral.id, p);
        console.log('connected peripheral object:', p);
        this.setState({
          peripherals,
          connectedDevice: p,
          isConnected: true
        });
      }
      setTimeout(() => {
        this.BleManager.retrieveServices(peripheral.id).then((serviceData) => {
          // add that data to state
          this.setState({
            connectedServices: serviceData.services,
            connectedCharacteristics: serviceData.characteristics
          });
          console.log('adding subscriction to characteristic with id: ', clickCharId);
          setTimeout(() => {
            this.BleManager.startNotification(peripheral.id, customServiceId, clickCharId)
            .then(() => { console.log('Started notification on characteristic: ', clickCharId) })
            .catch((error) => { console.log('Error subscribing to characteristic') });
            this.BleManagerEmitter.addListener(
              'BleManagerDidUpdateValueForCharacteristic',
              ({ value }) => {
                // Convert bytes array to string here
                console.log('value in char change listener', value);
                this.setState({subscribedCharacteristicValue: value});
              }
            );
          }, 200);
          // this.props.screenProps.setDeviceInfo(this.state.connectedDevice, customServiceId, clickCharId);  //send subscription to App.js
        }).catch((error) => console.log('Error retrieving peripheral services: ', error));
      }, 900);
    }).catch((error) => {
      console.log('Connection error', error);
    });
  }

  disconnectDevice() {
    if(this.state.connectedDevice.id) {
      this.BleManager.stopNotification(this.state.connectedDevice.id, customServiceId, clickCharId)
        .then(() => { console.log('Stopping notification on characteristic w/ id: ', clickCharId) })
        .catch((error) => { console.log('Error stopping notification on characteristic.', error) });
      this.BleManager.disconnect(this.state.connectedDevice.id).then(() => {
        this.setState({
          connectedDevice: {},
          isConnected: false,
          connectedServices: [],
          connectedCharacteristics: []
        })
      }).catch((error) => {
        console.log('Error disconnecting: ', error);
      });
    }
  }


  render() {
    const list = Array.from(this.state.peripherals.values());

    let disconnectButton;
    if (this.state.isConnected) {
      disconnectButton =
        <TouchableHighlight
          style={{marginTop: 40,margin: 20, padding:20, backgroundColor:'#ccc'}}
          onPress={() => this.disconnectDevice() }>
          <Text>Disconnect</Text>
        </TouchableHighlight>;
    } else {
      disconnectButton = null;
    }

    return (
      <View style={styles.container}>
        <DeviceCard
          connectedDevice={this.state.connectedDevice}
          lastClick={this.state.subscribedCharacteristicValue}
        />
        <TouchableHighlight
          style={styles.scanButton}
          onPress={() => this.startScan() }>
          <Text>{this.state.scanning ? 'Scanning' : 'Scan for devices'}</Text>
        </TouchableHighlight>

        {disconnectButton}

        {/* <Text>Connected device: {this.state.connectedDevice.name}</Text>
        <Text>ID: {this.state.connectedDevice.id}</Text> */}
        {/* <Text>Milliseconds at last press: {this.state.subscribedCharacteristicValue}</Text> */}
        <ScrollView style={styles.scroll}>
          {(list.length == 0) &&
            <View style={{flex:1, margin: 20}}>
              <Text style={{textAlign: 'center'}}>No peripherals</Text>
            </View>
          }
          <FlatList
            data={list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              const color = item.connected ? 'green' : '#fff';
              return (
                <TouchableHighlight onPress={() => this.connect(item) }>
                  <View style={[styles.row, {backgroundColor: color}]}>
                    <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
                    <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 10}}>{item.id}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 15,
  },
  row: {
    margin: 10
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    margin: 15,
    backgroundColor:'#b8d6ce'
  }
});

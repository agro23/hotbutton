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
import BleManager from 'react-native-ble-manager';

const uartServiceId = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const rxCharId = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
const txCharId = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

const customServiceId = "9e5c00cc-7541-4205-8df1-74f41e2fb968";
const clickCharId = "0001";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class BluetoothScreen extends Component {
  static navigationOptions = {
    title: 'Device Manager',
  }

  constructor(){
    super()

    this.state = {
      scanning: false,
      peripherals: new Map(),
      connectedDevice: {},
      isConnected: false,
      subscribedCharacteristic: 'no clicks yet',
      connectedServices: [],
      connectedCharacteristics: []
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);

  }

  componentDidMount() {
    console.log('test screenprops', this.props.screenProps);
    BleManager.start({showAlert: true});

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );

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
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    this.setState({subscribedCharacteristic: data.value});
  }

  handleStopScan() {
    this.setState({ scanning: false });
  }

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
        BleManager.scan([], 120, false).then((results) => {
          this.setState({scanning:true});
        });
      } catch(error) {
        console.log('error in scan', error);
      }
    }
  }

  connect(peripheral) {
    if (peripheral){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
        this.setState({isConnected: false});
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            console.log('connected peripheral object:', p);
            this.setState({
              peripherals,
              connectedDevice: p
            });
          }
          this.retrieveServicesAndCharacteristics(peripheral.id);
        }).catch((error) => {
          console.log('Connection error', error);
        });
        BleManager.stopScan();
      }
    }
  }

  retrieveServicesAndCharacteristics(peripheralId) {
    BleManager.retrieveServices(peripheralId).then((serviceData) => {
      // add that data to state
      this.setState({
        connectedServices: serviceData.services,
        connectedCharacteristics: serviceData.characteristics
      });
      this.subscribeToCharacteristic(peripheralId, uartServiceId, rxCharId); //subscription local to this screen, no longer used
      this.props.screenProps.setDeviceInfo(this.state.connectedDevice, customServiceId, clickCharId);  //send subscription to App.js
    }).catch((error) => console.log('Error retrieving peripheral services: ', error));
  }

  subscribeToCharacteristic(peripheralId, serviceId, characteristicId) {
    console.log('adding subscriction to characteristic with id: ', characteristicId);
    BleManager.startNotification(peripheralId, serviceId, characteristicId);
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value }) => {
        // Convert bytes array to string here
        console.log('value in change listener', value);
        this.setState({subscribedCharacteristic: value});
      }
    );
  }

  disconnectDevice() {
    if(this.state.connectedDevice.id) {
      BleManager.disconnect(this.state.connectedDevice.id).then(() => {
        this.setState({
          connectedDevice: {},
          isConnected: false,
          subscribedCharacteristic: '',
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

    return (
      <View style={styles.container}>
        <DeviceCard connectedDevice={this.state.connectedDevice}/>
        <TouchableHighlight
          style={{marginTop: 40,margin: 20, padding:20, backgroundColor:'#ccc'}}
          onPress={() => this.startScan() }>
          <Text>{this.state.scanning ? 'Scanning' : 'Scan for devices'}</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={{marginTop: 40,margin: 20, padding:20, backgroundColor:'#ccc'}}
          onPress={() => this.disconnectDevice() }>
          <Text>Disconnect</Text>
        </TouchableHighlight>

        {/* <Text>Connected device: {this.state.connectedDevice.name}</Text>
        <Text>ID: {this.state.connectedDevice.id}</Text> */}
        <Text>Milliseconds at last press: {this.state.subscribedCharacteristic}</Text>
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
    margin: 10,
  },
  row: {
    margin: 10
  },
});

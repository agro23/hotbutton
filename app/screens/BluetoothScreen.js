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
  ListView,
  ScrollView,
  AppState,
  Dimensions,
  FlatList
} from 'react-native';

import BleManager from 'react-native-ble-manager';

const window = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const uartServiceId = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const rxCharId = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
const txCharId = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class BluetoothScreen extends Component {
  constructor(){
    super()

    this.state = {
      scanning: false,
      peripherals: new Map(),
      connectedDevice: {},
      appState: '',
      isConnected: false
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);

  }

  componentDidMount() {
    // BleManager.start({showAlert: true});
    AppState.addEventListener('change', this.handleAppStateChange);
    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );

    // if (Platform.OS === 'android' && Platform.Version >= 23) {
    //     PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
    //         if (result) {
    //           console.log("Permission is OK");
    //         } else {
    //           PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
    //             if (result) {
    //               console.log("User accept");
    //             } else {
    //               console.log("User refuse");
    //             }
    //           });
    //         }
    //   });
    // }
  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
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
  }

  handleStopScan() {
    this.setState({ scanning: false });
  }

  startScan() {
    if (!this.state.scanning) {
      this.setState({peripherals: new Map()});
      BleManager.scan([], 120, false).then((results) => {
        this.setState({scanning:true});
      });
    }
  }

  handleDiscoverPeripheral(peripheral){
    var peripherals = this.state.peripherals;
    if (!peripherals.has(peripheral.id)){
      // console.log('Got ble peripheral', peripheral);
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
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
          //this.parentCallbacks.setConnectedDevice(p); //send connected device to App.js
          this.retrieveServicesAndCharacteristics(peripheral.id);
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }
  }

  retrieveServicesAndCharacteristics(peripheralId) {
    BleManager.retrieveServices(peripheralId).then((serviceData) => {
      console.log('Retrieved peripheral services', serviceData);
      // add that data to state
      this.setState({
        connectedServices: serviceData.services,
        connectedCharacteristics: serviceData.characteristics
      });
      console.log('state services: ', this.state.connectedServices);
      // this.subscribeToCharacteristic(peripheralId, uartServiceId, rxCharId); //subscription local to this screen, no longer used
      this.props.setDeviceInfo(this.state.connectedDevice, uartServiceId, rxCharId);  //send subscription to App.js
    });
  }

  // subscribeToCharacteristic(peripheralId, serviceId, characteristicId) {
  //   console.log('adding subscriction to characteristic with id: ', characteristicId);
  //   BleManager.startNotification(peripheralId, serviceId, characteristicId);
    // bleManagerEmitter.addListener(
    //   'BleManagerDidUpdateValueForCharacteristic',
    //   ({ value }) => {
    //     // Convert bytes array to string here
    //     console.log('value in change listener', value);
    //     let convertedMillis = this.convertToString(value);
    //     this.setState({subscribedCharacteristic: convertedMillis});
    //     console.log(`Value changed for subscribed characteristic to: ${convertedMillis}`);
    //   }
    // );
  // }

  convertToString(numArray) {
    let string = '';
    for(i = 0; i < numArray.length; i++) {
      string += String.fromCharCode(numArray[i]);
    }
    return string;
  }

  // renderServiceList() {
  //   if (this.state.connectedDeviceServices) {
  //     return(
  //       <View>
  //         <Text>Service IDs:</Text>
  //         <FlatList
  //           data={this.state.connectedDeviceServices}
  //           renderItem={({item}) => <Text>{item}</Text>}
  //         />
  //       </View>
  //     )
  //   } else {
  //     return(
  //       null
  //     )
  //   }
  // }

  render() {
    const list = Array.from(this.state.peripherals.values());
    const dataSource = ds.cloneWithRows(list);

    return (
      <View style={styles.container}>
        <TouchableHighlight style={{marginTop: 40,margin: 20, padding:20, backgroundColor:'#ccc'}} onPress={() => this.startScan() }>
          <Text>{this.state.scanning ? 'Scanning' : 'Scan for devices'}</Text>
        </TouchableHighlight>

        <Text>Connected device: {this.state.connectedDevice.name}</Text>
        <Text>ID: {this.state.connectedDevice.id}</Text>

        {/* {this.renderServiceList()} */}

        <Text>Milliseconds at last press: {this.state.subscribedCharacteristic}</Text>
        <ScrollView style={styles.scroll}>
          {(list.length == 0) &&
            <View style={{flex:1, margin: 20}}>
              <Text style={{textAlign: 'center'}}>No peripherals</Text>
            </View>
          }
          <ListView
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={(item) => {
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
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height
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

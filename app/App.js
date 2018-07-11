/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeEventEmitter
} from 'react-native';

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import { createStackNavigator } from 'react-navigation';
import ButtonScreen from './screens/ButtonScreen';
import ChartScreen from './screens/ChartScreen';
import ProfileScreen from './screens/ProfileScreen';
import BluetoothScreen from './screens/BluetoothScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    BleManager.start({showAlert: true});
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.state = {
      connectedDevice: {},
      isConnected: false,
      subscribedServiceId: '',
      subscribedCharId: ''
    };
  }

  componentDidMount() {
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  setDeviceInfo(deviceObject, serviceId, charId) {
    this.setState({
      connectedDevice: deviceObject,
      subscribedServiceId: serviceId,
      subscribedCharId: charId
    });
    BleManager.startNotifiction(this.state.connectedDevice.id, serviceId, charId);
  }

  render() {
    return (
      <NavigationStack screenProps={{name: "test",  setDeviceInfo: () => this.setDeviceInfo()}}/> //, setDeviceInfo = () => this.setDeviceInfo()}
    );
  }
}

const NavigationStack = createStackNavigator(
  {
    home: ButtonScreen,
    main: MainScreen,
    chart: ChartScreen,
    profile: ProfileScreen,
    bluetooth: BluetoothScreen,
    login: LoginScreen,
    signup: SignupScreen
  },
  {
    initialRouteName: 'home'
  }
);

//not using these right now, leaving as example
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

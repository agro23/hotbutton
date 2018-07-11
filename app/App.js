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
  NativeEventEmitter,
  AppState
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

    this.state = {
      connectedDevice: {},
      isConnected: false,
      subscribedServiceId: '',
      subscribedCharId: '',
      lastClick: 'no click recorded'
    };

    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    this.setState({ lastClick: data.value });
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

  setDeviceInfo(deviceObject, serviceId, charId) {
    console.log('setting device in app: ', deviceObject, serviceId, charId);
    this.setState({
      connectedDevice: deviceObject,
      isConnected: true,
      subscribedServiceId: serviceId,
      subscribedCharId: charId
    });
    BleManager.retrieveServices(deviceObject.id).then({
      BleManager.startNotifiction(deviceObject.id, serviceId, charId);
    });
  }

  render() {
    return (
      <NavigationStack screenProps={{
        lastClick: this.state.lastClick,
        connectedDevice: this.state.connectedDevice,
        setDeviceInfo: (deviceObject, serviceId, charId) => this.setDeviceInfo(deviceObject, serviceId, charId) //callback to be used for global pairing
      }}/>
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

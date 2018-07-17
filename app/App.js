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

import * as firebase from 'firebase';
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

//to remove deprecation warning
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    BleManager.start({showAlert: true});

    this.state = {
      appState: '',
      connectedDevice: {},
      isConnected: false,
      subscribedServiceId: '',
      subscribedCharId: '',
      lastClick: 'no click recorded',
      currentUser: {}
    };

    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    //get current user with observer on Auth
    firebase.auth().onAuthStateChanged((user) => {
      console.log('current user in app', user);
      if (user) {
        this.setState({ currentUser: user });
      } else {
        this.setState({ currentUser: {} });
      }
    });
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
    BleManager.retrieveServices(deviceObject.id).then(() => {
      this.subscribeToCharacteristic(deviceObject.id, serviceId, charId);
    });
  }

  subscribeToCharacteristic(peripheralId, serviceId, characteristicId) {
    console.log('adding subscriction to characteristic with id: ', characteristicId);
    BleManager.startNotification(peripheralId, serviceId, characteristicId);
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value }) => {
        // Convert bytes array to string here
        console.log('value in change listener', value);
        let convertedMillis = this.convertToString(value);
        this.setState({subscribedCharacteristic: value});
        console.log(`Value changed for subscribed characteristic to: ${convertedMillis}`);
      }
    );
  }

  convertToString(numArray) {
    let string = '';
    for(i = 0; i < numArray.length; i++) {
      string += String.fromCharCode(numArray[i]);
    }
    return string;
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationStack screenProps={{
          lastClick: this.state.lastClick,
          connectedDevice: this.state.connectedDevice,
          setDeviceInfo: (deviceObject, serviceId, charId) => this.setDeviceInfo(deviceObject, serviceId, charId), //callback to be used for global pairing
          currentUser: this.state.currentUser
        }}/>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  }
});
